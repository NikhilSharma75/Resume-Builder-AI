import express from 'express';
import { getAdminData , deleteUser } from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/data', protect, getAdminData);

router.delete("/user/:userId", protect, deleteUser);

export default router;
