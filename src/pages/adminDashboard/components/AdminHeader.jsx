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
      className="shadow-lg"
      style={{ 
        background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        borderBottom: '3px solid #e94560'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {React.createElement(LayoutDashboard, {
              className: 'w-8 h-8',
              style: { color: '#e94560' },
            })}
            <h1
              className="text-2xl font-bold"
              style={{ 
                color: '#ffffff',
                textShadow: '0 2px 10px rgba(233, 69, 96, 0.3)'
              }}
            >
              {dashboardTitle}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcherComponent />
            <button
              className="p-2 rounded-lg transition-all duration-300 hover:scale-105"
              style={{ 
                color: '#e94560',
                border: '1px solid transparent',
                boxShadow: '0 0 0 transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#e94560';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(233, 69, 96, 0.5), 0 0 40px rgba(233, 69, 96, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = '0 0 0 transparent';
              }}
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
