import React from 'react';

const TopNiches = () => {
  const services = [
    { id: 1, icon: '🌐', service: 'Web Development', description: 'Build responsive and dynamic websites using modern front-end and back-end technologies.' },
    { id: 2, icon: '💻', service: 'Software Development', description: 'Design and build robust software solutions for desktops, servers, and enterprises.' },
    { id: 3, icon: '📱', service: 'App Development', description: 'Create feature-rich mobile applications for Android and iOS platforms.' },
    { id: 4, icon: '🎨', service: 'UI/UX Design', description: 'Craft user-centered designs with intuitive interfaces and engaging user experiences.' },
    { id: 5, icon: '⚙️', service: 'DevOps Engineering', description: 'Streamline development pipelines and automate deployments using CI/CD practices.' },
    { id: 6, icon: '☁️', service: 'Cloud Computing', description: 'Leverage cloud platforms like AWS, Azure, or GCP to build scalable and secure infrastructure.' },
    { id: 7, icon: '🔒', service: 'Cybersecurity', description: 'Protect systems and data from cyber threats through monitoring, encryption, and best practices.' }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Top Tech Niches</h2>
        <p className="text-gray-600 mb-10 text-base sm:text-lg">Explore the most in-demand fields in the tech industry</p>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {services.map(({ id, icon, service, description }) => (
            <div key={id} className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl p-6 text-left border border-gray-200 flex flex-col h-full">
              <div className="text-4xl mb-4 text-center">{icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">{service}</h3>
              <p className="text-gray-600 text-sm text-justify">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopNiches;
