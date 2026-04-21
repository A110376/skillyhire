import { catchAsyncErrors } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import Application from '../models/applicationSchema.js';
import Job from '../models/jobSchema.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

// POST: Submit Application
export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const jobId = parseInt(req.params.id, 10);
  const userId = parseInt(req.user.id, 10);

  const {
    jobSeekerName,
    jobSeekerEmail,
    jobSeekerPhone,
    jobSeekerAddress,
    jobSeekerCoverLetter,
  } = req.body;

  if (!jobSeekerName || !jobSeekerEmail || !jobSeekerPhone || !jobSeekerAddress || !jobSeekerCoverLetter) {
    return next(new ErrorHandler('All fields are required.', 400));
  }

  const jobDetails = await Job.findByPk(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler('Job not found.', 404));
  }

  const isAlreadyApplied = await Application.findOne({
    where: { jobId, jobSeekerId: userId, deletedByJobSeeker: false },
  });

  if (isAlreadyApplied) {
    return next(new ErrorHandler('You have already applied for this job.', 400));
  }

  let resumePublicId = '';
  let resumeUrl = '';

  // ✅ FIXED: Resume Upload
  if (req.files?.resume) {
    try {
      const uploadResult = await uploadToCloudinary(
        req.files.resume.data,
        'Job_Seeker_Resume'
      );

      resumePublicId = uploadResult.public_id;
      resumeUrl = uploadResult.secure_url;
    } catch (error) {
      return next(new ErrorHandler('Resume upload failed.', 500));
    }
  } else {
    // Agar user ne already profile me resume upload kiya hai
    if (!req.user?.resume?.url) {
      return next(new ErrorHandler('Please upload your resume.', 400));
    }

    resumePublicId = req.user.resume.public_id;
    resumeUrl = req.user.resume.url;
  }

  const application = await Application.create({
    jobSeekerId: userId,
    jobSeekerName: jobSeekerName.trim(),
    jobSeekerEmail: jobSeekerEmail.trim().toLowerCase(),
    jobSeekerPhone: jobSeekerPhone.trim(),
    jobSeekerAddress: jobSeekerAddress.trim(),
    jobSeekerCoverLetter: jobSeekerCoverLetter.trim(),
    jobSeekerRole: 'Job Seeker',
    resumePublicId,
    resumeUrl,
    employerId: jobDetails.postedBy,
    employerRole: 'Employer',
    jobId: jobDetails.id,
    jobTitle: jobDetails.title,
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully.',
    application,
  });
});

// GET: Employer - All Applications
export const employerGetAllApplication = catchAsyncErrors(async (req, res, next) => {
  const employerId = req.user.id;

  const applications = await Application.findAll({
    where: { employerId, deletedByEmployer: false },
    order: [['appliedAt', 'DESC']],
  });

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

// GET: Job Seeker - All Applications
export const jobSeekerGetAllApplication = catchAsyncErrors(async (req, res, next) => {
  const jobSeekerId = req.user.id;

  const applications = await Application.findAll({
    where: { jobSeekerId, deletedByJobSeeker: false },
    include: [
      {
        model: Job,
        as: 'job',
      },
    ],
    order: [['appliedAt', 'DESC']],
  });

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

// DELETE: Application
export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  const application = await Application.findByPk(id);
  if (!application) {
    return next(new ErrorHandler('Application not found.', 404));
  }

  const isJobSeeker = userRole === 'Job Seeker' && application.jobSeekerId === userId;
  const isEmployer = userRole === 'Employer' && application.employerId === userId;

  if (!isJobSeeker && !isEmployer) {
    return next(new ErrorHandler('Not authorized.', 403));
  }

  if (isJobSeeker) application.deletedByJobSeeker = true;
  if (isEmployer) application.deletedByEmployer = true;

  if (application.deletedByJobSeeker && application.deletedByEmployer) {
    await application.destroy();
  } else {
    await application.save();
  }

  res.status(200).json({
    success: true,
    message: 'Application deleted successfully.',
  });
});