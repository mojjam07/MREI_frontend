import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef(null);

  // Safely get the dashboard section title from translations
  const dashboardTitle = safeString(t?.('admin.dashboard'), 'Admin Dashboard');

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className="shadow-lg sticky top-0 z-50"
      style={{ 
        background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        borderBottom: '3px solid #e94560'
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title - Left side */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {React.createElement(LayoutDashboard, {
              className: 'w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0',
              style: { color: '#e94560' },
            })}
            <h1
              className="text-lg sm:text-2xl font-bold truncate"
              style={{ 
                color: '#ffffff',
                textShadow: '0 2px 10px rgba(233, 69, 96, 0.3)'
              }}
            >
              <span className="hidden xs:inline">{dashboardTitle}</span>
              <span className="xs:hidden text-sm">{safeString(t?.('admin.shortTitle'), 'Admin')}</span>
            </h1>
          </div>

          {/* Desktop Actions - Right side */}
          <div className={`flex items-center gap-2 sm:gap-3 ${isMobile ? 'hidden' : 'flex'}`}>
            <div className="hidden sm:block">
              <LanguageSwitcherComponent />
            </div>
            <button
              className="p-2 rounded-lg transition-all duration-300 hover:scale-105 hidden sm:block"
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
              aria-label={safeString(t?.('admin.settings'), 'Settings')}
            >
              {React.createElement(Settings, { className: 'w-5 h-5' })}
            </button>
          </div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg transition-all duration-300 hover:scale-105 flex-shrink-0"
              style={{ 
                color: '#e94560',
                border: '1px solid transparent'
              }}
              aria-label={isMobileMenuOpen ? safeString(t?.('admin.closeMenu'), 'Close menu') : safeString(t?.('admin.openMenu'), 'Open menu')}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobile && isMobileMenuOpen && (
          <div 
            ref={menuRef}
            className="mt-3 sm:mt-4 pb-2 border-t border-white/10 pt-3 animate-fade-in-up"
          >
            <div className="flex flex-col gap-2">
              {/* Language Switcher for Mobile */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-sm text-gray-300">{safeString(t?.('admin.language'), 'Language')}</span>
                <div className="flex-shrink-0">
                  <LanguageSwitcherComponent />
                </div>
              </div>

              {/* Settings Button for Mobile */}
              <button
                className="flex items-center justify-between p-2 rounded-lg transition-all duration-300 hover:bg-white/10"
                style={{
                  color: '#e94560',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#e94560';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(233, 69, 96, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = '0 0 0 transparent';
                }}
                aria-label={safeString(t?.('admin.settings'), 'Settings')}
              >
                <span className="text-sm text-gray-300">{safeString(t?.('admin.settings'), 'Settings')}</span>
                {React.createElement(Settings, { className: 'w-5 h-5' })}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Arrow */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="absolute right-4 -bottom-2 w-4 h-4 rotate-45"
          style={{ 
            backgroundColor: '#0f3460',
            borderRight: '1px solid #e94560',
            borderBottom: '1px solid #e94560'
          }}
        />
      )}
    </header>
  );
};

export default AdminHeader;
