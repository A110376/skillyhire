import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearAllUserErrors, login as loginUser } from '../store/slices/userSlice';
import { toast } from 'react-toastify';
import { FaRegUser } from 'react-icons/fa';
import { MdOutlineMailOutline } from 'react-icons/md';
import { RiLock2Fill } from 'react-icons/ri';
import InputField from '../components/InputField';

const LoginPage = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, isAuthenticated, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    dispatch(loginUser({ role, email, password }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }

    if (isAuthenticated) {
      setEmail('');
      setPassword('');
      setRole('');
      setTimeout(() => navigate('/'), 300);
    }
  }, [error, isAuthenticated, dispatch, navigate]);

  const isFormInvalid = !email || !password || !role;

  const roles = ['Employer', 'Job Seeker'];

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-6">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/40 animate-fade-in transition-all duration-700">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6 tracking-tight">
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          {/* Role Selector */}
          <div>
            <label htmlFor="role" className="block text-gray-800 font-semibold mb-2">Login As</label>
            <div className="relative">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-5 py-3 pr-12 shadow focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition"
                required
                aria-label="Select your role"
              >
                <option value="" disabled>Select Role</option>
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <FaRegUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" />
            </div>
          </div>

          {/* Email Field */}
          <InputField
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            Icon={MdOutlineMailOutline}
            required
          />

          {/* Password Field */}
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
            Icon={RiLock2Fill}
            required
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || isFormInvalid}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-3 rounded-xl shadow-md transition duration-300 disabled:opacity-60"
            aria-disabled={loading || isFormInvalid}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-700 hover:text-indigo-900 font-semibold transition"
            >
              Register Now
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
