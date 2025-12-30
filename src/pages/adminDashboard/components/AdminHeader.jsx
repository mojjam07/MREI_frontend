import React from 'react';

// Helper function to safely extract string values from translation objects
const safeString = (value, fallback = '') => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') {
    // If it's an object (nested translation), try to get a string property
    return value.overview || value.stats || value.title || fallback;
  }
  return fallback;
};

const AdminHeader = ({ t, LanguageSwitcher, Settings, LayoutDashboard }) => {
  const LanguageSwitcherComponent = LanguageSwitcher;

  // Safely get the dashboard section title from translations
  // Ensure it always returns a string, not an object
  const dashboardTitle = safeString(t?.('admin.dashboardSection'), 'Dashboard');

  return (
    <header
      className="shadow-sm border-b"
      style={{ backgroundColor: 'var(--primary-color)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {React.createElement(LayoutDashboard, {
              className: 'w-8 h-8',
              style: { color: 'var(--tertiary-color)' },
            })}
            <h1
              className="text-2xl font-bold"
              style={{ color: 'var(--light-text)' }}
            >
              {dashboardTitle}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcherComponent />
            <button
              className="p-2 rounded-lg transition-all hover:scale-105 hover-glow"
              style={{ color: 'var(--tertiary-color)' }}
            >
              {React.createElement(Settings, { className: 'w-5 h-5' })}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
