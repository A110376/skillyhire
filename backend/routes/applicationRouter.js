import express from 'express';
import {
  deleteApplication,
  employerGetAllApplication,
  jobSeekerGetAllApplication,
  postApplication
} from '../controllers/applicationController.js';
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

// Apply authentication to all routes
router.use(isAuthenticated);

// Job Seeker applies to job
router.post("/:id", isAuthorized("Job Seeker"), postApplication);

// Employer views applications
router.get("/employer", isAuthorized("Employer"), employerGetAllApplication);

// Job Seeker views applications
router.get("/jobseeker", isAuthorized("Job Seeker"), jobSeekerGetAllApplication);

// Any authenticated user deletes their application (authorization handled in controller)
router.delete("/:id", deleteApplication);

export default router;
