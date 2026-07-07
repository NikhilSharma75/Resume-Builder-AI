// import express from 'express';
// import { generateInterviewPrep } from '../controllers/interviewController';
// import {  protect } from '../middleware/authMiddleware';
// import { checkCredits } from '../middleware/checkCredits';


// const router = express.Router();

// router.post('/interview-prep', protect ,checkCredits, generateInterviewPrep);

// export default router;


import express from 'express';
import { generateInterviewPrep } from '../controllers/interviewController';
import { protect } from '../middleware/authMiddleware';
import { checkCredits } from '../middleware/checkCredits';
import { AI_COSTS } from '../config/aiCosts';

const router = express.Router();

// ✅ Pass AI_COSTS.INTERVIEW_PREP to checkCredits
router.post('/interview-prep', protect, checkCredits(AI_COSTS.INTERVIEW_PREP), generateInterviewPrep);

export default router;