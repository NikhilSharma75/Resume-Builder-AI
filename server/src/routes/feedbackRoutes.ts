import express from "express";
import {
    createFeedback,
    getAllFeedback,
    deleteFeedback,
    getMyFeedback,
    updateFeedback,
} from "../controllers/feedbackController";
import { protect } from "../middleware/authMiddleware";
const router = express.Router();

// Submit feedback
router.post("/feedback", createFeedback);

// Get all feedback
router.get("/getallfeedback", getAllFeedback);


router.delete("/feedback/:id", protect, deleteFeedback);

router.get("/feedback/me", protect, getMyFeedback);


router.put("/feedback/:id", protect, updateFeedback);
export default router;