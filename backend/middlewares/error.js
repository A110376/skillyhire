import { ValidationError } from "sequelize";

// ✅ Custom Error Handler class
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ✅ Central Error Handling Middleware
export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // ✅ Sequelize validation error
  if (err instanceof ValidationError) {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
      errors: err.errors,
    });
  }

  // ✅ JWT-related errors
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("JWT is invalid. Try again.", 400);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JWT has expired. Please log in again.", 400);
  }

  // ✅ Final response
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
