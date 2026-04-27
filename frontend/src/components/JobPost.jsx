import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { postJob, clearAllJobErrors } from '../store/slices/jobSlice';
import { FaUserCircle } from 'react-icons/fa';

const JobPost = () => {
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [offers, setOffers] = useState("");
  const [jobNiche, setJobNiche] = useState("");
  const [salary, setSalary] = useState("");
  const [hiringMultipleCandidates, setHiringMultipleCandidates] = useState("");
  const [personalWebsiteTitle, setPersonalWebsiteTitle] = useState("");
  const [personalWebsiteUrl, setPersonalWebsiteUrl] = useState("");

  const allNiches = [
    "Web Development", "App Development", "Software Development", "UI/UX Design",
    "DevOps", "Game Development", "Cybersecurity", "Data Science",
    "AI & Machine Learning", "Cloud Computing"
  ];

  const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
    "Multan", "Peshawar", "Quetta", "Hyderabad", "Sialkot",
    "Bahawalpur", "Sargodha", "Gujranwala", "Sukkur",
    "Abbottabad", "Mardan", "Mirpur", "Gilgit", "Muzaffarabad"];

  const { isAuthenticated } = useSelector(state => state.user);
  const { message, loading, error } = useSelector(state => state.jobs);
  const dispatch = useDispatch();

  const resetForm = () => {
    setTitle("");
    setJobType("");
    setLocation("");
    setCompanyName("");
    setIntroduction("");
    setResponsibilities("");
    setQualifications("");
    setOffers("");
    setJobNiche("");
    setSalary("");
    setHiringMultipleCandidates("");
    setPersonalWebsiteTitle("");
    setPersonalWebsiteUrl("");
  };

  const handlePost = (e) => {
    e.preventDefault();

    // URL validation
    if (personalWebsiteUrl && !/^https?:\/\/[\w.-]+\.[a-z]{2,}/.test(personalWebsiteUrl)) {
      toast.error("Please enter a valid website URL.");
      return;
    }

    const jobData = {
      title,
      jobType,
      location,
      companyName,
      introduction,
      responsibilities: responsibilities.split("\n").map(i => i.trim()).filter(Boolean),
      qualifications: qualifications.split("\n").map(i => i.trim()).filter(Boolean),
      offers: offers ? offers.split("\n").map(i => i.trim()).filter(Boolean) : [],
      jobNiche,
      salary,
      hiringMultipleCandidates: hiringMultipleCandidates === "Yes",
      personalWebsiteTitle: personalWebsiteTitle || null,
      personalWebsiteUrl: personalWebsiteUrl || null,
    };

    dispatch(postJob(jobData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    if (message) {
      toast.success(message);
      resetForm();
    }
  }, [dispatch, error, message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-2xl">
        <div className="flex items-center mb-6">
          <FaUserCircle className="text-4xl text-indigo-600 mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Post a Job</h1>
        </div>

        <form onSubmit={handlePost} className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-indigo-700 mb-4">Job Information</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <InputField label="Job Title" value={title} onChange={setTitle} required placeholder="e.g., Frontend Developer" />
              <SelectField label="Job Type" value={jobType} onChange={setJobType} required options={["Full-time", "Part-time", "Contract", "Internship"]} />
              <SelectField label="Location" value={location} onChange={setLocation} required options={cities} />
              <InputField label="Company Name" value={companyName} onChange={setCompanyName} required placeholder="Company XYZ" />
              <SelectField label="Job Niche" value={jobNiche} onChange={setJobNiche} required options={allNiches} />
              <InputField label="Salary" value={salary} onChange={setSalary} required placeholder="e.g., 70,000 PKR" />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-indigo-700 mb-4">Job Description</h2>
            <TextArea label="Job Introduction" value={introduction} onChange={setIntroduction} required />
            <TextArea label="Responsibilities" value={responsibilities} onChange={setResponsibilities} required />
            <TextArea label="Qualifications" value={qualifications} onChange={setQualifications} required />
            <TextArea label="Offers (optional)" value={offers} onChange={setOffers} />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-indigo-700 mb-4">Additional Info (Optional)</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <SelectField label="Hiring Multiple Candidates?" value={hiringMultipleCandidates} onChange={setHiringMultipleCandidates} options={["Yes", "No"]} />
              <InputField label="Website Title" value={personalWebsiteTitle} onChange={setPersonalWebsiteTitle} placeholder="e.g., Portfolio" />
              <InputField label="Website URL" value={personalWebsiteUrl} onChange={setPersonalWebsiteUrl} type="url" placeholder="https://example.com" />
            </div>
          </section>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !isAuthenticated}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 ${!isAuthenticated && "opacity-50 cursor-not-allowed"}`}
            >
              {loading ? "Posting..." : isAuthenticated ? "Post Job" : "Login to Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Input Field
const InputField = ({ label, value, onChange, required = false, placeholder = "", type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

// Select Field
const SelectField = ({ label, value, onChange, options, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

// Text Area
const TextArea = ({ label, value, onChange, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      rows="4"
      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

export default JobPost;
