import { Op } from "sequelize";
import Job from "../models/jobSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { triggerJobNotification } from "../utils/jobNotification.js";

export const postJob = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsiteTitle,
    personalWebsiteUrl,
    jobNiche,
  } = req.body;

  const requiredFields = [
    title, jobType, location, companyName,
    introduction, responsibilities, qualifications,
    salary, jobNiche,
  ];
  if (requiredFields.some((field) => !field)) {
    return next(new ErrorHandler("Please provide all required job fields.", 400));
  }

  const allowedTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  if (!allowedTypes.includes(jobType)) {
    return next(new ErrorHandler("Invalid job type provided.", 400));
  }

  if (!Array.isArray(responsibilities) || responsibilities.length === 0) {
    return next(new ErrorHandler("Responsibilities must be a non-empty array.", 400));
  }

  if (!Array.isArray(qualifications) || qualifications.length === 0) {
    return next(new ErrorHandler("Qualifications must be a non-empty array.", 400));
  }

  let offersArray = null;
  if (offers) {
    if (!Array.isArray(offers)) {
      return next(new ErrorHandler("Offers must be an array.", 400));
    }
    offersArray = offers;
  }

  if ((personalWebsiteTitle && !personalWebsiteUrl) || (!personalWebsiteTitle && personalWebsiteUrl)) {
    return next(new ErrorHandler("Both website title and URL are required if one is provided.", 400));
  }

  const postedBy = req.user?.id;
  if (!postedBy) {
    return next(new ErrorHandler("User authentication failed.", 401));
  }

  const hiringMultiple = ["true", "yes", true].includes(hiringMultipleCandidates);

  const job = await Job.create({
    title: title.trim(),
    jobType: jobType.trim(),
    location: location.trim(),
    companyName: companyName.trim(),
    introduction: introduction?.trim() || null,
    responsibilities,
    qualifications,
    offers: offersArray,
    salary: salary.trim(),
    hiringMultipleCandidates: hiringMultiple,
    personalWebsiteTitle: personalWebsiteTitle?.trim() || null,
    personalWebsiteUrl: personalWebsiteUrl?.trim() || null,
    jobNiche: jobNiche.trim(),
    postedBy,
  });
  
await triggerJobNotification(job);

  res.status(201).json({
    success: true,
    message: "Job posted successfully.",
    job,
  });
});

// =================== ✅ Get All Jobs ===================
export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const {
    city,
    niche,
    search = "",
    page = 1,
    limit = 10,
  } = req.query;

  const whereClause = {
    status: "Open", // Show only active jobs
  };

  if (city) whereClause.location = city.trim();
  if (niche) whereClause.jobNiche = niche.trim();

  if (search) {
    const likeQuery = { [Op.iLike]: `%${search.trim()}%` };
    whereClause[Op.or] = [
      { title: likeQuery },
      { companyName: likeQuery },
      { introduction: likeQuery },
    ];
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { rows: jobs, count } = await Job.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset,
    order: [["jobPostedOn", "DESC"]],
  });

  res.status(200).json({
    success: true,
    jobs,
    count,
    currentPage: parseInt(page),
    totalPages: Math.ceil(count / limit),
  });
});


// =================== ✅ Get My Jobs ===================
export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) return next(new ErrorHandler("User not authenticated.", 401));

  const myJobs = await Job.findAll({
    where: { postedBy: userId },
    order: [["jobPostedOn", "DESC"]],
  });

  res.status(200).json({
    success: true,
    myJobs,
    message: myJobs.length === 0 ? "You haven't posted any jobs yet." : undefined,
  });
});


// =================== ✅ Get Single Job ===================
export const getASingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const job = await Job.findByPk(id);
  if (!job) return next(new ErrorHandler("Job not found.", 404));

  res.status(200).json({
    success: true,
    job,
  });
});


// =================== ✅ Delete Job ===================
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const job = await Job.findByPk(id);
  if (!job) return next(new ErrorHandler("Oops! Job not found.", 404));

  await job.destroy();

  res.status(200).json({
    success: true,
    message: "Job deleted.",
  });
});
