

/////
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import resumeRoutes from './routes/resumeRoutes';
import templateRoutes from './routes/templateRoutes';
import jobRoutes from './routes/jobRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import feedbackRoutes from "./routes/feedbackRoutes";
import adminRoutes from './routes/adminRoutes';
import aiRoutes from './routes/aiRoutes';
import interviewRoutes from './routes/interviewRoutes';
import { startCreditResetJob } from './cron/creditsReset';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// CORS setup
app.use(cors({
  origin: ['https://resume-builder-ai-zeta-beryl.vercel.app','http://localhost:3000' ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Route registrations
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/templates', templateRoutes);
app.use("/api", feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", interviewRoutes);

// Background jobs & database
startCreditResetJob();
connectDB();

// START SERVER - This is normal MERN!
app.listen(PORT, () => {
  console.log(`Server successfully running on port ${PORT}`);
});