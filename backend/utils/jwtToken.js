export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();

  // Fallback defaults
  const NODE_ENV = process.env.NODE_ENV || "development";
  const COOKIE_EXPIRE = process.env.COOKIE_EXPIRE || 7; // default: 5 days

  const options = {
    expires: new Date(Date.now() + COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "None" : "Lax",
  };

 res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
    message,
  });
};
