import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserPassword,
  resetUpdatePasswordState,
} from "../store/slices/updatePasswordSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UpdatePassword = () => {
  const dispatch = useDispatch();

  const { loading, error, isPasswordUpdated } = useSelector(
    (state) => state.updatePassword
  );

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserPassword({ oldPassword, newPassword, confirmPassword }));
  };

  useEffect(() => {
    if (isPasswordUpdated) {
      toast.success("✅ Password updated successfully!");
      dispatch(resetUpdatePasswordState());
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [isPasswordUpdated, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
   <div className="flex justify-center items-center min-h-screen px-3 md:px-4">
      <div className="w-full max-w-md p-5 md:p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🔐 Update Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Input Group */}
          {[
            {
              label: "Old Password",
              value: oldPassword,
              setValue: setOldPassword,
              show: showOldPassword,
              toggle: () => setShowOldPassword(!showOldPassword),
            },
            {
              label: "New Password",
              value: newPassword,
              setValue: setNewPassword,
              show: showNewPassword,
              toggle: () => setShowNewPassword(!showNewPassword),
            },
            {
              label: "Confirm New Password",
              value: confirmPassword,
              setValue: setConfirmPassword,
              show: showConfirmPassword,
              toggle: () => setShowConfirmPassword(!showConfirmPassword),
            },
          ].map(({ label, value, setValue, show, toggle }, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white/90 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 placeholder-gray-400"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
                <button
                  type="button"
                  onClick={toggle}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                >
                  {show ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 text-white rounded-lg font-semibold transition-all duration-200 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
