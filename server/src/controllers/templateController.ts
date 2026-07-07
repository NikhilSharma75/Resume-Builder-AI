import { Request, Response } from 'express';

// Mock Template Data
const templates = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and minimalist design for tech professionals.',
        thumbnail: '/templates/modern.png',
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'Traditional layout suitable for corporate roles.',
        thumbnail: '/templates/professional.png',
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Bold colors and unique layout for designers.',
        thumbnail: '/templates/creative.png',
    },
    {
        id: 'simple',
        name: 'Simple',
        description: 'Basic text-focused layout, great for ATS.',
        thumbnail: '/templates/simple.png',
    }
];

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public
export const getTemplates = (req: Request, res: Response) => {
    res.json(templates);
};

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Public
export const getTemplateById = (req: Request, res: Response) => {
    const template = templates.find((t) => t.id === req.params.id);

    if (template) {
        res.json(template);
    } else {
        res.status(404).json({ message: 'Template not found' });
    }
};
