import express from 'express';
import { createCheckoutSession, handleWebhook, syncSubscription } from '../controllers/subscriptionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public route for Stripe webhooks (must use express.raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Add JSON parsing for the remaining routes in this router
router.use(express.json());

// Protected routes
router.post('/checkout', protect, createCheckoutSession);
router.post('/sync', protect, syncSubscription);

export default router;
