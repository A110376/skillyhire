import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncErrors } from "./catchAsyncError.js";

// 🔧 Helper: Extract token from cookies or headers
const extractToken = (req) => {
  if (req.cookies?.jwt) return req.cookies.jwt;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
};

// ✅ Middleware: Check if user is authenticated
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = extractToken(req);

  if (process.env.NODE_ENV !== "production") {
    console.log("📌 Extracted Token:", token);
  }

  if (!token) {
    return next(new ErrorHandler("User is not authenticated!", 401));
  }

  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, {
      algorithms: ["HS256"], // Optional strict verification
    });

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    req.user = user;
    req.token = token; // Optional: expose token for further use if needed
    next();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ JWT Error:", error.message);
    }

    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Session expired. Please log in again.", 401));
    }

    return next(new ErrorHandler("Invalid or expired token!", 401));
  }
});

// ✅ Middleware: Check if user is authorized for specific role(s)
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} is not allowed to access this resource.`, 403)
      );
    }
    next();
  };
};
