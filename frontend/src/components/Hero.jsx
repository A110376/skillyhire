import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <section
      role="banner"
      className="bg-gradient-to-br from-blue-50 to-blue-100 py-20 px-4 sm:px-8 text-center min-h-screen flex items-center justify-center"
    >
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Find Your Dream Job Now!
        </h1>
        <h4 className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 px-2 sm:px-8">
          Discover the right opportunity — tailored jobs that match your skills and ambitions
        </h4>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-left space-y-5 mx-auto max-w-3xl">
          <p className="text-gray-700 text-sm sm:text-base">
            Whether you're just starting out or looking to take the next big step in your career,
            our platform connects you with top employers actively hiring across industries.
          </p>

          <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm sm:text-base">
            <li>✔ Personalized job recommendations</li>
            <li>✔ Real-time application tracking</li>
            <li>✔ Expert career resources and tips</li>
          </ul>

          <p className="text-blue-700 font-semibold text-sm sm:text-base">
            Start exploring today — your future awaits.
          </p>

          <div className="text-center">
            <button
              onClick={handleGetStarted}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
