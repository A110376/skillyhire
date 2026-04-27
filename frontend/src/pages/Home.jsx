import React from 'react';
import Hero from '../components/Hero';
import TopNiches from '../components/TopNiches';
import HowItWorks from '../components/HowItWorks';

const Home = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <Hero />
      <TopNiches />
      <HowItWorks />
    </main>
  );
};

export default Home;
