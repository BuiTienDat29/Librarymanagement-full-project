import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ── Navbar (Legacy - for public pages) ─────────────────────
export function Navbar() {
  const { user, logout, isLibrarian } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span>📚</span>
          <span className="hidden sm:block">Thư viện ĐHCNĐA</span>
        </Link>
        <div className="flex items-center gap-3">
          {isLibrarian && (
            <Link to="/admin" className="text-blue-200 hover:text-white text-sm transition-colors">
              Quản trị
            </Link>
          )}
          <Link to="/books" className="text-blue-200 hover:text-white text-sm transition-colors">
            Sách
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-blue-200 hover:text-white text-sm hidden sm:block">
                {user.fullName}
              </Link>
              <button onClick={handleLogout} className="bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded-lg text-sm transition-colors">
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// ── Sidebar (Legacy - for admin) ────────────────────────────
export function AdminSidebar() {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const links = [
    { to: '/admin',             label: '📊 Tổng quan',     exact: true },
    { to: '/admin/books',       label: '📚 Quản lý sách' },
    { to: '/admin/categories',  label: '🗂️ Danh mục' },
    { to: '/admin/borrows',     label: '📖 Mượn/trả' },
    { to: '/admin/overdue',     label: '⏰ Quá hạn' },
    { to: '/admin/fines',       label: '💰 Tiền phạt' },
    { to: '/admin/reservations',label: '🔖 Đặt trước' },
    ...(isAdmin ? [{ to: '/admin/users', label: '👥 Người dùng' }] : []),
  ];

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-surface-200 min-h-screen pt-4">
      {links.map(l => {
        const active = l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to);
        return (
          <Link key={l.to} to={l.to}
            className={`flex items-center px-4 py-2.5 text-sm transition-colors ${
              active ? 'bg-primary-50 text-primary-700 font-medium border-r-2 border-primary-600'
                     : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'}`}>
            {l.label}
          </Link>
        );
      })}
    </aside>
  );
}

// ── Pagination ────────────────────────────────────────────
export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button disabled={page === 0} onClick={() => onPageChange(page - 1)}
        className="btn btn-sm btn-secondary disabled:opacity-40">
        ‹ Trước
      </button>
      <span className="text-sm text-surface-600 dark:text-surface-400">Trang {page + 1} / {totalPages}</span>
      <button disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}
        className="btn btn-sm btn-secondary disabled:opacity-40">
        Sau ›
      </button>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-display font-semibold text-lg text-surface-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 text-xl">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ── Loading ───────────────────────────────────────────────
export function LoadingSpinner({ text = 'Đang tải...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 border-4 border-surface-200 dark:border-surface-700 border-t-primary-600 rounded-full animate-spin"></div>
      <span className="text-surface-500 dark:text-surface-400 text-sm">{text}</span>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    BORROWED:  'badge-primary',
    RETURNED:  'badge-success',
    OVERDUE:   'badge-error',
    LOST:      'badge-error',
    PENDING:   'badge-warning',
    PAID:      'badge-success',
    WAIVED:    'badge-success',
    WAITING:   'badge-purple',
    READY:     'badge-info',
    FULFILLED: 'badge-success',
    CANCELLED: 'badge-secondary',
    EXPIRED:   'badge-error',
    AVAILABLE:     'badge-success',
    MAINTENANCE:   'badge-warning',
  };
  const labels = {
    BORROWED:'Đang mượn', RETURNED:'Đã trả', OVERDUE:'Quá hạn', LOST:'Mất sách',
    PENDING:'Chờ thanh toán', PAID:'Đã thanh toán', WAIVED:'Miễn phạt',
    WAITING:'Đang chờ', READY:'Sẵn sàng', FULFILLED:'Hoàn thành',
    CANCELLED:'Đã hủy', EXPIRED:'Hết hạn', AVAILABLE:'Còn sách', MAINTENANCE:'Bảo trì',
  };
  return <span className={map[status] || 'badge-primary'}>{labels[status] || status}</span>;
}

// ── Alert ─────────────────────────────────────────────────
export function Alert({ type = 'error', message }) {
  if (!message) return null;
  const styles = {
    error:   'alert-error',
    success: 'alert-success',
    info:    'alert-info',
  };
  return (
    <div className={`alert ${styles[type]}`}>{message}</div>
  );
}

// ── Empty State ───────────────────────────────────────────
export function EmptyState({ icon = '📭', title, description }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="font-medium text-surface-700 dark:text-surface-300">{title}</p>
      {description && <p className="text-sm text-surface-500 mt-1">{description}</p>}
    </div>
  );
}

// Re-export Layout components
export { AdminLayout, StudentLayout, Header } from './Layout';
export { StatCard, QuickActionCard, ActivityItem, MiniChart } from './StatCard';