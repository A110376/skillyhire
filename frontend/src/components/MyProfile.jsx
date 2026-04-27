import React from "react";
import { useSelector } from "react-redux";

const MyProfile = () => {
  const { user } = useSelector((state) => state.user);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400 text-xl font-semibold">
        Loading profile...
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const niches = user?.niches || {};

  return (
   <div className="max-w-5xl mx-auto my-8 md:my-16 p-4 md:p-12">
      <h3 className="text-2xl md:text-5xl">
        My Profile
      </h3>

      {/* Avatar */}
      <div className="flex justify-center mb-10">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-blue-400 to-purple-600 flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg select-none">
          {initials}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <ProfileField label="Full Name" value={user.name} />

        {/* Email */}
        <ProfileField label="Email Address" value={user.email} />

        {/* Phone */}
        <ProfileField label="Phone Number" value={user.phone} />

        {/* Address */}
        <ProfileField label="Address" value={user.address} />

        {/* Role */}
        <ProfileField label="Role" value={user.role} />

        {/* Joined On */}
        <ProfileField
          label="Joined On"
          value={
            user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"
          }
        />

        {/* Preferred Job Niches */}
        {user.role === "Job Seeker" && (
          <div className="md:col-span-2">
            <label className="block mb-3 text-lg font-semibold text-gray-700">
              My Preferred Job Niches
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              {[niches.firstNiche, niches.secondNiche, niches.thirdNiche].map((niche, i) => (
                <input
                  key={i}
                  type="text"
                  disabled
                  value={niche || ""}
                  className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-5 py-3 text-gray-800 shadow-sm transition-transform hover:scale-105 cursor-not-allowed"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 🔹 Reusable ProfileField Component
const ProfileField = ({ label, value }) => (
  <div>
    <label className="block mb-2 text-lg font-semibold text-gray-700">
      {label}
    </label>
    <input
      type="text"
      disabled
      value={value || "N/A"}
      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-3 text-gray-800 shadow-sm transition-transform hover:scale-105 cursor-not-allowed"
    />
  </div>
);

export default MyProfile;
