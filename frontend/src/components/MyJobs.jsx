import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  clearAllJobErrors,
  deleteJob,
  getMyJobs,
  resetJobSlice,
} from "../store/slices/jobSlice";
import { ClipLoader } from "react-spinners";
import { HiTrash, HiBriefcase, HiLocationMarker, HiCurrencyDollar, HiClock } from "react-icons/hi";
import { FaBuilding } from "react-icons/fa";

const MyJobs = () => {
  const { loading, error, myJobs, message } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetJobSlice());
    }
    dispatch(getMyJobs());
  }, [dispatch, error, message]);

  const handleDeleteJob = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setDeletingId(id);
      dispatch(deleteJob(id)).finally(() => setDeletingId(null));
    }
  };

  return (
    <>
      {loading ? (
        <section className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 animate-pulse">
          <div className="p-6 rounded-full bg-white shadow-xl shadow-blue-300">
            <ClipLoader size={50} color="#3B82F6" />
          </div>
        </section>
      ) : myJobs && myJobs.length === 0 ? (
        <h1 className="text-center text-gray-600 text-xl mt-20">
          You have not posted any job!
        </h1>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h3 className="text-3xl font-semibold mb-8 text-center text-blue-700">
            My Jobs
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8">
            {myJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <p className="mb-2 text-lg font-semibold text-blue-600 flex items-center gap-2">
                  <HiBriefcase className="text-blue-600" />
                  {job.title}
                </p>

                <p className="text-gray-700 flex items-center gap-1">
                  <span className="font-semibold">Job Niche:</span> {job.jobNiche}
                </p>
                <p className="text-gray-700 flex items-center gap-1">
                  <HiCurrencyDollar />
                  <span className="font-semibold">Salary:</span> {job.salary}
                </p>
                <p className="text-gray-700 flex items-center gap-1">
                  <HiLocationMarker />
                  <span className="font-semibold">Location:</span> {job.location}
                </p>
                <p className="text-gray-700 flex items-center gap-1">
                  <HiClock />
                  <span className="font-semibold">Job Type:</span> {job.jobType}
                </p>
                <p className="text-gray-700 flex items-center gap-1">
                  <FaBuilding />
                  <span className="font-semibold">Company Name:</span> {job.companyName}
                </p>

                <p className="text-gray-700 mt-3">
                  <span className="font-semibold">Introduction:</span> {job.introduction}
                </p>
                <p className="text-gray-700 mt-3">
                  <span className="font-semibold">Qualifications:</span> {job.qualifications}
                </p>
                <p className="text-gray-700 mt-3">
                  <span className="font-semibold">Responsibilities:</span> {job.responsibilities}
                </p>
                {job.offers && (
                  <p className="text-gray-700 mt-3">
                    <span className="font-semibold">What are we offering:</span> {job.offers}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteJob(job.id)}
                  disabled={deletingId === job.id}
                  className={`mt-6 w-full flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition-colors duration-300 ${
                    deletingId === job.id ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  aria-label={`Delete job titled ${job.title}`}
                >
                  {deletingId === job.id ? (
                    <ClipLoader size={20} color="white" />
                  ) : (
                    <>
                      <HiTrash />
                      Delete Job
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MyJobs;
