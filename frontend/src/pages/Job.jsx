import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs, clearAllJobErrors } from '../store/slices/jobSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Job = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { jobs, loading, error } = useSelector(state => state.jobs);
  const dispatch = useDispatch();

  const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];
  const niches = ["Web Development", "Game Development","Software Engineering","Software Development","App Development", "UI/UX Design", "Cybersecurity", "Data Analysis", "AI & Machine Learning", "Cloud Computing"];

  useEffect(() => {
    dispatch(fetchJobs({ city: "", niche: "", searchKeyword: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
  }, [error, dispatch]);

  const handleSearch = () => {
    dispatch(fetchJobs({ city: selectedCity, niche: selectedNiche, searchKeyword }));
    setSidebarOpen(false);
  };

  const clearAllFilters = () => {
    setSelectedCity("");
    setSelectedNiche("");
    setSearchKeyword("");
    dispatch(fetchJobs({ city: "", niche: "", searchKeyword: "" }));
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col md:flex-row w-screen h-screen bg-gray-50">
          {/* Mobile Navbar */}
          <div className="md:hidden flex justify-between items-center bg-white p-4 shadow-md">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-blue-600">
              {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search jobs..."
              className="ml-4 flex-grow border border-blue-400 rounded-md px-4 py-2"
            />
            <button onClick={handleSearch} className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md">
              <FaSearch />
            </button>
          </div>

          {/* Sidebar */}
          <aside className={`bg-white p-6 shadow-md md:sticky md:top-0 md:h-screen md:w-64 fixed top-0 left-0 h-full w-64 z-40 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
            <div className="md:hidden flex justify-end mb-4">
              <button onClick={() => setSidebarOpen(false)} className="text-blue-600">
                <FaTimes size={24} />
              </button>
            </div>

            {/* City Filter */}
            <h2 className="text-xl font-bold text-blue-700 mb-2">Filter by City</h2>
            <div className="mb-6 max-h-40 overflow-y-auto">
              {cities.map((city, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name="city"
                    value={city}
                    checked={selectedCity === city}
                    onChange={() => {
                      setSelectedCity(city);
                      dispatch(fetchJobs({ city, niche: selectedNiche, searchKeyword }));
                    }}
                    className="mr-2"
                  />
                  {city}
                </label>
              ))}
              <button onClick={() => {
                setSelectedCity("");
                dispatch(fetchJobs({ city: "", niche: selectedNiche, searchKeyword }));
              }} className="text-blue-500 mt-2 text-sm hover:underline">Clear City Filter</button>
            </div>

            {/* Niche Filter */}
            <h2 className="text-xl font-bold text-blue-700 mb-2">Filter by Niche</h2>
            <div className="mb-6 max-h-40 overflow-y-auto">
              {niches.map((niche, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name="niche"
                    value={niche}
                    checked={selectedNiche === niche}
                    onChange={() => {
                      setSelectedNiche(niche);
                      dispatch(fetchJobs({ city: selectedCity, niche, searchKeyword }));
                    }}
                    className="mr-2"
                  />
                  {niche}
                </label>
              ))}
              <button onClick={() => {
                setSelectedNiche("");
                dispatch(fetchJobs({ city: selectedCity, niche: "", searchKeyword }));
              }} className="text-blue-500 mt-2 text-sm hover:underline">Clear Niche Filter</button>
            </div>

            <button onClick={clearAllFilters} className="text-red-600 hover:underline text-sm">
              Clear All Filters
            </button>
          </aside>
<main className="flex-1 p-6 overflow-y-auto">
  <div className="hidden md:flex mb-4 gap-2">
    <input
      type="text"
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      placeholder="Search jobs..."
      className="flex-grow border border-blue-400 rounded-md px-4 py-2"
    />
    <button onClick={handleSearch} className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2">
      <FaSearch />
      Search
    </button>
  </div>

  {jobs && jobs.length > 0 ? (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job, idx) => (
        <div key={idx} className="bg-white border border-blue-200 rounded-lg p-5 shadow hover:shadow-lg transition-all duration-300">
          <h3 className="text-xl font-semibold text-blue-900 mb-1">{job.title}</h3>
          <p className="text-blue-800 font-medium">{job.companyName}</p>
          <p className="text-blue-600 text-sm">{job.city} | {job.niche}</p>
          <p className="text-gray-700 mt-2">Salary: Rs.{job.salary || 'N/A'}</p>
          <p className="text-sm text-gray-500">Posted: {new Date(job.jobPostedOn).toLocaleDateString()}</p>
          <Link
            to={`/post/application/${job._id || job.id}`}
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Apply Now
          </Link>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500 text-lg mt-20">No Jobs Found.</p>
  )}
</main>

        </div>
      )}
    </>
  );
};

export default Job;
