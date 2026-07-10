
// import { Request, Response } from 'express';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import Resume from '../models/Resume';
// import User from '../models/User';
// import { AI_COSTS } from '../config/aiCosts';

// export const generateCoverLetter = async (req: Request, res: Response) => {
//     try {
//         // @ts-ignore
//         const userId = req.user?._id;

//         if (!userId) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         // ✅ CREDIT CHECK
//         if (user.credits < AI_COSTS.COVER_LETTER) {
//             return res.status(403).json({
//                 message: 'Not enough credits. Please upgrade your plan.'
//             });
//         }

//         const { resumeId, jobTitle, companyName, jobDescription } = req.body;

//         if (!resumeId) {
//             return res.status(400).json({ message: 'Resume ID is required.' });
//         }

//         const resume = await Resume.findById(resumeId);

//         if (!resume) {
//             return res.status(404).json({ message: 'Resume not found.' });
//         }

//         // ✅ Ownership check
//         // @ts-ignore
//         if (resume.user.toString() !== userId.toString()) {
//             return res.status(401).json({ message: 'Not authorized.' });
//         }

//         if (!process.env.GEMINI_API_KEY) {
//             return res.status(500).json({
//                 message: 'Gemini API key is not configured.'
//             });
//         }

//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//         const model = genAI.getGenerativeModel({
//             model: 'gemini-3-flash-preview',
//             generationConfig: { temperature: 0.7 }
//         });

//         const prompt = `
// You are an expert career coach and professional writer.

// Write ONLY the cover letter text (no JSON, no markdown).

// Resume:
// ${JSON.stringify(resume.data)}

// Job Title: ${jobTitle || 'Not specified'}
// Company: ${companyName || 'Not specified'}
// Job Description: ${jobDescription || 'Not specified'}
// `;

//         const result = await model.generateContent(prompt);
//         const responseText = result.response.text();

//         if (!responseText) {
//             return res.status(500).json({
//                 message: 'Empty response from AI'
//             });
//         }

//         // ✅ DEDUCT CREDITS AFTER SUCCESS
//         user.credits -= AI_COSTS.COVER_LETTER;
//         await user.save();

//         return res.status(200).json({
//             coverLetter: responseText.trim(),
//             creditsLeft: user.credits
//         });

//     } catch (error: any) {
//         console.error('Cover Letter Error:', error);

//         return res.status(500).json({
//             message: 'Error generating cover letter.',
//             error: error.message
//         });
//     }
// };


import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Resume from '../models/Resume';
import User from '../models/User';
import { AI_COSTS } from '../config/aiCosts';

// Builds the shared prompt used by both providers
const buildPrompt = (resumeData: any, jobTitle: string, companyName: string, jobDescription: string) => `
You are an expert career coach and professional writer.

Write ONLY the cover letter text (no JSON, no markdown).

Resume:
${JSON.stringify(resumeData)}

Job Title: ${jobTitle || 'Not specified'}
Company: ${companyName || 'Not specified'}
Job Description: ${jobDescription || 'Not specified'}
`;

// ✅ Primary provider: Gemini
const tryGemini = async (prompt: string): Promise<string | null> => {
    if (!process.env.GEMINI_API_KEY) {
        console.warn('⚠️ Gemini API key not configured, skipping to fallback');
        return null;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-3-flash-preview',
            generationConfig: { temperature: 0.7 }
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        if (!responseText?.trim()) {
            console.warn('⚠️ Gemini returned empty response, falling back');
            return null;
        }

        return responseText.trim();
    } catch (error: any) {
        console.error('❌ Gemini failed:', error.message);
        return null;
    }
};

// ✅ Fallback provider: OpenRouter (same pattern as generateInterviewPrep)
const tryOpenRouter = async (prompt: string): Promise<string | null> => {
    try {
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
                        content: "You are an expert career coach and professional writer. Write ONLY the cover letter text — no JSON, no markdown, no extra commentary."
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!fetchResponse.ok) {
            const errorText = await fetchResponse.text();
            console.error('❌ OpenRouter API Error:', errorText);
            return null;
        }

        const result = await fetchResponse.json();
        const responseText = result.choices?.[0]?.message?.content || "";

        if (!responseText.trim()) {
            console.error('❌ OpenRouter returned empty response');
            return null;
        }

        return responseText.trim();
    } catch (error: any) {
        console.error('❌ OpenRouter failed:', error.message);
        return null;
    }
};

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

        const prompt = buildPrompt(resume.data, jobTitle, companyName, jobDescription);

        // ✅ Try Gemini first, fall back to OpenRouter if it fails or is unconfigured
        let responseText = await tryGemini(prompt);
        let provider = 'gemini';

        if (!responseText) {
            console.log('🔁 Falling back to OpenRouter...');
            responseText = await tryOpenRouter(prompt);
            provider = 'openrouter';
        }

        if (!responseText) {
            return res.status(500).json({
                message: 'Both AI providers failed to generate a cover letter. Please try again later.'
            });
        }

        console.log(`✅ Cover letter generated via ${provider}`);

        // ✅ DEDUCT CREDITS AFTER SUCCESS
        user.credits -= AI_COSTS.COVER_LETTER;
        await user.save();

        return res.status(200).json({
            coverLetter: responseText,
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