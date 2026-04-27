import React from 'react';
import { ClipLoader } from 'react-spinners';

const Spinner = () => {
  return (
    <section className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 animate-backgroundTransition">
      <div className="animate-pulse p-6 rounded-full bg-white shadow-xl shadow-blue-300">
        <ClipLoader size={50} color="#3B82F6" />
      </div>
    </section>
  );
};

export default Spinner;
