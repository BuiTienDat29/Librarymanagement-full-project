import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
};

export default function Login() {
  const [form, setForm]   = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      const dest = ['ADMIN','LIBRARIAN'].includes(user.role) ? '/admin' : from;
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

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
            Thư viện <span className="text-primary-600">ĐHCNĐA</span>
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-2">Sign in to continue to Library</p>
        </div>

        {/* Login Card */}
        <div className="card p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Alert type="error" message={error} />

            {/* Username */}
            <div>
              <label className="label">Username</label>
              <input
                className="input"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                required
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input pr-10"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  required
                  autoComplete="current-password"
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

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-surface-600 dark:text-surface-400">Remember me</span>
              </label>
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-base disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Register now
            </Link>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 p-4 bg-surface-100 dark:bg-surface-800 rounded-xl">
          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-xs text-surface-600 dark:text-surface-300">
            <p><span className="font-medium">Admin:</span> admin / Admin@123</p>
            <p><span className="font-medium">Student:</span> student001 / Student@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}