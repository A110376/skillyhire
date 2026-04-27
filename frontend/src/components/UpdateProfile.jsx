import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updateUserProfile,
  resetUpdateProfileState,
} from '../store/slices/updateProfileSlice';

const allNiches = [
  'Web Development', 'App Development', 'Software Development', 'UI/UX Design',
  'DevOps', 'Game Development', 'Cybersecurity', 'Data Science',
  'AI & Machine Learning', 'Cloud Computing'
];

const UpdateProfile = () => {
  const { user } = useSelector(state => state.user);
  const { loading, error, isUpdated } = useSelector(state => state.updateProfile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [firstNiche, setFirstNiche] = useState('');
  const [secondNiche, setSecondNiche] = useState('');
  const [thirdNiche, setThirdNiche] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCoverLetter(user.coverLetter || '');
      setFirstNiche(allNiches.includes(user.niches?.firstNiche) ? user.niches.firstNiche : '');
      setSecondNiche(allNiches.includes(user.niches?.secondNiche) ? user.niches.secondNiche : '');
      setThirdNiche(allNiches.includes(user.niches?.thirdNiche) ? user.niches.thirdNiche : '');
      setResumeFile(null);
      setResumePreview(user.resume?.url || null);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(resetUpdateProfileState());
    }
    if (isUpdated) {
      alert('Profile updated successfully!');
      dispatch(resetUpdateProfileState());
      navigate("/");
    }
  }, [error, isUpdated, dispatch, navigate]);

  useEffect(() => {
    return () => {
      if (resumePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(resumePreview);
      }
    };
  }, [resumePreview]);

  const getFilteredOptions = (a, b) => allNiches.filter(n => n !== a && n !== b);

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      if (resumePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(resumePreview);
      }
      setResumeFile(file);
      setResumePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (user.role === 'Job Seeker') {
      if (!firstNiche || !secondNiche || !thirdNiche) return alert('Select 3 niches.');
      if (new Set([firstNiche, secondNiche, thirdNiche]).size !== 3)
        return alert('Niches must be unique.');
      if (!coverLetter.trim()) return alert('Cover letter is required.');
    }
    if (![name, email, phone, address].every(f => f.trim())) return alert('All fields are required.');
    
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('email', email.trim());
    formData.append('phone', phone.trim());
    formData.append('address', address.trim());
    if (user.role === 'Job Seeker') {
      formData.append('coverLetter', coverLetter.trim());
      formData.append('firstNiche', firstNiche);
      formData.append('secondNiche', secondNiche);
      formData.append('thirdNiche', thirdNiche);
      if (resumeFile) formData.append('resume', resumeFile);
    }
    dispatch(updateUserProfile(formData));
  };

  if (!user) return <div className="text-center py-10">Loading profile...</div>;

  return (
   <section className="max-w-3xl mx-auto my-6 md:my-12 p-4 md:p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center text-blue-600 mb-6 md:mb-10">Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Input label="Full Name" value={name} onChange={setName} required autoComplete="name" />
        <Input label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />
        <Input label="Phone" type="tel" value={phone} onChange={setPhone} required autoComplete="tel" />
        <Input label="Address" value={address} onChange={setAddress} required autoComplete="street-address" />

        {user.role === 'Job Seeker' && (
          <>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Cover Letter</label>
              <textarea
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                placeholder="Write your cover letter..."
                rows={6}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800">Select Your Niches</h3>
              <Select label="Niche 1" value={firstNiche} onChange={setFirstNiche} options={getFilteredOptions(secondNiche, thirdNiche)} required />
              <Select label="Niche 2" value={secondNiche} onChange={setSecondNiche} options={getFilteredOptions(firstNiche, thirdNiche)} required />
              <Select label="Niche 3" value={thirdNiche} onChange={setThirdNiche} options={getFilteredOptions(firstNiche, secondNiche)} required />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Upload Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="block w-full text-gray-600 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white file:text-blue-600 hover:file:bg-blue-100"
              />
              {resumePreview && (
                <p className="mt-2 text-sm text-gray-700">
                  <span>{resumeFile ? 'Selected file:' : 'Uploaded:'}</span>{' '}
                  <strong>{resumeFile ? resumeFile.name : resumePreview.split('/').pop()}</strong>{' '}
                  <a href={resumePreview} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">
                    View
                  </a>
                </p>
              )}
            </div>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <Input label="Role" value={user.role} disabled />
          <Input label="Joined On" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} disabled />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </section>
  );
};

const Input = ({ label, type = 'text', value, onChange, required, autoComplete, disabled = false }) => (
  <div>
    <label className="block font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      autoComplete={autoComplete}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-xl border ${
        disabled ? 'bg-gray-100 text-gray-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white'
      }`}
    />
  </div>
);

const Select = ({ label, value, onChange, options, required }) => (
  <div>
    <label className="block font-medium text-gray-700 mb-2">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
    >
      <option value="" disabled hidden>Select {label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default UpdateProfile;
