
// // /////////
// // import { Request, Response } from 'express';
// // import { GoogleGenerativeAI } from '@google/generative-ai';
// // import Resume from '../models/Resume';
// // import User from '../models/User';
// // import { AI_COSTS } from '../config/aiCosts';

// // // Helper to safely extract JSON
// // const extractJSON = (text: string) => {
// //     let cleaned = text
// //         .replace(/```json/g, '')
// //         .replace(/```/g, '')
// //         .trim();

// //     return JSON.parse(cleaned);
// // };

// // export const generateInterviewPrep = async (req: Request, res: Response) => {
// //     try {
// //         // @ts-ignore
// //         const userId = req.user?._id;

// //         if (!userId) {
// //             return res.status(401).json({ message: 'Unauthorized' });
// //         }

// //         const user = await User.findById(userId);

// //         if (!user) {
// //             return res.status(404).json({ message: 'User not found.' });
// //         }

// //         // ✅ CREDIT CHECK
// //         if (user.credits < AI_COSTS.INTERVIEW_PREP) {
// //             return res.status(403).json({
// //                 message: 'Not enough credits. Please upgrade your plan.'
// //             });
// //         }

// //         const { resumeId, jobDescription } = req.body;

// //         if (!resumeId || !jobDescription) {
// //             return res.status(400).json({
// //                 message: 'Resume ID and job description are required.'
// //             });
// //         }

// //         const resume = await Resume.findById(resumeId);

// //         if (!resume) {
// //             return res.status(404).json({ message: 'Resume not found.' });
// //         }

// //         // ✅ Ownership check
// //         // @ts-ignore
// //         if (resume.user.toString() !== userId.toString()) {
// //             return res.status(401).json({ message: 'Not authorized.' });
// //         }

// //         if (!process.env.GEMINI_API_KEY) {
// //             return res.status(500).json({
// //                 message: 'Gemini API key is not configured.'
// //             });
// //         }

// //         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// //         const model = genAI.getGenerativeModel({
// //             model: 'gemini-2.5-flash',
// //             generationConfig: { temperature: 0.7 }
// //         });

// //         const prompt = `
// // You are an AI interview coach.

// // Return ONLY valid JSON:

// // {
// //   "questions": [
// //     {
// //       "question": "",
// //       "category": "Technical | Behavioral | HR",
// //       "sampleAnswer": ""
// //     }
// //   ]
// // }

// // Rules:
// // - Generate 15–20 questions
// // - Mostly Technical
// // - Based on resume + job description
// // - Match experience level

// // Resume:
// // ${JSON.stringify(resume.data)}

// // Job Description:
// // ${jobDescription}
// // `;

// //         const result = await model.generateContent(prompt);
// //         const responseText = result.response.text();

// //         if (!responseText) {
// //             return res.status(500).json({
// //                 message: 'Empty response from AI'
// //             });
// //         }

// //         let data;

// //         try {
// //             data = extractJSON(responseText);
// //         } catch (err) {
// //             console.error('Parse error raw:', responseText);

// //             return res.status(500).json({
// //                 message: 'Failed to parse AI response',
// //                 raw: responseText
// //             });
// //         }

// //         // ✅ DEDUCT CREDITS AFTER SUCCESS
// //         user.credits -= AI_COSTS.INTERVIEW_PREP;
// //         await user.save();

// //         return res.status(200).json({
// //             ...data,
// //             creditsLeft: user.credits
// //         });

// //     } catch (error: any) {
// //         console.error('Interview Prep Error:', error);

// //         return res.status(500).json({
// //             message: 'Error generating interview prep',
// //             error: error.message
// //         });
// //     }
// // };

// //////////////////
// import { Request, Response } from 'express';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { z } from 'zod';

// import Resume from '../models/Resume';
// import User from '../models/User';
// import { AI_COSTS } from '../config/aiCosts';

// /**
//  * =========================================
//  * ZOD VALIDATION SCHEMA
//  * =========================================
//  */

// const InterviewPrepSchema = z.object({
//     questions: z.array(
//         z.object({
//             question: z.string(),
//             category: z.enum(['Technical', 'Behavioral', 'HR']),
//             sampleAnswer: z.string()
//         })
//     )
// });

// /**
//  * =========================================
//  * SAFE JSON EXTRACTION
//  * =========================================
//  */

// const extractJSON = (text: string) => {
//     try {
//         const cleaned = text
//             .replace(/```json/g, '')
//             .replace(/```/g, '')
//             .trim();

//         const match = cleaned.match(/\{[\s\S]*\}/);

//         if (!match) {
//             throw new Error('No JSON found');
//         }

//         return JSON.parse(match[0]);

//     } catch (error) {
//         console.error('JSON Extraction Failed:', text);
//         throw new Error('Invalid AI JSON response');
//     }
// };

// /**
//  * =========================================
//  * GENERATE INTERVIEW PREP
//  * =========================================
//  */

// export const generateInterviewPrep = async (
//     req: Request,
//     res: Response
// ) => {
//     try {

//         /**
//          * =========================================
//          * AUTH CHECK
//          * =========================================
//          */

//         // @ts-ignore
//         const userId = req.user?._id;

//         if (!userId) {
//             return res.status(401).json({
//                 message: 'Unauthorized'
//             });
//         }

//         /**
//          * =========================================
//          * FIND USER
//          * =========================================
//          */

//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({
//                 message: 'User not found'
//             });
//         }

//         /**
//          * =========================================
//          * CREDIT CHECK
//          * =========================================
//          */

//         if (user.credits < AI_COSTS.INTERVIEW_PREP) {
//             return res.status(403).json({
//                 message: 'Not enough credits. Please upgrade.'
//             });
//         }

//         /**
//          * =========================================
//          * VALIDATE BODY
//          * =========================================
//          */

//         const { resumeId, jobDescription } = req.body;

//         if (!resumeId || !jobDescription) {
//             return res.status(400).json({
//                 message: 'Resume ID and job description are required'
//             });
//         }

//         /**
//          * =========================================
//          * FIND RESUME
//          * =========================================
//          */

//         const resume = await Resume.findById(resumeId);

//         if (!resume) {
//             return res.status(404).json({
//                 message: 'Resume not found'
//             });
//         }

//         /**
//          * =========================================
//          * OWNERSHIP CHECK
//          * =========================================
//          */

//         // @ts-ignore
//         if (resume.user.toString() !== userId.toString()) {
//             return res.status(403).json({
//                 message: 'Not authorized'
//             });
//         }

//         /**
//          * =========================================
//          * GEMINI API CHECK
//          * =========================================
//          */

//         if (!process.env.GEMINI_API_KEY) {
//             return res.status(500).json({
//                 message: 'Gemini API key not configured'
//             });
//         }

//         /**
//          * =========================================
//          * COMPACT RESUME DATA
//          * =========================================
//          */

//         const compactResume = {
//             personalInfo: resume.data?.personalInfo || {},
//             experience: resume.data?.experience || [],
//             education: resume.data?.education || [],
//             projects: resume.data?.projects || [],
//             skills: resume.data?.skills || [],
//             customSections: resume.data?.customSections || []
//         };

//         /**
//          * =========================================
//          * GEMINI MODEL
//          * =========================================
//          */

//         const genAI = new GoogleGenerativeAI(
//             process.env.GEMINI_API_KEY
//         );

//         const model = genAI.getGenerativeModel({
//             model: 'gemini-1.5-pro',
//             generationConfig: {
//                 temperature: 0.2,
//                 responseMimeType: 'application/json',
//                 topP: 0.8,
//                 topK: 40
//             }
//         });

//         /**
//          * =========================================
//          * PROMPT
//          * =========================================
//          */

//         const prompt = `
// You are an expert AI interview coach and senior technical recruiter.

// Generate personalized interview questions based on the candidate resume and the provided job description.

// IMPORTANT RULES:
// - Return ONLY valid JSON
// - No markdown
// - No explanations
// - No extra text
// - No comments
// - No trailing commas
// - Follow the exact schema below

// JSON SCHEMA:

// {
//   "questions": [
//     {
//       "question": "string",
//       "category": "Technical | Behavioral | HR",
//       "sampleAnswer": "string"
//     }
//   ]
// }

// REQUIREMENTS:
// - Generate 15 to 20 interview questions
// - Most questions should be Technical
// - Tailor questions to:
//   - candidate skills
//   - projects
//   - work experience
//   - education
//   - job description
// - Include behavioral questions for leadership/teamwork
// - Include practical engineering questions
// - Include system design questions if candidate is senior
// - Sample answers should be realistic and concise

// RESUME:
// ${JSON.stringify(compactResume, null, 2)}

// JOB DESCRIPTION:
// ${jobDescription}
// `;

//         /**
//          * =========================================
//          * AI GENERATION WITH RETRY
//          * =========================================
//          */

//         let parsedData: any = null;
//         let lastError: any = null;

//         for (let attempt = 1; attempt <= 3; attempt++) {

//             try {

//                 const result = await model.generateContent(prompt);

//                 const responseText = result.response.text();

//                 if (!responseText) {
//                     throw new Error('Empty AI response');
//                 }

//                 const extracted = extractJSON(responseText);

//                 parsedData = InterviewPrepSchema.parse(extracted);

//                 break;

//             } catch (error: any) {

//                 lastError = error;

//                 console.error(
//                     `Interview Prep Attempt ${attempt} Failed:`,
//                     error.message
//                 );

//                 if (attempt === 3) {
//                     throw error;
//                 }
//             }
//         }

//         /**
//          * =========================================
//          * FINAL VALIDATION
//          * =========================================
//          */

//         if (
//             !parsedData ||
//             !parsedData.questions ||
//             !Array.isArray(parsedData.questions)
//         ) {
//             return res.status(500).json({
//                 message: 'Failed to generate interview questions'
//             });
//         }

//         /**
//          * =========================================
//          * DEDUCT CREDITS
//          * =========================================
//          */

//         user.credits -= AI_COSTS.INTERVIEW_PREP;

//         await user.save();

//         /**
//          * =========================================
//          * SUCCESS RESPONSE
//          * IMPORTANT:
//          * FRONTEND EXPECTS:
//          * {
//          *   questions: [],
//          *   credits: number
//          * }
//          * =========================================
//          */

//         return res.status(200).json({
//             questions: parsedData.questions,
//             credits: user.credits
//         });

//     } catch (error: any) {

//         console.error('Interview Prep Error:', error);

//         return res.status(500).json({
//             message:
//                 error.message ||
//                 'Error generating interview prep'
//         });
//     }
// };

//////////////////
import { Request, Response } from 'express';
import { z } from 'zod';
import Resume from '../models/Resume';
import User from '../models/User';
import { AI_COSTS } from '../config/aiCosts';

const InterviewPrepSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      category: z.enum(['Technical', 'Project', 'HR']),
      sampleAnswer: z.string()
    })
  )
});

const extractJSON = (text: string) => {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7, cleaned.lastIndexOf('```')).trim();
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.substring(3, cleaned.lastIndexOf('```')).trim();
    }
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found');
    return JSON.parse(match[0]);
  } catch (error) {
    console.error('JSON Extraction Failed');
    throw new Error('Invalid AI JSON response');
  }
};

export const generateInterviewPrep = async (req: Request, res: Response) => {
  console.log('🔥 Interview Prep Controller HIT!');
  
  try {
    // @ts-ignore
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.credits < AI_COSTS.INTERVIEW_PREP) {
      return res.status(403).json({ message: 'Not enough credits. Please upgrade.' });
    }

    const { resumeId, jobDescription } = req.body;
    if (!resumeId || !jobDescription) {
      return res.status(400).json({ message: 'Resume ID and job description are required' });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    // @ts-ignore
    if (resume.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const skills = resume.data?.skills || [];
    const projects = resume.data?.projects || [];
    const experience = resume.data?.experience || [];
    const personalInfo = resume.data?.personalInfo || {};

//     const prompt = `Generate EXACTLY 10 interview questions based on the candidate's SPECIFIC skills and projects.

// RESUME:
// - Name: ${personalInfo.fullName || 'N/A'}
// - Skills: ${skills.join(', ') || 'general development'}
// - Projects: ${projects.map((p: any) => p.name).join(', ') || 'various'}
// - Experience: ${experience.length} roles

// JOB DESCRIPTION:
// ${jobDescription.substring(0, 500)}

// QUESTION DISTRIBUTION (EXACTLY 10):

// 1. SKILL-BASED TECHNICAL (6 questions):
// Ask fundamental technical questions about the candidate's top skills:
// - For each skill like JavaScript, React, Node.js, Socket.io, MongoDB, TypeScript, etc.
// - Ask "What is..." or "Explain..." or "How does... work?"
// - Examples: "What is hoisting in JavaScript?", "How does the virtual DOM work in React?", "What is Socket.io?", "Explain MongoDB aggregation"

// 2. PROJECT EXPLANATION (3 questions):
// Ask about the candidate's actual projects:
// - "Walk me through your [Project Name] project. What was your role?"
// - "What was the biggest challenge in [Project Name] and how did you overcome it?"
// - "What would you improve in [Project Name] if you had more time?"

// 3. HR / ROLE FIT (1 question):
// - "Why are you a good fit for this role?"

// Each sample answer must be 3-4 lines.

// CRITICAL: Return EXACTLY 10 questions. NOT more, NOT less.

// Return ONLY this JSON:
// {
//   "questions": [
//     {"question": "Q1", "category": "Technical", "sampleAnswer": "A1"},
//     {"question": "Q2", "category": "Technical", "sampleAnswer": "A2"},
//     {"question": "Q3", "category": "Technical", "sampleAnswer": "A3"},
//     {"question": "Q4", "category": "Technical", "sampleAnswer": "A4"},
//     {"question": "Q5", "category": "Technical", "sampleAnswer": "A5"},
//     {"question": "Q6", "category": "Technical", "sampleAnswer": "A6"},
//     {"question": "Q7", "category": "Project", "sampleAnswer": "A7"},
//     {"question": "Q8", "category": "Project", "sampleAnswer": "A8"},
//     {"question": "Q9", "category": "Project", "sampleAnswer": "A9"},
//     {"question": "Q10", "category": "HR", "sampleAnswer": "A10"}
//   ]
// }`;


const prompt = `Generate EXACTLY 10 interview questions based on the JOB DESCRIPTION requirements and the candidate's matching skills.

JOB DESCRIPTION:
${jobDescription.substring(0, 800)}

CANDIDATE RESUME:
- Skills: ${skills.join(', ') || 'general development'}
- Projects: ${projects.map((p: any) => p.name).join(', ') || 'various'}
- Experience: ${experience.length} roles

QUESTION DISTRIBUTION (EXACTLY 10):

1. JOB-REQUIRED TECHNICAL (6 questions):
Extract the key technical requirements from the job description (languages, frameworks, tools, concepts).
Ask fundamental questions about THOSE specific technologies:
- If job requires React → "What is the virtual DOM in React?" or "Explain React hooks like useState and useEffect"
- If job requires TypeScript → "What are TypeScript interfaces and how do they differ from types?"
- If job requires Node.js → "How does the event loop work in Node.js?"
- If job requires AWS → "Explain the difference between EC2 and Lambda"
- If job requires Docker → "What is containerization and how does Docker work?"
- If job requires MongoDB → "Explain MongoDB aggregation pipeline"
- Pick the TOP 6 technologies mentioned in the job description

2. PROJECT EXPLANATION (3 questions):
Ask about the candidate's projects that are RELEVANT to the job:
- "Walk me through your [Most Relevant Project] - what was your role?"
- "What challenges did you face in [Project] and how did you solve them?"
- "How does your experience with [Technology from project] prepare you for this role?"

3. ROLE FIT (1 question):
- "Looking at the job requirements, why are you a good fit for this role?"

IMPORTANT:
- Technical questions MUST be based on technologies mentioned in the JOB DESCRIPTION
- If the job doesn't mention a technology, don't ask about it
- Each sample answer must be 3-4 lines
- Reference the candidate's actual experience where relevant

CRITICAL: Return EXACTLY 10 questions. NOT more, NOT less.

Return ONLY this JSON:
{
  "questions": [
    {"question": "Q1", "category": "Technical", "sampleAnswer": "A1"},
    {"question": "Q2", "category": "Technical", "sampleAnswer": "A2"},
    {"question": "Q3", "category": "Technical", "sampleAnswer": "A3"},
    {"question": "Q4", "category": "Technical", "sampleAnswer": "A4"},
    {"question": "Q5", "category": "Technical", "sampleAnswer": "A5"},
    {"question": "Q6", "category": "Technical", "sampleAnswer": "A6"},
    {"question": "Q7", "category": "Project", "sampleAnswer": "A7"},
    {"question": "Q8", "category": "Project", "sampleAnswer": "A8"},
    {"question": "Q9", "category": "Project", "sampleAnswer": "A9"},
    {"question": "Q10", "category": "HR", "sampleAnswer": "A10"}
  ]
}`;
    console.log('🤖 Calling OpenRouter API...');

    const fetchResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": "AI Resume Builder"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { 
            role: "system", 
            content: "You are an interview coach. Generate EXACTLY 10 questions in valid JSON. Ask technical questions about specific skills, project questions about actual projects. No markdown, no extra text." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 5000
      })
    });

    if (!fetchResponse.ok) {
      const errorText = await fetchResponse.text();
      console.error('❌ API Error:', errorText);
      return res.status(500).json({ message: 'AI service error' });
    }

    const result = await fetchResponse.json();
    const responseText = result.choices?.[0]?.message?.content || "";

    if (!responseText) return res.status(500).json({ message: 'Empty AI response' });

    let parsedData;
    try {
      const extracted = extractJSON(responseText);
      if (extracted.questions && extracted.questions.length > 10) {
        console.log(`⚠️ Truncating ${extracted.questions.length} to 10`);
        extracted.questions = extracted.questions.slice(0, 10);
      };
      parsedData = InterviewPrepSchema.parse(extracted);
    } catch (error: any) {
      console.error('❌ Parse Error:', error.message);
      return res.status(422).json({ 
        message: 'Failed to parse AI response', 
        raw: responseText.substring(0, 500)
      });
    }

    if (!parsedData?.questions?.length) {
      return res.status(500).json({ message: 'No questions generated' });
    }

    const technical = parsedData.questions.filter((q: any) => q.category === 'Technical').length;
    const project = parsedData.questions.filter((q: any) => q.category === 'Project').length;
    const hr = parsedData.questions.filter((q: any) => q.category === 'HR').length;

    console.log(`✅ Generated ${parsedData.questions.length} questions`);
    console.log(`   Technical: ${technical}, Project: ${project}, HR: ${hr}`);

    user.credits -= AI_COSTS.INTERVIEW_PREP;
    await user.save();

    return res.status(200).json({
      questions: parsedData.questions,
      total: parsedData.questions.length,
      breakdown: { technical, project, hr },
      credits: user.credits
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    return res.status(500).json({ message: error.message || 'Error generating interview prep' });
  }
};

