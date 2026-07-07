// import { Request, Response } from 'express';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import Resume from '../models/Resume';

// export const generateCoverLetter = async (req: Request, res: Response) => {
//     try {
//         const { resumeId, jobTitle, companyName, jobDescription } = req.body;

//         if (!resumeId) {
//             return res.status(400).json({ message: 'Resume ID is required.' });
//         }

//         const resume = await Resume.findById(resumeId);
//         if (!resume) {
//             return res.status(404).json({ message: 'Resume not found.' });
//         }

//         // Check ownership
//         // @ts-ignore
//         if (resume.user.toString() !== req.user._id.toString()) {
//             return res.status(401).json({ message: 'Not authorized.' });
//         }

//         if (!process.env.GEMINI_API_KEY) {
//             return res.status(500).json({ message: 'Gemini API key is not configured.' });
//         }

//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         // Using the user's preferred model gemini-3-flash-preview
//         const model = genAI.getGenerativeModel({
//             model: 'gemini-3-flash-preview',
//             generationConfig: { temperature: 0.7 }
//         });

//         const prompt = `
// You are an expert career coach and professional writer. 
// Generate a high-authority, tailored cover letter using the following information:

// Candidate Resume Data (JSON):
// ${JSON.stringify(resume.data)}

// Job Context (Optional):
// Job Title: ${jobTitle || 'Not specified'}
// Company Name: ${companyName || 'Not specified'}
// Job Description: ${jobDescription || 'Not specified'}

// Instructions:
// 1. Write a professional, punchy, and modern cover letter.
// 2. Align the candidate's skills and experience from the resume with the specific job requirements.
// 3. If specific job details aren't provided, create a powerful, generic yet professional cover letter template based on the resume.
// 4. Keep it concise (max 300-400 words).
// 5. Use a confident but humble tone.
// 6. Address the hiring manager appropriately.

// Response Format:
// ONLY respond with the generated cover letter text. No preamble, no markdown formatting like "Here is your cover letter", just the text itself.
// `;

//         console.log('Generating cover letter with Gemini for resume:', resumeId);
//         const result = await model.generateContent(prompt);
//         const responseText = result.response.text();

//         res.status(200).json({ coverLetter: responseText });

//     } catch (error: any) {
//         console.error('Error generating cover letter:', error);
//         res.status(500).json({ message: 'Error generating cover letter.', error: error.message });
//     }
// };

/////////////
import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Resume from '../models/Resume';
import User from '../models/User';
import { AI_COSTS } from '../config/aiCosts';

export const generateCoverLetter = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // ✅ CREDIT CHECK
        if (user.credits < AI_COSTS.COVER_LETTER) {
            return res.status(403).json({
                message: 'Not enough credits. Please upgrade your plan.'
            });
        }

        const { resumeId, jobTitle, companyName, jobDescription } = req.body;

        if (!resumeId) {
            return res.status(400).json({ message: 'Resume ID is required.' });
        }

        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found.' });
        }

        // ✅ Ownership check
        // @ts-ignore
        if (resume.user.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                message: 'Gemini API key is not configured.'
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: 'gemini-3-flash-preview',
            generationConfig: { temperature: 0.7 }
        });

        const prompt = `
You are an expert career coach and professional writer.

Write ONLY the cover letter text (no JSON, no markdown).

Resume:
${JSON.stringify(resume.data)}

Job Title: ${jobTitle || 'Not specified'}
Company: ${companyName || 'Not specified'}
Job Description: ${jobDescription || 'Not specified'}
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        if (!responseText) {
            return res.status(500).json({
                message: 'Empty response from AI'
            });
        }

        // ✅ DEDUCT CREDITS AFTER SUCCESS
        user.credits -= AI_COSTS.COVER_LETTER;
        await user.save();

        return res.status(200).json({
            coverLetter: responseText.trim(),
            creditsLeft: user.credits
        });

    } catch (error: any) {
        console.error('Cover Letter Error:', error);

        return res.status(500).json({
            message: 'Error generating cover letter.',
            error: error.message
        });
    }
};