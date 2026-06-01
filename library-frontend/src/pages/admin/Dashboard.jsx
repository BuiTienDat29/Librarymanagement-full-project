import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/Layout';
import { StatCard, QuickActionCard, ActivityItem, MiniChart } from '../../components/StatCard';
import { LoadingSpinner } from '../../components';
import { reportService } from '../../services';

// Icons as components
const Icons = {
  Books: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Copies: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Available: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Borrow: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Overdue: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Fines: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Reservation: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ),
  Process: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  Warning: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Chart: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.summary()
      .then(r => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  // Mock data for charts
  const borrowChartData = [12, 19, 15, 25, 22, 30, 28, 35, 40, 38, 45, 50];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <AdminLayout title="Tổng quan">
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`${getGreeting()}, Admin 👋`}
      subtitle="Here's what's happening with your library today"
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Icons.Books}
            label="Đầu sách"
            value={stats?.totalBooks?.toLocaleString('vi') || '0'}
            trend="+12%"
            trendUp={true}
            color="blue"
          />
          <StatCard
            icon={Icons.Copies}
            label="Tổng bản sao"
            value={stats?.totalCopies?.toLocaleString('vi') || '0'}
            trend="+5%"
            trendUp={true}
            color="purple"
          />
          <StatCard
            icon={Icons.Available}
            label="Có thể mượn"
            value={stats?.availableCopies?.toLocaleString('vi') || '0'}
            trend="-3%"
            trendUp={false}
            color="green"
          />
          <StatCard
            icon={Icons.Users}
            label="Người dùng"
            value={stats?.totalUsers?.toLocaleString('vi') || '0'}
            trend="+8%"
            trendUp={true}
            color="cyan"
          />
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Icons.Borrow}
            label="Đang mượn"
            value={stats?.activeBorrows?.toLocaleString('vi') || '0'}
            color="blue"
          />
          <StatCard
            icon={Icons.Overdue}
            label="Quá hạn"
            value={stats?.overdueCount?.toLocaleString('vi') || '0'}
            color="red"
          />
          <StatCard
            icon={Icons.Fines}
            label="Tiền phạt tồn"
            value={stats ? `${Number(stats.totalPendingFines).toLocaleString('vi')}đ` : '0đ'}
            color="yellow"
          />
          <StatCard
            icon={Icons.Reservation}
            label="Đặt trước"
            value={stats?.totalReservations?.toLocaleString('vi') || '0'}
            color="purple"
          />
        </div>

        {/* Chart and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-surface-900 dark:text-white">Thống kê mượn sách</h3>
                <p className="text-sm text-surface-500">30 ngày qua</p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-secondary">Tuần</button>
                <button className="btn btn-sm btn-ghost">Tháng</button>
                <button className="btn btn-sm btn-ghost">Năm</button>
              </div>
            </div>
            <MiniChart data={borrowChartData} color="blue" />
            <div className="flex justify-between mt-2 text-xs text-surface-400">
              <span>T2</span><span>T4</span><span>T6</span><span>CN</span><span>T3</span><span>T5</span><span>T7</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <QuickActionCard
              icon={Icons.Process}
              label="Xử lý mượn/trả"
              description="Duyệt phiếu mượn, xác nhận trả sách"
              to="/admin/borrows"
              color="blue"
            />
            <QuickActionCard
              icon={Icons.Warning}
              label="Xử lý quá hạn"
              description="Quản lý sách trả trễ, tính phạt"
              to="/admin/overdue"
              color="red"
            />
            <QuickActionCard
              icon={Icons.Books}
              label="Quản lý sách"
              description="Thêm, sửa, xóa đầu sách và bản sao"
              to="/admin/books"
              color="green"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-surface-900 dark:text-white">Mượn gần đây</h3>
              <Link to="/admin/borrows" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Xem tất cả →
              </Link>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-700">
              <ActivityItem
                icon={Icons.Books}
                title="Clean Code - Robert C. Martin"
                subtitle="Nguyễn Văn A"
                time="5 phút trước"
                statusColor="green"
              />
              <ActivityItem
                icon={Icons.Books}
                title="Design Patterns - Gang of 4"
                subtitle="Trần Thị B"
                time="15 phút trước"
                statusColor="blue"
              />
              <ActivityItem
                icon={Icons.Books}
                title="Clean Architecture"
                subtitle="Lê Văn C"
                time="30 phút trước"
                statusColor="blue"
              />
              <ActivityItem
                icon={Icons.Books}
                title="The Pragmatic Programmer"
                subtitle="Phạm Thị D"
                time="1 giờ trước"
                statusColor="blue"
              />
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-surface-900 dark:text-white">Quá hạn gần đây</h3>
              <Link to="/admin/overdue" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Xem tất cả →
              </Link>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-700">
              <ActivityItem
                icon={Icons.Overdue}
                title="Design Patterns - Gang of 4"
                subtitle="Nguyễn Thị E - Quá hạn 3 ngày"
                time="2 giờ trước"
                statusColor="red"
              />
              <ActivityItem
                icon={Icons.Overdue}
                title="Refactoring - Martin Fowler"
                subtitle="Trần Văn F - Quá hạn 2 ngày"
                time="5 giờ trước"
                statusColor="red"
              />
              <ActivityItem
                icon={Icons.Overdue}
                title="Clean Code"
                subtitle="Lê Thị G - Quá hạn 1 ngày"
                time="1 ngày trước"
                statusColor="yellow"
              />
              <ActivityItem
                icon={Icons.Overdue}
                title="Head First Design Patterns"
                subtitle="Nguyễn Văn H - Quá hạn 1 ngày"
                time="1 ngày trước"
                statusColor="yellow"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}