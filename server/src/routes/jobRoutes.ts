// routes/job.routes.ts

import express from "express";
import { searchJobs } from "../controllers/jobController";

const router = express.Router();

router.get("/search", searchJobs);

export default router;