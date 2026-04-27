import React from "react"; // ✅ This line is required
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);

  return isAuthenticated ? <Navigate to="/" /> : children;
};

export default PublicRoute;
