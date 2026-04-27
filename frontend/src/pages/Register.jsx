import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearAllUserErrors, register as registerUser } from '../store/slices/userSlice';

const Register = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [niche1, setNiche1] = useState('');
  const [niche2, setNiche2] = useState('');
  const [niche3, setNiche3] = useState('');

  const { loading, isAuthenticated, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allNiches = [
    "Web Development", "App Development", "Software Development", "UI/UX Design",
    "DevOps", "Game Development", "Cybersecurity", "Data Science",
    "AI & Machine Learning", "Cloud Computing"
  ];

  const handleRegister = (e) => {
    e.preventDefault();
    if (loading) return;

    if (!role) return toast.error('Please select a role.');
    if (password.trim().length < 6) return toast.error('Password must be at least 6 characters.');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedAddress) {
      return toast.error('Please fill out all required fields.');
    }

    if (role === 'Job Seeker') {
      const selected = [niche1, niche2, niche3];
      const unique = new Set(selected);

      if (unique.size !== 3 || selected.includes('')) {
        return toast.error('Please select 3 different niches.');
      }

      if (resume) {
        if (resume.type !== 'application/pdf') {
          return toast.error('Only PDF files are allowed for resume.');
        }
        if (resume.size > 2 * 1024 * 1024) {
          return toast.error('Resume must be under 2MB.');
        }
      }
    }

    const formData = new FormData();
    formData.append('role', role);
    formData.append('name', trimmedName);
    formData.append('email', trimmedEmail);
    formData.append('phone', trimmedPhone);
    formData.append('address', trimmedAddress);
    formData.append('password', password);

    if (role === 'Job Seeker') {
      formData.append('coverLetter', coverLetter.trimStart());
      formData.append('firstNiche', niche1);
      formData.append('secondNiche', niche2);
      formData.append('thirdNiche', niche3);
      if (resume) formData.append('resume', resume);
    }

    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      dispatch(clearAllUserErrors());
    }

    if (isAuthenticated) {
      setRole('');
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setPassword('');
      setCoverLetter('');
      setResume(null);
      setNiche1('');
      setNiche2('');
      setNiche3('');
      document.activeElement?.blur();
      navigate('/');
    }
  }, [error, isAuthenticated, dispatch, navigate]);

  const getFilteredOptions = (exclude1, exclude2) =>
    allNiches.filter((n) => n !== exclude1 && n !== exclude2);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="w-full max-w-xl p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Create Your Account</h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <fieldset disabled={loading} className="space-y-5">
            <Select label="Register As" id="role" value={role} onChange={setRole} options={["Employer", "Job Seeker"]} required />
            <Input id="name" label="Full Name" value={name} onChange={setName} required autoComplete="name" />
            <Input id="email" label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />
            <Input id="phone" label="Phone" type="tel" value={phone} onChange={setPhone} required autoComplete="tel" />
            <Input id="address" label="Address" value={address} onChange={setAddress} required autoComplete="street-address" />
            <Input id="password" label="Password" type="password" value={password} onChange={setPassword} required autoComplete="new-password" />

            {role === 'Job Seeker' && (
              <>
                <div>
                  <label htmlFor="resume" className="block font-semibold mb-1">Resume (PDF)</label>
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label htmlFor="coverLetter" className="block font-semibold mb-1">Cover Letter</label>
                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Write a brief cover letter..."
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">Select 3 Niches</h3>
                  <Select label="Niche 1" id="niche1" value={niche1} onChange={setNiche1} options={getFilteredOptions(niche2, niche3)} required />
                  <Select label="Niche 2" id="niche2" value={niche2} onChange={setNiche2} options={getFilteredOptions(niche1, niche3)} required disabled={!niche1} />
                  <Select label="Niche 3" id="niche3" value={niche3} onChange={setNiche3} options={getFilteredOptions(niche1, niche2)} required disabled={!niche2} />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-xl transition disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </fieldset>

          <p className="text-sm text-center mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

// Reusable Input component
const Input = ({ label, id, type = 'text', value, onChange, required, autoComplete }) => (
  <div>
    <label htmlFor={id} className="block font-semibold mb-1">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      autoComplete={autoComplete}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl"
    />
  </div>
);

// Reusable Select component
const Select = ({ label, id, value, onChange, options, required, disabled }) => (
  <div>
    <label htmlFor={id} className="block font-semibold mb-1">{label}</label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      className={`w-full px-4 py-3 border border-gray-300 rounded-xl ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    >
      <option value="" disabled>Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default Register;
