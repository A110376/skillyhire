import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout, clearAllUserErrors } from "../store/slices/userSlice";
import { LuMoveRight } from "react-icons/lu";

import MyProfile from "../components/Myprofile";
import UpdateProfile from "../components/UpdateProfile";
import UpdatePassword from "../components/UpdatePassword";
import MyApplications from "../components/MyApplications";
import MyJobs from "../components/MyJobs";
import Applications from "../components/Applications";
import JobPost from "../components/JobPost";

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [componentName, setComponentName] = useState("My Profile");

  const { loading, isAuthenticated, user, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [error, isAuthenticated, dispatch, navigate]);

  const componentsMap = {
    "My Profile": <MyProfile />,
    "Update Profile": <UpdateProfile />,
    "Update Password": <UpdatePassword />,
    "Job Post": <JobPost />,
    "My Jobs": <MyJobs />,
    "Applications": <Applications />,
    "My Applications": <MyApplications />,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row max-w-7xl mx-auto">
      {/* Sidebar */}
      <div
        className={`
    fixed md:relative
top-16 md:top-0
z-50 md:z-auto
    ${showSidebar ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
    w-64
    transition-all duration-300
    bg-white shadow-md border-r border-gray-200
    h-full md:h-auto
  `}
      >
        <div className="p-4 md:p-6 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-indigo-600">
            Dashboard
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mt-1 break-words">
            Welcome, <span className="font-semibold">{user?.name}</span>
          </p>
        </div>
        <ul className="p-3 md:p-4 space-y-2 text-sm">
          <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Manage Account</h4>

          {[
            "My Profile",
            "Update Profile",
            "Update Password",
            ...(user?.role === "Employer"
              ? ["Job Post", "My Jobs", "Applications"]
              : user?.role === "Job Seeker"
                ? ["My Applications"]
                : []),
          ].map((item) => (
            <li key={item}>
              <button
                onClick={() => setComponentName(item)}
                className={`w-full text-left px-2 py-2 rounded-md text-xs md:text-sm ${componentName === item
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "text-gray-700 hover:bg-indigo-50"
                  }`}
              >
                {item}
              </button>
            </li>
          ))}

          <li className="mt-4">
            <button
              onClick={handleLogout}
              className="w-full text-left px-2 py-2 text-red-600 hover:underline font-medium"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 w-full">
        {/* Sidebar Toggle */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-indigo-600 text-2xl fixed top-20 left-4 z-40 md:hidden"
        >
          <LuMoveRight />
        </button>
        {/* Overlay */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black opacity-30 md:hidden z-40"
            onClick={() => setShowSidebar(false)}
          />
        )}

        <div className="bg-white mt-20 md:mt-0 p-4 md:p-6 rounded-xl shadow-sm border">
          {componentsMap[componentName] || <MyProfile />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
