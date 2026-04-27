import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  clearApplicationErrors,
  resetApplicationSlice,
  fetchAllApplications,
} from "../store/slices/applicationSlice";
import { ClipLoader } from "react-spinners";

const Applications = () => {
  const { applications, loading, error, message } = useSelector(
    (state) => state.applications
  );
  const dispatch = useDispatch();

  const [selectedResume, setSelectedResume] = useState(null);

  // Fetch applications on mount
  useEffect(() => {
    dispatch(fetchAllApplications());
  }, [dispatch]);

  // Handle errors and success messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
    }
  }, [error, message, dispatch]);

  return (
    <>
      {loading ? (
        <section className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 animate-pulse">
          <div className="p-6 rounded-full bg-white shadow-xl shadow-blue-300">
            <ClipLoader size={50} color="#3B82F6" />
          </div>
        </section>
      ) : applications && applications.length === 0 ? (
        <div className="text-center text-gray-600 text-xl font-medium mt-20">
          No applications have been submitted yet.
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-3xl font-semibold text-center text-blue-700 mb-8">
            Applications for your posted jobs.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="p-6 flex-grow flex flex-col">
                  <h3
                    className="text-xl font-semibold text-blue-700 mb-3 truncate"
                    title={app.jobTitle}
                  >
                    {app.jobTitle}
                  </h3>

                  <div className="mb-4 text-gray-700 space-y-1 flex-grow">
                    <p>
                      <span className="font-medium">Applicant's Name:</span>{" "}
                      {app.jobSeekerName}
                    </p>
                    <p>
                      <span className="font-medium">Applicant's Email:</span>{" "}
                      <a
                        href={`mailto:${app.jobSeekerEmail}`}
                        className="text-blue-600 underline"
                      >
                        {app.jobSeekerEmail}
                      </a>
                    </p>
                    <p>
                      <span className="font-medium">Applicant's Phone:</span>{" "}
                      {app.jobSeekerPhone}
                    </p>
                    <p>
                      <span className="font-medium">Applicant's Address:</span>{" "}
                      {app.jobSeekerAddress}
                    </p>
                    {app.jobSeekerWebsite && (
                      <p>
                        <span className="font-medium">
                          Applicant's Website:
                        </span>{" "}
                        <a
                          href={app.jobSeekerWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {app.jobSeekerWebsite}
                        </a>
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Applicant's Cover Letter:
                    </label>
                    <textarea
                      readOnly
                      value={app.jobSeekerCoverLetter}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md resize-none text-gray-800 bg-gray-50"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-800 font-semibold mb-2">
                      Applicant's Resume:
                    </label>
                    {app.resumeUrl ? (
                      <button
                        onClick={() => setSelectedResume(app.resumeUrl)}
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        View Resume
                      </button>
                    ) : (
                      <p className="text-red-500">No resume uploaded</p>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mb-6">
                    Applied on:{" "}
                    {new Date(app.appliedAt).toLocaleDateString()} at{" "}
                    {new Date(app.appliedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resume Modal */}
          {selectedResume && (
            <div
              onClick={() => setSelectedResume(null)}
              className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 cursor-pointer"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-md shadow-lg max-w-4xl w-full h-[80vh] p-4 relative"
              >
                <button
                  onClick={() => setSelectedResume(null)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
                  aria-label="Close Resume Preview"
                >
                  &times;
                </button>
                <iframe
                  src={selectedResume}
                  title="Resume Preview"
                  aria-label="Resume Preview"
                  className="w-full h-full rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Applications;
