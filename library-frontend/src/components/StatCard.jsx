import React from 'react';

// Modern Stat Card Component
export function StatCard({ icon: Icon, label, value, trend, trendUp, color = 'blue' }) {
  const colorClasses = {
    blue: {
      bg: 'bg-primary-100 dark:bg-primary-900/40',
      text: 'text-primary-600 dark:text-primary-400',
      trend: trendUp ? 'text-success' : 'text-error',
      icon: 'bg-primary-500',
    },
    green: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      trend: trendUp ? 'text-success' : 'text-error',
      icon: 'bg-emerald-500',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/40',
      text: 'text-red-600 dark:text-red-400',
      trend: trendUp ? 'text-success' : 'text-error',
      icon: 'bg-red-500',
    },
    yellow: {
      bg: 'bg-amber-100 dark:bg-amber-900/40',
      text: 'text-amber-600 dark:text-amber-400',
      trend: trendUp ? 'text-success' : 'text-error',
      icon: 'bg-amber-500',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/40',
      text: 'text-purple-600 dark:text-purple-400',
      trend: trendUp ? 'text-success' : 'text-error',
      icon: 'bg-purple-500',
    },
    cyan: {
      bg: 'bg-cyan-100 dark:bg-cyan-900/40',
      text: 'text-cyan-600 dark:text-cyan-400',
      trend: trendUp ? 'text-success' : 'text-error',
      icon: 'bg-cyan-500',
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="card p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text}`}>
          <Icon />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-medium ${colors.trend}`}>
            {trendUp ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{label}</p>
        <p className="text-2xl font-display font-bold text-surface-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );
}

// Quick Action Card
export function QuickActionCard({ icon: Icon, label, description, to, color = 'blue' }) {
  const colorClasses = {
    blue: 'hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/10',
    green: 'hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/10',
    purple: 'hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/10',
  };

  return (
    <a
      href={to}
      className={`card p-5 block border-l-4 border-transparent ${colorClasses[color] || colorClasses.blue} transition-all duration-200`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          color === 'blue' ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400' :
          color === 'green' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' :
          'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
        }`}>
          <Icon />
        </div>
        <div>
          <h3 className="font-semibold text-surface-900 dark:text-white">{label}</h3>
          <p className="text-sm text-surface-500 mt-1">{description}</p>
        </div>
      </div>
    </a>
  );
}

// Activity Item
export function ActivityItem({ icon: Icon, title, subtitle, time, status, statusColor = 'blue' }) {
  const statusColors = {
    blue: 'bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400',
    green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
    yellow: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  };

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        statusColors[statusColor] || statusColors.blue
      }`}>
        <Icon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{title}</p>
        <p className="text-xs text-surface-500 truncate">{subtitle}</p>
      </div>
      <span className="text-xs text-surface-400 whitespace-nowrap">{time}</span>
    </div>
  );
}

// Mini Chart Placeholder (can be replaced with real chart library)
export function MiniChart({ data = [], color = 'blue' }) {
  const maxValue = Math.max(...data, 1);
  const height = 60;

  const colorStyles = {
    blue: 'bg-primary-500',
    green: 'bg-emerald-500',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500',
  };

  return (
    <div className="flex items-end gap-1 h-[60px]">
      {data.map((value, index) => (
        <div
          key={index}
          className={`flex-1 ${colorStyles[color] || colorStyles.blue} rounded-t transition-all duration-300 hover:opacity-80`}
          style={{ height: `${(value / maxValue) * height}px` }}
        />
      ))}
    </div>
  );
}

export default StatCard;