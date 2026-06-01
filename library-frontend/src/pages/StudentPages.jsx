import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StudentLayout } from '../components/Layout';
import { Pagination, LoadingSpinner, StatusBadge, Alert, EmptyState } from '../components';
import { borrowService, fineService, reservationService, userService } from '../services';
import { useAuth } from '../context/AuthContext';

// Icons
const Icons = {
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
  History: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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
  Book: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Warning: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// Stat Card Component for Student
function StatCard({ icon: Icon, label, value, subValue, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400',
    green: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    red: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
    yellow: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="card p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon />
        </div>
        <div>
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{label}</p>
          <p className="text-2xl font-display font-bold text-surface-900 dark:text-white">{value}</p>
          {subValue && <p className="text-xs text-surface-500">{subValue}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Home ──────────────────────────────────────────────────
export function Home() {
  const { user, isLibrarian } = useAuth();
  if (isLibrarian) { window.location.href = '/admin'; return null; }

  // Mock data - replace with actual API calls
  const stats = {
    borrowing: 2,
    dueSoon: 2,
    pendingFines: 50000,
    reservations: 1,
  };

  const dueBooks = [
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', dueDate: '05/06/2026', daysLeft: -2, overdue: true },
    { id: 2, title: 'Design Patterns', author: 'Gang of 4', dueDate: '10/06/2026', daysLeft: 3, overdue: false },
  ];

  const notifications = [
    { id: 1, title: 'Sách "Clean Architecture" sẵn sàng', desc: 'Đến nhận tại quầy. Hạn đến 01/06/2026', time: '2 giờ trước' },
  ];

  return (
    <StudentLayout
      title={`Welcome back, ${user?.fullName?.split(' ').pop() || 'Student'} 👋`}
      subtitle="You have 2 books due this week"
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Icons.Book}
            label="Đang mượn"
            value={stats.borrowing}
            subValue="cuốn sách"
            color="blue"
          />
          <StatCard
            icon={Icons.Clock}
            label="Sắp đến hạn"
            value={stats.dueSoon}
            subValue="cần trả tuần này"
            color="yellow"
          />
          <StatCard
            icon={Icons.Fines}
            label="Tiền phạt"
            value={`${stats.pendingFines.toLocaleString('vi')}đ`}
            subValue="chưa thanh toán"
            color="red"
          />
          <StatCard
            icon={Icons.Reservation}
            label="Đặt trước"
            value={stats.reservations}
            subValue="sách chờ nhận"
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: '/books', icon: Icons.Search, label: 'Tìm sách', color: 'blue' },
            { to: '/my-history', icon: Icons.History, label: 'Lịch sử mượn', color: 'green' },
            { to: '/my-fines', icon: Icons.Fines, label: 'Tiền phạt', color: 'red' },
            { to: '/my-reservations', icon: Icons.Reservation, label: 'Đặt trước', color: 'purple' },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="card p-4 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                item.color === 'blue' ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600' :
                item.color === 'green' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600' :
                item.color === 'red' ? 'bg-red-100 dark:bg-red-900/40 text-red-600' :
                'bg-purple-100 dark:bg-purple-900/40 text-purple-600'
              }`}>
                <item.icon />
              </div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">{item.label}</p>
            </Link>
          ))}
        </div>

        {/* Due Books */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-surface-900 dark:text-white">Sách đang mượn</h3>
              <Link to="/my-history" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Xem tất cả →
              </Link>
            </div>
            <div className="space-y-3">
              {dueBooks.map(book => (
                <div key={book.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      book.overdue ? 'bg-red-100 dark:bg-red-900/40 text-red-600' : 'bg-primary-100 dark:bg-primary-900/40 text-primary-600'
                    }`}>
                      <Icons.Book />
                    </div>
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white text-sm">{book.title}</p>
                      <p className="text-xs text-surface-500">{book.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-surface-500">Hạn trả</p>
                    <p className={`text-sm font-medium ${
                      book.overdue ? 'text-error' : book.daysLeft <= 3 ? 'text-warning' : 'text-surface-700 dark:text-surface-300'
                    }`}>
                      {book.dueDate}
                    </p>
                    {book.overdue && (
                      <span className="badge badge-error text-xs">Quá hạn {Math.abs(book.daysLeft)} ngày</span>
                    )}
                    {book.daysLeft > 0 && book.daysLeft <= 3 && !book.overdue && (
                      <span className="badge badge-warning text-xs">Còn {book.daysLeft} ngày</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-surface-900 dark:text-white">Thông báo</h3>
            </div>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map(notif => (
                  <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex-shrink-0">
                      <Icons.Bell />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-surface-900 dark:text-white text-sm">{notif.title}</p>
                      <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">{notif.desc}</p>
                      <p className="text-xs text-surface-400 mt-2">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-surface-500">
                Không có thông báo mới
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

// ── My Borrow History ─────────────────────────────────────
export function MyHistory() {
  const [data, setData]   = useState([]);
  const [page, setPage]   = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await borrowService.myHistory({ page, size: 10 });
      setData(res.data.content);
      setTotal(res.data.totalPages);
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  return (
    <StudentLayout title="Lịch sử mượn sách" subtitle="Xem lịch sử mượn và trả sách của bạn">
      {loading ? <LoadingSpinner /> : data.length === 0 ? (
        <EmptyState icon="📭" title="Chưa có lịch sử mượn" description="Hãy tìm kiếm và mượn sách ngay!" />
      ) : (
        <>
          <div className="table-container">
            <table className="table-modern">
              <thead>
                <tr>
                  {['Tên sách','Tác giả','Ngày mượn','Hạn trả','Ngày trả','Trạng thái'].map(h =>
                    <th key={h} className="whitespace-nowrap">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map(r => (
                  <tr key={r.id}>
                    <td className="font-medium text-surface-900 dark:text-white">{r.bookTitle}</td>
                    <td className="text-surface-500">{r.bookAuthor}</td>
                    <td className="text-surface-500">{r.borrowDate}</td>
                    <td className={`font-medium ${r.overdue ? 'text-error' : 'text-surface-500'}`}>{r.dueDate}</td>
                    <td className="text-surface-500">{r.returnDate || '—'}</td>
                    <td><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={total} onPageChange={setPage} />
        </>
      )}
    </StudentLayout>
  );
}

// ── My Fines ──────────────────────────────────────────────
export function MyFines() {
  const [data, setData]   = useState([]);
  const [page, setPage]   = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]     = useState({ type:'', text:'' });

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type:'', text:'' }), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fineService.myFines({ page, size: 10 });
      setData(res.data.content);
      setTotal(res.data.totalPages);
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const totalPending = data.filter(f => f.status === 'PENDING')
                          .reduce((s, f) => s + Number(f.amount), 0);

  return (
    <StudentLayout title="Tiền phạt của tôi" subtitle="Quản lý các khoản phạt do quá hạn">
      {totalPending > 0 && (
        <div className="mb-4 alert alert-warning flex items-center gap-2">
          <Icons.Warning />
          <span>Bạn đang có <strong>{totalPending.toLocaleString('vi')}đ</strong> tiền phạt chưa thanh toán. Vui lòng đến thư viện để thanh toán.</span>
        </div>
      )}
      <Alert type={msg.type} message={msg.text} />
      {loading ? <LoadingSpinner /> : data.length === 0 ? (
        <EmptyState icon="✅" title="Không có tiền phạt" description="Bạn chưa có khoản phạt nào." />
      ) : (
        <>
          <div className="table-container">
            <table className="table-modern">
              <thead>
                <tr>
                  {['Sách','Số ngày quá hạn','Số tiền phạt','Trạng thái','Ngày tạo'].map(h =>
                    <th key={h}>{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map(f => (
                  <tr key={f.id}>
                    <td className="font-medium text-surface-900 dark:text-white">{f.bookTitle}</td>
                    <td className="text-surface-500">{f.daysOverdue} ngày</td>
                    <td className="text-error font-medium">{Number(f.amount).toLocaleString('vi')}đ</td>
                    <td><StatusBadge status={f.status} /></td>
                    <td className="text-surface-500">{f.createdAt?.slice(0,10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={total} onPageChange={setPage} />
        </>
      )}
    </StudentLayout>
  );
}

// ── My Reservations ───────────────────────────────────────
export function MyReservations() {
  const [data, setData]   = useState([]);
  const [page, setPage]   = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]     = useState({ type:'', text:'' });

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type:'', text:'' }), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reservationService.my({ page, size: 10 });
      setData(res.data.content);
      setTotal(res.data.totalPages);
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleCancel = async (id) => {
    if (!window.confirm('Hủy đặt trước này?')) return;
    try {
      await reservationService.cancel(id);
      flash('success', 'Đã hủy đặt trước.');
      load();
    } catch (err) { flash('error', err.response?.data?.message || 'Lỗi.'); }
  };

  return (
    <StudentLayout title="Sách đặt trước" subtitle="Quản lý danh sách đặt trước sách">
      <Alert type={msg.type} message={msg.text} />
      {loading ? <LoadingSpinner /> : data.length === 0 ? (
        <EmptyState icon="🔖" title="Không có đặt trước nào" />
      ) : (
        <>
          <div className="table-container">
            <table className="table-modern">
              <thead>
                <tr>
                  {['Tên sách','Tác giả','Ngày đặt','Hết hạn giữ','Trạng thái','Hành động'].map(h =>
                    <th key={h}>{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map(r => (
                  <tr key={r.id}>
                    <td className="font-medium text-surface-900 dark:text-white">{r.bookTitle}</td>
                    <td className="text-surface-500">{r.bookAuthor}</td>
                    <td className="text-surface-500">{r.reservedAt?.slice(0,10)}</td>
                    <td className="text-surface-500">{r.expiresAt?.slice(0,10) || '—'}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      {['WAITING','READY'].includes(r.status) && (
                        <button onClick={() => handleCancel(r.id)}
                          className="text-error hover:text-red-700 text-xs font-medium">
                          Hủy
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={total} onPageChange={setPage} />
        </>
      )}
    </StudentLayout>
  );
}

// ── Profile ───────────────────────────────────────────────
export function Profile() {
  const { user: authUser, login } = useAuth();
  const [form, setForm]     = useState({ fullName:'', email:'', phone:'', studentId:'' });
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'' });
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState({ type:'', text:'' });
  const [pwMsg, setPwMsg]       = useState({ type:'', text:'' });

  const flash   = (type, text) => { setMsg({ type, text });   setTimeout(() => setMsg({ type:'',   text:'' }), 3000); };
  const flashPw = (type, text) => { setPwMsg({ type, text }); setTimeout(() => setPwMsg({ type:'', text:'' }), 3000); };

  useEffect(() => {
    userService.getProfile().then(r => {
      const u = r.data;
      setForm({ fullName: u.fullName || '', email: u.email || '', phone: u.phone || '', studentId: u.studentId || '' });
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateProfile(form);
      flash('success', 'Cập nhật thông tin thành công!');
    } catch (err) { flash('error', err.response?.data?.message || 'Lỗi cập nhật.'); }
    finally { setLoading(false); }
  };

  const handleChangePw = async (e) => {
    e.preventDefault();
    try {
      await import('../services/api').then(m => m.default.put('/auth/change-password', pwForm));
      flashPw('success', 'Đổi mật khẩu thành công!');
      setPwForm({ currentPassword:'', newPassword:'' });
    } catch (err) { flashPw('error', err.response?.data?.message || 'Mật khẩu hiện tại không đúng.'); }
  };

  return (
    <StudentLayout title="Hồ sơ cá nhân" subtitle="Quản lý thông tin và cài đặt tài khoản">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Info card */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg text-surface-900 dark:text-white mb-4">Thông tin cơ bản</h2>
          <Alert type={msg.type} message={msg.text} />
          <form onSubmit={handleSave} className="space-y-4 mt-3">
            {[
              { label:'Họ và tên', key:'fullName', type:'text' },
              { label:'Email',     key:'email',    type:'email' },
              { label:'Số điện thoại', key:'phone', type:'text' },
              { label:'Mã sinh viên',  key:'studentId', type:'text' },
            ].map(f => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <input type={f.type} className="input"
                  value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm text-surface-500">Role: <strong>{authUser?.role}</strong></span>
              <span className="text-surface-300">|</span>
              <span className="text-sm text-surface-500">Username: <strong>{authUser?.username}</strong></span>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary disabled:opacity-60">
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg text-surface-900 dark:text-white mb-4">Đổi mật khẩu</h2>
          <Alert type={pwMsg.type} message={pwMsg.text} />
          <form onSubmit={handleChangePw} className="space-y-4 mt-3">
            <div>
              <label className="label">Mật khẩu hiện tại</label>
              <input type="password" className="input" value={pwForm.currentPassword}
                onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
            </div>
            <div>
              <label className="label">Mật khẩu mới</label>
              <input type="password" className="input" value={pwForm.newPassword}
                onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary">Đổi mật khẩu</button>
          </form>
        </div>
      </div>
    </StudentLayout>
  );
}