// import { Request, Response } from 'express';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import User from '../models/User';

// // Retry helper
// const generateWithRetry = async (model: any, prompt: string, retries = 3) => {
//     try {
//         return await model.generateContent(prompt);
//     } catch (err: any) {
//         if (err.message?.includes('429') && retries > 0) {
//             await new Promise(res => setTimeout(res, 2000)); // wait 2 sec
//             return generateWithRetry(model, prompt, retries - 1);
//         }
//         throw err;
//     }
// };

// export const improveText = async (req: Request, res: Response) => {
//     try {
//         // @ts-ignore
//         const userId = req.user?._id;

//         if (!userId) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(401).json({ message: 'User not found' });
//         }

//         // Limit for free users
//         if (!user.isSubscribed && user.aiUsageCount >= 5) {
//             return res.status(403).json({
//                 message: 'Free AI generation limit reached. Please upgrade to Pro.'
//             });
//         }

//         const { text, tone } = req.body;

//         if (!text || typeof text !== 'string' || text.trim() === '') {
//             return res.status(400).json({ message: 'Valid text is required.' });
//         }

//         if (!tone) {
//             return res.status(400).json({ message: 'Tone is required.' });
//         }

//         if (!process.env.GEMINI_API_KEY) {
//             return res.status(500).json({
//                 message: 'Gemini API key is not configured.'
//             });
//         }

//         // Tone instructions
//         const toneMap: Record<string, string> = {
//             grammar:
//                 'Fix all grammar and spelling errors in the following text. Do not change the meaning. Keep formatting same.',
//             professional:
//                 'Rewrite the text to sound professional, polished, and suitable for a resume. Use strong action verbs.',
//             concise:
//                 'Rewrite the text to be concise. Remove unnecessary words while keeping the meaning.'
//         };

//         const instruction = toneMap[tone];

//         if (!instruction) {
//             return res.status(400).json({ message: 'Invalid tone.' });
//         }

//         const prompt = `
// ${instruction}

// Text:
// ${text}

// IMPORTANT: Reply ONLY with improved text. No explanation, no quotes, no markdown.
// `;

//         // Gemini setup
//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({
//             model: 'gemini-2.5-flash',
//             generationConfig: { temperature: 1 }
//         });

//         // Generate with retry
//         const result = await generateWithRetry(model, prompt);

//         let improvedText = result.response.text()?.trim() || '';

//         // Clean quotes if returned
//         if (
//             improvedText.startsWith('"') &&
//             improvedText.endsWith('"')
//         ) {
//             improvedText = improvedText.slice(1, -1);
//         }

//         // Increment usage
//         user.aiUsageCount += 1;
//         await user.save();

//         return res.status(200).json({
//             improvedText,
//             aiUsageCount: user.aiUsageCount
//         });

//     } catch (error: any) {
//         console.error('AI Improve Error:', error.message);

//         // Handle quota error properly
//         if (error.message?.includes('429')) {
//             return res.status(429).json({
//                 message:
//                     'AI usage limit reached. Please try again later or upgrade your plan.'
//             });
//         }

//         return res.status(500).json({
//             message: 'Internal server error while improving text.',
//             error: error.message
//         });
//     }
// };

////////
import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import User from '../models/User';
import { AI_COSTS } from '../config/aiCosts';

// Retry helper
const generateWithRetry = async (model: any, prompt: string, retries = 3) => {
    try {
        return await model.generateContent(prompt);
    } catch (err: any) {
        if (err.message?.includes('429') && retries > 0) {
            await new Promise(res => setTimeout(res, 2000));
            return generateWithRetry(model, prompt, retries - 1);
        }
        throw err;
    }
};

export const improveText = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // ✅ CREDIT CHECK
        const cost = AI_COSTS.ENHANCE_EXPERIENCE || 1;

        if (user.credits < cost) {
            return res.status(403).json({
                message: 'Not enough credits. Please upgrade your plan.'
            });
        }

        const { text, tone } = req.body;

        if (!text || typeof text !== 'string' || text.trim() === '') {
            return res.status(400).json({ message: 'Valid text is required.' });
        }

        if (!tone) {
            return res.status(400).json({ message: 'Tone is required.' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                message: 'Gemini API key is not configured.'
            });
        }

        // Tone instructions
        const toneMap: Record<string, string> = {
            grammar:
                'Fix all grammar and spelling errors in the following text. Do not change the meaning. Keep formatting same.',
            professional:
                'Rewrite the text to sound professional, polished, and suitable for a resume. Use strong action verbs.',
            concise:
                'Rewrite the text to be concise. Remove unnecessary words while keeping the meaning.'
        };

        const instruction = toneMap[tone];

        if (!instruction) {
            return res.status(400).json({ message: 'Invalid tone.' });
        }

        const prompt = `
${instruction}

Text:
${text}

IMPORTANT: Reply ONLY with improved text. No explanation, no quotes, no markdown.
`;

        // Gemini setup
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: { temperature: 1 }
        });

        // Generate with retry
        const result = await generateWithRetry(model, prompt);

        let improvedText = result.response.text()?.trim() || '';

        // Clean quotes if returned
        if (
            improvedText.startsWith('"') &&
            improvedText.endsWith('"')
        ) {
            improvedText = improvedText.slice(1, -1);
        }

        // ✅ DEDUCT CREDITS AFTER SUCCESS
        user.credits -= cost;
        await user.save();

        return res.status(200).json({
            improvedText,
            remainingCredits: user.credits
        });

    } catch (error: any) {
        console.error('AI Improve Error:', error.message);

        if (error.message?.includes('429')) {
            return res.status(429).json({
                message: 'AI usage limit reached. Please try again later.'
            });
        }

        return res.status(500).json({
            message: 'Internal server error while improving text.',
            error: error.message
        });
    }
};