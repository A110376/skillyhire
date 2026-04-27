import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  clearApplicationErrors,
  resetApplication,
  deleteApplication,
  fetchMyApplications,
} from '../store/slices/applicationSlice';
import { ClipLoader } from 'react-spinners';

const MyApplications = () => {
  const dispatch = useDispatch();
  const { loading, error, applications, message } = useSelector(
    (state) => state.applications
  );

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearApplicationErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(resetApplication());
      dispatch(fetchMyApplications());
    }
  }, [dispatch, error, message]);

  const handleDeleteApplication = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      dispatch(deleteApplication(id));
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center sm:text-left">
          My Job Applications
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="p-8 rounded-full bg-white shadow-xl shadow-blue-300">
              <ClipLoader size={60} color="#3B82F6" />
            </div>
          </div>
        ) : applications && applications.length === 0 ? (
          <div className="text-center text-gray-600 text-xl font-medium mt-20">
            You have not applied for any job yet.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col"
              >
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold text-blue-700 mb-3 truncate" title={app.jobTitle}>
                    {app.jobTitle}
                  </h3>

                  <div className="mb-3 text-gray-700 space-y-1 flex-grow">
                    <p><span className="font-medium">Name:</span> {app.jobSeekerName}</p>
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      <a href={`mailto:${app.jobSeekerEmail}`} className="text-blue-600 underline">
                        {app.jobSeekerEmail}
                      </a>
                    </p>
                    <p><span className="font-medium">Phone:</span> {app.jobSeekerPhone}</p>
                    <p><span className="font-medium">Address:</span> {app.jobSeekerAddress}</p>
                  </div>

                  <div className="mb-3">
                    <label className="block text-gray-700 font-medium mb-1">Cover Letter:</label>
                    <textarea
                      readOnly
                      value={app.jobSeekerCoverLetter}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md resize-none text-gray-800 bg-gray-50"
                    />
                  </div>

                  {/* ✅ Updated Resume Section */}
                  <div className="mb-4">
                    <label className="block text-gray-800 font-semibold mb-1">Resume:</label>
                    {app.resumeUrl ? (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        View Resume
                      </a>
                    ) : (
                      <p className="text-red-500">No resume uploaded</p>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    Applied on: {new Date(app.appliedAt).toLocaleDateString()} at{' '}
                    {new Date(app.appliedAt).toLocaleTimeString()}
                  </p>

                  <button
                    onClick={() => handleDeleteApplication(app.id)}
                    className="self-start bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition"
                    aria-label={`Delete application for ${app.jobTitle}`}
                  >
                    Delete Application
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyApplications;
