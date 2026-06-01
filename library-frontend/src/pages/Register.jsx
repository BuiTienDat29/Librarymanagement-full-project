import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components';

// Icons
const Icons = {
  Logo: () => (
    <svg className="w-12 h-12" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="4" width="22" height="24" rx="3" fill="#3b82f6" />
      <rect x="6" y="8" width="14" height="2" rx="1" fill="white" />
      <rect x="6" y="12" width="10" height="2" rx="1" fill="white" opacity="0.7" />
      <rect x="6" y="16" width="14" height="2" rx="1" fill="white" opacity="0.7" />
      <rect x="6" y="20" width="8" height="2" rx="1" fill="white" opacity="0.7" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  EyeOff: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Card: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
};

export default function Register() {
  const [form, setForm]   = useState({ username:'', password:'', email:'', fullName:'', phone:'', studentId:'' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register }  = useAuth();
  const navigate      = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại.');
    } finally { setLoading(false); }
  };

  const set = key => e => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 dark:bg-accent-900/30 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Icons.Logo />
          </div>
          <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-2">Join our library system today</p>
        </div>

        {/* Register Card */}
        <div className="card p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Alert type="error" message={error} />

            {/* Full Name */}
            <div>
              <label className="label">Full Name *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                  <Icons.User />
                </div>
                <input
                  className="input pl-10"
                  placeholder="Nguyễn Văn A"
                  value={form.fullName}
                  onChange={set('fullName')}
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="label">Username *</label>
              <input
                className="input"
                placeholder="nguyenvana"
                value={form.username}
                onChange={set('username')}
                required minLength={4}
              />
            </div>

            {/* Email */}
            <div>
              <label className="label">Email *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                  <Icons.Mail />
                </div>
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Student ID */}
              <div>
                <label className="label">Student ID</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                    <Icons.Card />
                  </div>
                  <input
                    className="input pl-10"
                    placeholder="SV001"
                    value={form.studentId}
                    onChange={set('studentId')}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="label">Phone</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                    <Icons.Phone />
                  </div>
                  <input
                    className="input pl-10"
                    placeholder="0987..."
                    value={form.phone}
                    onChange={set('phone')}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                  <Icons.Lock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input pl-10 pr-10"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={set('password')}
                  required minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-base disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}