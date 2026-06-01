import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icons as SVG components
const Icons = {
  Logo: () => (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="4" width="22" height="24" rx="3" fill="#3b82f6" />
      <rect x="6" y="8" width="14" height="2" rx="1" fill="white" />
      <rect x="6" y="12" width="10" height="2" rx="1" fill="white" opacity="0.7" />
      <rect x="6" y="16" width="14" height="2" rx="1" fill="white" opacity="0.7" />
      <rect x="6" y="20" width="8" height="2" rx="1" fill="white" opacity="0.7" />
    </svg>
  ),
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Books: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Categories: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  Borrow: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Overdue: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Fines: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Reservation: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Profile: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Home: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Sun: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

// Admin Sidebar
export function AdminSidebar() {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const adminLinks = [
    { to: '/admin', icon: Icons.Dashboard, label: 'Tổng quan', exact: true },
    { to: '/admin/books', icon: Icons.Books, label: 'Quản lý sách' },
    { to: '/admin/categories', icon: Icons.Categories, label: 'Danh mục' },
    { to: '/admin/borrows', icon: Icons.Borrow, label: 'Mượn/trả' },
    { to: '/admin/overdue', icon: Icons.Overdue, label: 'Quá hạn' },
    { to: '/admin/fines', icon: Icons.Fines, label: 'Tiền phạt' },
    { to: '/admin/reservations', icon: Icons.Reservation, label: 'Đặt trước' },
    ...(isAdmin ? [{ to: '/admin/users', icon: Icons.Users, label: 'Người dùng' }] : []),
  ];

  const bottomLinks = [
    { to: '/admin/settings', icon: Icons.Settings, label: 'Cài đặt' },
    { to: '/profile', icon: Icons.Profile, label: 'Hồ sơ' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-surface-200 dark:border-surface-700">
        <Link to="/admin" className="flex items-center gap-3">
          <Icons.Logo />
          <div>
            <span className="font-display font-bold text-lg text-surface-900 dark:text-white">Thư viện</span>
            <span className="font-display font-bold text-lg text-primary-600"> ĐHCNĐA</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">
        <div className="px-3 space-y-1">
          {adminLinks.map(link => {
            const isActive = link.exact
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-surface-100'
                }`}
              >
                <link.icon />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="py-4 border-t border-surface-200 dark:border-surface-700">
        <div className="px-3 space-y-1">
          {bottomLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-surface-100 transition-all duration-150"
            >
              <link.icon />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

// Student Sidebar
export function StudentSidebar() {
  const location = useLocation();

  const studentLinks = [
    { to: '/', icon: Icons.Home, label: 'Trang chủ' },
    { to: '/books', icon: Icons.Books, label: 'Tìm sách' },
    { to: '/my-history', icon: Icons.Borrow, label: 'Lịch sử mượn' },
    { to: '/my-fines', icon: Icons.Fines, label: 'Tiền phạt' },
    { to: '/my-reservations', icon: Icons.Reservation, label: 'Đặt trước' },
  ];

  const bottomLinks = [
    { to: '/profile', icon: Icons.Profile, label: 'Hồ sơ' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-surface-200 dark:border-surface-700">
        <Link to="/" className="flex items-center gap-3">
          <Icons.Logo />
          <div>
            <span className="font-display font-bold text-lg text-surface-900 dark:text-white">Thư viện</span>
            <span className="font-display font-bold text-lg text-primary-600"> ĐHCNĐA</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">
        <div className="px-3 space-y-1">
          {studentLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-surface-100'
                }`}
              >
                <link.icon />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="py-4 border-t border-surface-200 dark:border-surface-700">
        <div className="px-3 space-y-1">
          {bottomLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-surface-100 transition-all duration-150"
            >
              <link.icon />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

// Header Component
export function Header({ title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-16 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Title */}
      <div>
        <h1 className="text-xl font-display font-semibold text-surface-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-sm text-surface-500">{subtitle}</p>}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Search... (⌘K)"
            className="w-64 pl-10 pr-4 py-2 text-sm bg-surface-100 dark:bg-surface-700 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-surface-400 text-surface-900 dark:text-surface-100"
          />
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          {darkMode ? <Icons.Sun /> : <Icons.Moon />}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors relative">
          <Icons.Bell />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-sm font-semibold text-primary-600 dark:text-primary-300">
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300 hidden sm:block">
              {user?.fullName || user?.username}
            </span>
            <Icons.ChevronDown />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="dropdown-menu z-50">
                <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-700">
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{user?.fullName}</p>
                  <p className="text-xs text-surface-500">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  <Icons.Profile /> Hồ sơ
                </Link>
                <button onClick={handleLogout} className="dropdown-item text-error w-full">
                  <Icons.Logout /> Đăng xuất
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Main Layout
export function AdminLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <AdminSidebar />
      <div className="pl-64">
        <Header title={title} subtitle={subtitle} />
        <main className="p-6 page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export function StudentLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <StudentSidebar />
      <div className="pl-64">
        <Header title={title} subtitle={subtitle} />
        <main className="p-6 page-content">
          {children}
        </main>
      </div>
    </div>
  );
}