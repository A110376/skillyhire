import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// =========================
// ✅ REGISTER CONTROLLER
// =========================
export const register = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    address,
    password,
    role,
    firstNiche,
    secondNiche,
    thirdNiche,
    coverLetter,
  } = req.body;

  if (!name || !email || !phone || !address || !password || !role) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
    return next(new ErrorHandler("Please provide your Niches!", 400));
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({ where: { email: normalizedEmail } });
  if (existingUser) {
    return next(new ErrorHandler("Your email is already registered.", 400));
  }

  const userData = {
    name,
    email: normalizedEmail,
    phone,
    address,
    password,
    role,
    coverLetter,
    niches:
      role === "Job Seeker"
        ? { firstNiche, secondNiche, thirdNiche }
        : undefined,
  };

  // ✅ Upload Resume (FIXED)
  if (req.files?.resume) {
    try {
      const result = await uploadToCloudinary(
        req.files.resume.data,
        "Job_Seeker_Resume"
      );

      userData.resume = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      return next(new ErrorHandler("Failed to upload resume.", 500));
    }
  }

  const newUser = await User.create(userData);
  sendToken(newUser, 201, res, "User registered successfully.");
});

// ======================
// ✅ LOGIN CONTROLLER
// ======================
export const login = catchAsyncErrors(async (req, res, next) => {
  const { role, email, password } = req.body;

  if (!role || !email || !password) {
    return next(
      new ErrorHandler("Role, email and password are required.", 400)
    );
  }

  const normalizedEmail = email.toLowerCase();

  const user = await User.scope(null).findOne({
    where: { email: normalizedEmail },
    attributes: ["id", "name", "email", "password", "role", "resume"],
  });

  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  if (user.role !== role) {
    return next(new ErrorHandler("Invalid user role.", 400));
  }

  sendToken(user, 200, res, "User logged in successfully.");
});

// ======================
// ✅ LOGOUT CONTROLLER
// ======================
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("jwt", "", {
      expires: new Date(0),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User logged out.",
    });
});

// ======================
// ✅ GET CURRENT USER
// ======================
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// ======================
// ✅ UPDATE PROFILE
// ======================
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const {
    name,
    email,
    phone,
    address,
    coverLetter,
    firstNiche,
    secondNiche,
    thirdNiche,
  } = req.body;

  const normalizedEmail = email ? email.toLowerCase() : user.email.toLowerCase();

  if (email && normalizedEmail !== user.email.toLowerCase()) {
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser && existingUser.id !== user.id) {
      return next(new ErrorHandler("Email already in use.", 400));
    }
  }

  const updateData = {
    name: name || user.name,
    email: normalizedEmail,
    phone: phone || user.phone,
    address: address || user.address,
  };

  if (req.user.role === "Job Seeker") {
    if (!firstNiche || !secondNiche || !thirdNiche) {
      return next(new ErrorHandler("Please provide your niches!", 400));
    }

    updateData.coverLetter = coverLetter || user.coverLetter || "";
    updateData.niches = { firstNiche, secondNiche, thirdNiche };
  }

  // ✅ Resume Update FIXED
  if (req.files?.resume) {
    try {
      if (user.resume?.public_id) {
        await cloudinary.uploader.destroy(user.resume.public_id, {
          resource_type: "raw",
        });
      }

      const result = await uploadToCloudinary(
        req.files.resume.data,
        "Job_Seeker_Resume"
      );

      updateData.resume = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (err) {
      return next(new ErrorHandler("Failed to update resume.", 500));
    }
  }

  await user.update(updateData);

  const updatedUser = await User.findByPk(user.id);

  res.status(200).json({
    success: true,
    user: updatedUser,
    message: "Profile updated successfully.",
    resumePreviewUrl: updatedUser.resume?.url || null,
  });
});

// ======================
// ✅ UPDATE PASSWORD
// ======================
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.scope(null).findByPk(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const { oldPassword, newPassword, confirmPassword } = req.body;

  const isPasswordMatched = await user.comparePassword(oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password incorrect.", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match.", 400));
  }

  user.password = newPassword;
  await user.save();

  sendToken(user, 200, res, "Password updated successfully.");
});