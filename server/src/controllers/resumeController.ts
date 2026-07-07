import { Request, Response } from 'express';
import Resume from '../models/Resume';
import puppeteer from 'puppeteer';
import fs from "fs";

import { modernTemplate, professionalTemplate, creativeTemplate, simpleTemplate } from '../templates';

// Template Registry
const TEMPLATES: any = {
    modern: modernTemplate,
    professional: professionalTemplate,
    creative: creativeTemplate,
    simple: simpleTemplate
};

// @desc    Get available templates
// @route   GET /api/templates
// @access  Public
export const getTemplates = async (req: Request, res: Response) => {
    const templates = [
        {
            id: 'modern',
            name: 'Techy',
            description: 'Modern tech-focused layout with a clean aesthetic.',
            thumbnail: '/templates/modern.png'
        },
        {
            id: 'professional',
            name: 'Professional',
            description: 'Elegant layout with a dark sidebar and serif typography.',
            thumbnail: '/templates/professional.png'
        },
        {
            id: 'creative',
            name: 'Creative',
            description: 'Bold, high-impact design for creators and designers.',
            thumbnail: '/templates/creative.png'
        },
        {
            id: 'simple',
            name: 'Simple',
            description: 'Minimalist ATS-friendly layout using Times New Roman.',
            thumbnail: '/templates/simple.png'
        }
    ];
    res.json(templates);
};

// @desc    Get all resumes for logged in user
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.json(resumes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req: Request, res: Response) => {
    const { title, selectedTemplate } = req.body;

    try {
        // @ts-ignore
        const user = req.user;
        const resumeCount = await Resume.countDocuments({ user: user._id });

        if (!user.isSubscribed && resumeCount >= 2) {
            return res.status(403).json({
                message: 'Free limit reached. You can only create 2 resumes for free. Please upgrade to Pro for unlimited access.',
                limitReached: true
            });
        }

        const resume = await Resume.create({
            // @ts-ignore
            user: req.user._id,
            title: title || 'Untitled Resume',
            selectedTemplate: selectedTemplate || 'modern',
            isDraft: true,
            data: {
                personalInfo: {
                    fullName: '',
                    jobTitle: '',
                    email: '',
                    phone: '',
                    location: '',
                    summary: '',
                    github: '',
                    linkedin: '',
                },
                experience: [],
                education: [],
                projects: [],
                skills: [],
                customSections: [],
                sectionsOrder: ['summary', 'experience', 'education', 'projects', 'skills'],
            },
        });

        res.status(201).json(resume);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
export const getResumeById = async (req: Request, res: Response) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (resume) {
            // @ts-ignore
            if (resume.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            res.json(resume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req: Request, res: Response) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (resume) {
            // @ts-ignore
            if (resume.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            // Check if user should be allowed to edit content
            // @ts-ignore
            const user = req.user;
            const resumeCount = await Resume.countDocuments({ user: user._id });

            // If user is not subscribed and has more than 2 resumes, block editing for ALL except the first 2?
            // Actually, the user's request said: "cannot access the reusme templates to create new resume and cannot even edit there previous resumes only allow downloaded previous made resumes"
            // This implies that if they have 2 resumes, they can't create more. 
            // If they are over the limit (maybe they had more before?), they can't edit ANY? 
            // Or maybe if they have 2, they can still edit those 2?
            // The phrasing "cannot even edit there previous resumes" sounds like once they reach the limit, EVERYTHING is locked? 
            // Let's re-read: "allow each user to create 2 resumes using our template for free and then a user cannot access the reusme templates to create new resume and cannot even edit there previous resumes"
            // This probably means once you have 2, you are stuck with them. If you want to create or EDIT anything, you need to subscribe.

            if (!user.isSubscribed && resumeCount >= 2) {
                // We should probably allow them to edit the first 2 resumes they created?
                // But the user said "cannot even edit there previous resumes".
                // Let's assume they can't edit UNLESS they are under the limit or subscribed.
                // But wait, if I have 2 resumes, I should be able to edit them, right?
                // "cannot access the reusme templates to create new resume and cannot even edit there previous resumes only allow downloaded previous made resumes"
                // This sounds like once they reach the limit, editing is also blocked.

                // Let's implement it such that if they have >= 2 resumes and are NOT subscribed, editing is blocked.
                // But this makes the 2 free resumes useless after the first save!
                // Maybe the user means "once you have 2 resumes, you can't create a 3rd, and if you are NOT subscribed, you can't edit them anymore"? 
                // That seems very restrictive. Usually, you can edit your free ones.
                // Re-reading: "2 resumes ... for free and then ... cannot ... edit there previous resumes".
                // Okay, I'll follow the user's specific instruction. No editing for free users if they have >= 2 resumes.

                return res.status(403).json({
                    message: 'Editing is locked for free users with 2 or more resumes. Please upgrade to Pro to edit or create more.',
                    limitReached: true
                });
            }

            resume.title = req.body.title || resume.title;
            resume.data = req.body.data || resume.data;
            resume.selectedTemplate = req.body.selectedTemplate || resume.selectedTemplate;
            resume.isDraft = req.body.isDraft !== undefined ? req.body.isDraft : resume.isDraft;

            const updatedResume = await resume.save();
            res.json(updatedResume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req: Request, res: Response) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (resume) {
            // @ts-ignore
            if (resume.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            await resume.deleteOne();
            res.json({ message: 'Resume removed' });
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
export const duplicateResume = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user = req.user;
        const resumeCount = await Resume.countDocuments({ user: user._id });

        if (!user.isSubscribed && resumeCount >= 2) {
            return res.status(403).json({
                message: 'Free limit reached. You can only have 2 resumes for free. Please upgrade to Pro to duplicate.',
                limitReached: true
            });
        }

        const originalResume = await Resume.findById(req.params.id);

        if (!originalResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // @ts-ignore
        if (originalResume.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const newResume = await Resume.create({
            // @ts-ignore
            user: req.user._id,
            title: `${originalResume.title} (Copy)`,
            data: originalResume.data,
            selectedTemplate: originalResume.selectedTemplate,
            isDraft: true,
        });

        res.status(201).json(newResume);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get public resume by slug
// @route   GET /api/resumes/public/:slug
// @access  Public
export const getResumeBySlug = async (req: Request, res: Response) => {
    try {
        const resume = await Resume.findOne({ slug: req.params.slug });

        if (resume) {
            res.json(resume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};






// @desc    Generate PDF using Puppeteer
// @route   GET /api/resumes/:id/pdf
// @access  Private
// export const generatePDF = async (req: Request, res: Response) => {
//     await waitForChrome();
//     try {
//         const resume = await Resume.findById(req.params.id);
//         if (!resume) return res.status(404).json({ message: 'Resume not found' });

//         // @ts-ignore
//         if (resume.user.toString() !== req.user._id.toString()) {
//             return res.status(401).json({ message: 'Not authorized' });
//         }

//         const templateId = resume.selectedTemplate || 'modern';
//         const templateFn = TEMPLATES[templateId] || TEMPLATES['modern'];
//         const htmlContent = templateFn(resume.data);





//         const chromePath = 
//   process.env.PUPPETEER_EXECUTABLE_PATH ||
//   '/opt/render/.cache/puppeteer/chrome/linux-146.0.7680.66/chrome-linux64/chrome';

// if (!fs.existsSync(chromePath)) {
//   throw new Error(`Chrome not found at: ${chromePath}`);
// }

// const browser = await puppeteer.launch({
//   headless: true,
//   executablePath: chromePath,
//   args: [
   
//     '--no-sandbox',
//     '--disable-setuid-sandbox',
//     '--disable-dev-shm-usage',
//     '--disable-gpu',
//     '--no-zygote',
//     '--single-process',        // most important for low-memory environments
//     '--disable-extensions',
//     '--disable-software-rasterizer',
//     '--disable-background-networking',
//     '--disable-default-apps',
//     '--mute-audio',
//     '--no-first-run',
  
//   ],
// });
//         const page = await browser.newPage();

//         // Set viewport to match A4 proportions at 96 DPI
//         await page.setViewport({
//             width: 794,
//             height: 1123,
//             deviceScaleFactor: 1, // 1:1 pixel parity
//         });

//         await page.setContent(htmlContent, {
//             waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
//             timeout: 60000 
//         });

//         // Ensure fonts are loaded and layout is settled
//         await page.evaluateHandle('document.fonts.ready');
//         await new Promise(resolve => setTimeout(resolve, 500)); // Small settle delay

//         const pdfBuffer = await page.pdf({
//             format: 'A4',
//             printBackground: true,
//             margin: {
//                 top: '0px',
//                 bottom: '0px',
//                 left: '0px',
//                 right: '0px'
//             },
//             scale: 1,
//             preferCSSPageSize: true,
//             displayHeaderFooter: false
//         });

//         await browser.close();

//         // Stream PDF to client
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', `attachment; filename="${resume.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`);
//         res.status(200).send(pdfBuffer);

//     } catch (error: any) {
//         console.error('PDF Generation Error:', error);
//         res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
//     }
// };
// export const generatePDF = async (req: Request, res: Response) => {
//     try {
//         const resume = await Resume.findById(req.params.id);
//         if (!resume) return res.status(404).json({ message: 'Resume not found' });

//         // @ts-ignore
//         if (resume.user.toString() !== req.user._id.toString()) {
//             return res.status(401).json({ message: 'Not authorized' });
//         }

//         const templateId = resume.selectedTemplate || 'modern';
//         const templateFn = TEMPLATES[templateId] || TEMPLATES['modern'];
//         const htmlContent = templateFn(resume.data);

//         const browser = await puppeteer.connect({
//             browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
//         });

//         const page = await browser.newPage();

//         await page.setViewport({
//             width: 794,
//             height: 1123,
//             deviceScaleFactor: 1,
//         });

//         await page.setContent(htmlContent, {
//             waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
//             timeout: 60000
//         });

//         await page.evaluateHandle('document.fonts.ready');
//         await new Promise(resolve => setTimeout(resolve, 500));

//         const pdfBuffer = await page.pdf({
//             format: 'A4',
//             printBackground: true,
//             margin: {
//                 top: '0px',
//                 bottom: '0px',
//                 left: '0px',
//                 right: '0px'
//             },
//             scale: 1,
//             preferCSSPageSize: true,
//             displayHeaderFooter: false
//         });

//         await browser.close();

//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', `attachment; filename="${resume.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`);
//         res.status(200).send(pdfBuffer);

//     } catch (error: any) {
//         console.error('PDF Generation Error:', error);
//         res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
//     }
// };

export const generatePDF = async (req: Request, res: Response) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) return res.status(404).json({ message: 'Resume not found' });

        // @ts-ignore
        if (resume.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const templateId = resume.selectedTemplate || 'modern';
        const templateFn = TEMPLATES[templateId] || TEMPLATES['modern'];
        const htmlContent = templateFn(resume.data);

        const browser = await puppeteer.connect({
            browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
        });

        try {
            const page = await browser.newPage();

            await page.setViewport({
                width: 794,
                height: 1123,
                deviceScaleFactor: 1,
            });

            // ✅ Fix 2: navigate to blank page first
            await page.goto('about:blank', { waitUntil: 'domcontentloaded' });

            // ✅ Fix 1: single waitUntil string
            await page.setContent(htmlContent, {
                waitUntil: 'networkidle0',
                timeout: 60000,
            });

            await page.evaluateHandle('document.fonts.ready');
            await new Promise(resolve => setTimeout(resolve, 500));

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
                scale: 1,
                preferCSSPageSize: true,
                displayHeaderFooter: false,
            });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${resume.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`
            );
            res.status(200).send(pdfBuffer);

        } finally {
            // ✅ Fix 3: always close the browser
            await browser.close();
        }

    } catch (error: any) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
    }
};