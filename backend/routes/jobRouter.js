import express from "express";
import {
  postJob,
  getAllJobs,
  getMyJobs,
  deleteJob,
  getASingleJob,
} from "../controllers/jobController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Post a new job (only Employers)
router.post("/post", isAuthenticated, isAuthorized("Employer"), postJob);

// ✅ Get all jobs (public)
router.get("/getall", getAllJobs);

// ✅ Get my jobs (only Employers)
router.get("/getmyjobs", isAuthenticated, isAuthorized("Employer"), getMyJobs);

// ✅ Delete a job (only Employers)
router.delete("/delete/:id", isAuthenticated, isAuthorized("Employer"), deleteJob);

// ✅ Get a single job (public)
router.get("/get/:id", getASingleJob);

export default router;
