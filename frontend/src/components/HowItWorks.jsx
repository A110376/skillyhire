import React from 'react';
import { LuUserPlus } from 'react-icons/lu';
import { VscTasklist } from 'react-icons/vsc';
import { BiSolidLike } from 'react-icons/bi';

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-50 text-center">
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 sm:mb-12 text-gray-800 px-4">
        How Does It Work?
      </h3>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 md:px-8">
        {/* Step 1 */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
          <div className="flex justify-center mb-4 text-blue-500 text-4xl sm:text-5xl">
            <LuUserPlus />
          </div>
          <h4 className="text-lg sm:text-xl font-semibold mb-2 text-gray-700">
            1. Create Your Profile
          </h4>
          <p className="text-sm sm:text-base text-gray-600">
            Sign up and build a profile highlighting your skills and experience.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
          <div className="flex justify-center mb-4 text-blue-500 text-4xl sm:text-5xl">
            <VscTasklist />
          </div>
          <h4 className="text-lg sm:text-xl font-semibold mb-2 text-gray-700">
            2. Browse Jobs
          </h4>
          <p className="text-sm sm:text-base text-gray-600">
            Explore curated job listings tailored to your preferences.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
          <div className="flex justify-center mb-4 text-blue-500 text-4xl sm:text-5xl">
            <BiSolidLike />
          </div>
          <h4 className="text-lg sm:text-xl font-semibold mb-2 text-gray-700">
            3. Hire or Get Hired
          </h4>
          <p className="text-sm sm:text-base text-gray-600">
            Submit your applications and track your progress in real-time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
