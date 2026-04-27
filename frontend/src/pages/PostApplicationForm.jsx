import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  postApplication,
  resetApplication,
  clearApplicationErrors,
} from "../store/slices/applicationSlice";
import { fetchSingleJob } from "../store/slices/jobSlice";
import { toast } from "react-toastify";
import { IoMdCash } from "react-icons/io";
import { FaToolbox, FaMapMarkerAlt } from "react-icons/fa";

const PostApplicationForm = () => {
  const { singleJob } = useSelector((state) => state.jobs);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { loading, error, message } = useSelector(
    (state) => state.applications
  );

  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCoverLetter("");
      setResumeFile(null);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearApplicationErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(resetApplication());
      setCoverLetter("");
      setResumeFile(null);
      navigate("/");
    }
  }, [error, message, dispatch, navigate]);

  useEffect(() => {
    if (jobId) dispatch(fetchSingleJob(jobId));
  }, [jobId, dispatch]);

  const handlePostApplication = (e) => {
    e.preventDefault();
    if (!jobId) return;

    const formData = new FormData();
    formData.append("jobSeekerName", name);
    formData.append("jobSeekerEmail", email);
    formData.append("jobSeekerPhone", phone);
    formData.append("jobSeekerAddress", address);
    formData.append("jobSeekerCoverLetter", coverLetter);
    if (resumeFile) formData.append("resume", resumeFile);

    dispatch(postApplication(jobId, formData));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only PDF, DOC, and DOCX are allowed.");
      setResumeFile(null);
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size exceeds the 5MB limit.");
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  if (!singleJob || Object.keys(singleJob).length === 0) {
    return (
      <div className="h-screen flex justify-center items-center text-xl font-semibold text-gray-500">
        Loading job details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-6xl p-8 space-y-8 flex flex-col lg:flex-row gap-8">
        {/* Application Form */}
        <div className="w-full lg:w-1/2 bg-white p-8 shadow-xl rounded-xl border border-gray-300 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-800">
              Apply for:{" "}
              <span className="text-indigo-600">
                {singleJob.title || "Job"}
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Please submit your details below
            </p>
          </div>

          {user ? (
            <form
              onSubmit={handlePostApplication}
              encType="multipart/form-data"
              className="space-y-6"
            >
              <div className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300">
                <label className="text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  value={singleJob.title || "Loading..."}
                  disabled
                  className="mt-2 w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  aria-readonly="true"
                />
              </div>

              {[
                {
                  label: "Your Name",
                  value: name,
                  setter: setName,
                  type: "text",
                },
                {
                  label: "Email",
                  value: email,
                  setter: setEmail,
                  type: "email",
                },
                { label: "Phone", value: phone, setter: setPhone, type: "tel" },
                {
                  label: "Address",
                  value: address,
                  setter: setAddress,
                  type: "text",
                },
              ].map(({ label, value, setter, type }) => (
                <div
                  key={label}
                  className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300"
                >
                  <label className="text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
                    aria-label={label}
                  />
                </div>
              ))}

              <div className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300">
                <label className="text-sm font-medium text-gray-700">
                  Cover Letter
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={10}
                  required
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
                  aria-label="Cover Letter"
                />
              </div>

              <div className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300">
                <label
                  htmlFor="resume"
                  className="text-sm font-medium text-gray-700"
                >
                  Resume (PDF, DOC, DOCX)
                </label>
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  disabled={loading}
                  className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                />
                {resumeFile && (
                  <p className="mt-1 text-sm text-gray-600">
                    Selected file: {resumeFile.name}
                  </p>
                )}
              </div>

              {isAuthenticated && user?.role === "Job Seeker" ? (
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              ) : (
                <div className="text-center text-red-500">
                  You must be a Job Seeker to submit an application.
                </div>
              )}
            </form>
          ) : (
            <p className="text-center text-gray-700">
              Please{" "}
              <a href="/login" className="text-indigo-600 underline">
                log in
              </a>{" "}
              to apply.
            </p>
          )}
        </div>

        {/* Job Details */}
        <div className="w-full lg:w-1/2 bg-white p-8 shadow-xl rounded-xl border border-gray-300 space-y-4">
          <header>
            <h3 className="text-2xl font-semibold text-gray-800">
              {singleJob.title}
            </h3>
            <p className="text-gray-600 mt-2">{singleJob.location}</p>
            <p className="text-lg font-semibold text-gray-800">
              Rs. {singleJob.salary} per month
            </p>
          </header>

          <div className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300">
            <h4 className="font-semibold text-gray-700">Job Details</h4>
            <div className="flex items-center gap-2 text-gray-600">
              <IoMdCash />
              <span className="font-semibold">Pay:</span>
              <span>{singleJob.salary} per month</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <FaToolbox />
              <span className="font-semibold">Job Type:</span>
              <span>{singleJob.jobType}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300">
            <h4 className="font-semibold text-gray-700">Location</h4>
            <div className="flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt />
              <span>{singleJob.location}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300">
            <h4 className="font-semibold text-gray-700">Job Description</h4>
            <p>{singleJob.introduction}</p>
          </div>

          <div className="space-y-4">
            {singleJob.companyName && (
              <div className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300">
                <h4 className="font-semibold text-gray-700">Company</h4>
                <p className="text-gray-600">{singleJob.companyName}</p>
              </div>
            )}

            {singleJob.personalWebsiteUrl && (
              <div className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300">
                <h4 className="font-semibold text-gray-700">
                  Personal Website
                </h4>
                <a
                  href={singleJob.personalWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline break-words"
                >
                  {singleJob.personalWebsiteTitle ||
                    singleJob.personalWebsiteUrl}
                </a>
              </div>
            )}

            {"hiringMultipleCandidates" in singleJob && (
              <div className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300">
                <h4 className="font-semibold text-gray-700">Openings</h4>
                <p className="text-gray-600">
                  {singleJob.hiringMultipleCandidates
                    ? "Hiring multiple candidates"
                    : "Hiring for a single position"}
                </p>
              </div>
            )}

            {singleJob.qualifications?.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300">
                <h4 className="font-semibold text-gray-700">Qualifications</h4>
                <ul>
                  {singleJob.qualifications.map((q, index) => (
                    <li key={index}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {singleJob.responsibilities?.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300">
                <h4 className="font-semibold text-gray-700">
                  Responsibilities
                </h4>
                <ul className="list-disc pl-5 text-gray-600">
                  {singleJob.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {singleJob.offers?.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300">
                <h4 className="font-semibold text-gray-700">Offerings</h4>
                <ul className="list-disc pl-5 text-gray-600">
                  {singleJob.offers.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
            )}

            {singleJob.jobNiche && (
              <footer className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-300">
                <h4 className="font-semibold text-gray-700">Job Niche</h4>
                <p>{singleJob.jobNiche}</p>
              </footer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostApplicationForm;
