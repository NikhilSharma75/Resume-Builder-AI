import express from 'express';
import { improveText } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';
import { checkCredits } from "../middleware/checkCredits";
const router = express.Router();

router.post('/improve-text', protect, checkCredits,  improveText);

export default router;
