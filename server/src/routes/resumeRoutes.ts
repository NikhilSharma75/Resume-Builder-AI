import express from 'express';
import multer from 'multer';
import {
    getResumes,
    createResume,
    getResumeById,
    updateResume,
    deleteResume,
    duplicateResume,
    generatePDF,
    getResumeBySlug,
    getTemplates
} from '../controllers/resumeController';
import { uploadResume } from '../controllers/resumeUploadController';
import { getAtsScore, enhanceExperience} from '../controllers/atsController';
import { generateCoverLetter } from '../controllers/coverLetterController';
import { protect } from '../middleware/authMiddleware';
import { checkCredits } from '../middleware/checkCredits';
import { AI_COSTS } from '../config/aiCosts';

const router = express.Router();
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.get('/templates', getTemplates);
router.route('/').get(protect, getResumes).post(protect, createResume);
router.post('/ats-score', protect, checkCredits(AI_COSTS.ATS_SCORE), getAtsScore);
router.post('/enhance-experience', protect, checkCredits(AI_COSTS.ENHANCE_EXPERIENCE), enhanceExperience);
router.post('/generate-cover-letter', protect, checkCredits(AI_COSTS.COVER_LETTER), generateCoverLetter);
router.get('/public/:slug', getResumeBySlug);
router.post('/upload', protect, upload.single('resume'), uploadResume);
router
    .route('/:id')
    .get(protect, getResumeById)
    .put(protect, updateResume)
    .delete(protect, deleteResume);

router.post('/:id/duplicate', protect, duplicateResume);
router.get('/:id/pdf', protect, generatePDF);

export default router;
