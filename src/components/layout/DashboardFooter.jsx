
import React from 'react';
import { Home, LogOut, Settings, User, HelpCircle, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const DashboardFooter = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="shadow-sm border-t mt-auto" style={{backgroundColor: 'var(--light-text)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* University Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--primary-color)'}}>
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <h3 className="font-semibold text-lg" style={{color: 'var(--primary-color)'}}>University Portal</h3>
            </div>
            <p className="text-sm" style={{color: 'var(--text-color)'}}>
              Empowering students and educators with comprehensive academic management solutions.
            </p>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-xs" style={{color: 'var(--text-color)'}}>
                <MapPin className="w-3 h-3" />
                <span>University Campus</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold" style={{color: 'var(--primary-color)'}}>Quick Links</h4>
            <nav className="space-y-2">
              <a
                href="/"
                className="flex items-center gap-2 text-sm hover:scale-105 transition-all"
                style={{color: 'var(--text-color)'}}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
              >
                <Home className="w-4 h-4" />
                Home
              </a>
              <a
                href="/dashboard"
                className="flex items-center gap-2 text-sm hover:scale-105 transition-all"
                style={{color: 'var(--text-color)'}}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
              >
                <User className="w-4 h-4" />
                Dashboard
              </a>
              <a
                href="/profile"
                className="flex items-center gap-2 text-sm hover:scale-105 transition-all"
                style={{color: 'var(--text-color)'}}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
              >
                <Settings className="w-4 h-4" />
                Profile
              </a>
            </nav>
          </div>

          {/* Admin Links */}
          {user?.role === 'admin' && (
            <div className="space-y-4">
              <h4 className="font-semibold" style={{color: 'var(--primary-color)'}}>Admin Panel</h4>
              <nav className="space-y-2">
                <a
                  href="/admin/statistics"
                  className="block text-sm hover:scale-105 transition-all"
                  style={{color: 'var(--text-color)'}}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
                >
                  Statistics
                </a>
                <a
                  href="/admin/students"
                  className="block text-sm hover:scale-105 transition-all"
                  style={{color: 'var(--text-color)'}}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
                >
                  Manage Students
                </a>
                <a
                  href="/admin/tutors"
                  className="block text-sm hover:scale-105 transition-all"
                  style={{color: 'var(--text-color)'}}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
                >
                  Manage Tutors
                </a>
                <a
                  href="/admin/content"
                  className="block text-sm hover:scale-105 transition-all"
                  style={{color: 'var(--text-color)'}}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
                >
                  Content Management
                </a>
              </nav>
            </div>
          )}

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="font-semibold" style={{color: 'var(--primary-color)'}}>Support</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm" style={{color: 'var(--text-color)'}}>
                <Mail className="w-4 h-4" />
                <span>support@university.edu</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{color: 'var(--text-color)'}}>
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <a
                href="/help"
                className="flex items-center gap-2 text-sm hover:scale-105 transition-all"
                style={{color: 'var(--text-color)'}}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
              >
                <HelpCircle className="w-4 h-4" />
                Help Center
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm" style={{color: 'var(--text-color)'}}>
              © {currentYear} University Portal. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs">
              <a
                href="/privacy"
                className="hover:scale-105 transition-all"
                style={{color: 'var(--text-color)'}}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:scale-105 transition-all"
                style={{color: 'var(--text-color)'}}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
              >
                Terms of Service
              </a>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-sm" style={{color: 'var(--text-color)'}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{backgroundColor: 'var(--primary-color)'}}>
                  {user.first_name?.charAt(0) || 'U'}
                </div>
                <span>{user.first_name} {user.last_name}</span>
                <span className="px-2 py-1 text-xs rounded" style={{
                  backgroundColor: 'var(--tertiary-color)',
                  color: 'var(--primary-color)'
                }}>
                  {user.role}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:scale-105 transition-all hover-glow"
              style={{backgroundColor: 'var(--error-color)', color: 'var(--light-text)'}}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
