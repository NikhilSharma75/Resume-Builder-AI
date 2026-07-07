import { Request, Response } from 'express';
import Resume from '../models/Resume';
import { GoogleGenerativeAI } from '@google/generative-ai';
const pdf = require('pdf-parse');
import mammoth from 'mammoth';
import fs from 'fs';

export const uploadResume = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase();
        let extractedText = '';

        try {
            if (fileExtension === 'pdf') {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdf(dataBuffer);
                extractedText = data.text;
            } else if (fileExtension === 'docx') {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await mammoth.extractRawText({ buffer: dataBuffer });
                extractedText = data.value;
            } else if (fileExtension === 'txt') {
                extractedText = fs.readFileSync(filePath, 'utf-8');
            } else {
                return res.status(400).json({ message: 'Unsupported file format' });
            }
        } finally {
            // Clean up the uploaded file regardless of extraction outcome
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({ message: 'Failed to extract text from file' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({
            model: 'gemini-3-flash-preview',
            generationConfig: { temperature: 0.1 }
        });

        const prompt = `
        You are an expert resume parser. I will provide you with the text content of a resume.
        Your task is to extract the details and return them in a specific JSON structure.
        
        CRITICAL: ONLY return the JSON, no extra text, no markdown formatting.
        IMPORTANT:
- Preserve ALL bullet points separately.
- Never summarize achievements.
- Never merge bullets into paragraphs.
- Preserve every section found in the resume.
- If a section is unknown, include it in customSections.
- Preserve publication metadata including DOI, venue, authors, awards, and years.
        
        The JSON structure MUST be:
        {
            "personalInfo": {
                "fullName": "Candidate Full Name",
                "jobTitle": "Target or Current Job Title",
                "email": "email@example.com",
                "phone": "Phone number",
                "location": "City, Country",
                "summary": "Professional summary paragraph",
                "github": "URL if available",
                "linkedin": "URL if available"
            },
            "experience": [
                {
                    "company": "Company Name",
                    "position": "Job Title",
                    "location": "Location",
                    "startDate": "Month Year",
                    "endDate": "Month Year or Present",
                    "description": "Responsibilities and achievements"
                }
            ],
            "education": [
                {
                    "school": "University Name",
                    "degree": "Degree Title",
                    "location": "Location",
                    "startDate": "Year",
                    "endDate": "Year",
                    "description": "Optional details"
                }
            ],
            "projects": [
                {
                    "name": "Project Name",
                    "link": "URL",
                    "description": "Project details"
                }
            ],
            "skills": ["Skill 1", "Skill 2", "Skill 3"],
            "customSections": []
        }
        
        Resume text:
        ${extractedText}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let jsonStr = responseText.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.substring(7, jsonStr.lastIndexOf('```')).trim();
        } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.substring(3, jsonStr.lastIndexOf('```')).trim();
        }

        let parsedData;
        try {
            parsedData = JSON.parse(jsonStr);
            // Ensure skills is an array of strings
            if (parsedData.skills && Array.isArray(parsedData.skills)) {
                parsedData.skills = parsedData.skills.map((s: any) =>
                    typeof s === 'object' ? (s.items ? s.items.join(', ') : JSON.stringify(s)) : String(s)
                );
            }
        } catch (err) {
            console.error('Failed to parse Gemini JSON:', jsonStr);
            return res.status(500).json({ message: 'Failed to parse extracted data' });
        }

        // @ts-ignore
        const user = req.user;
        const resumeCount = await Resume.countDocuments({ user: user._id });

        if (!user.isSubscribed && resumeCount >= 2) {
            return res.status(403).json({
                message: 'Free limit reached. Upgrade to Pro to create more resumes.',
                limitReached: true
            });
        }

        const resume = await Resume.create({
            // @ts-ignore
            user: req.user._id,
            title: parsedData.personalInfo?.fullName ? `${parsedData.personalInfo.fullName}'s Resume` : 'Uploaded Resume',
            selectedTemplate: 'simple',
            isDraft: true,
            data: {
                ...parsedData,
                sectionsOrder: ['summary', 'experience', 'education', 'projects', 'skills'],
                settings: {
                    fontSize: 'medium',
                    fontFamily: 'times'
                }
            },
        });

        res.status(201).json(resume);

    } catch (error: any) {
        console.error('Error uploading/parsing resume:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
