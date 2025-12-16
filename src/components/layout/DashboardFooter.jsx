
import React from 'react';
import { Home, LogOut, Settings, User, HelpCircle, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const DashboardFooter = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {

    if (window.confirm(t('dashboardFooter.confirm.logout') || 'Are you sure you want to logout?')) {
      try {
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };


  const currentYear = new Date().getFullYear();

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle navigation with scroll to top
  const handleNavClick = (path) => {
    navigate(path);
    scrollToTop();
  };

  return (
    <footer className="shadow-sm border-t mt-auto animate-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* University Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--primary-color)'}}>
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <h3 className="font-semibold text-lg" style={{color: 'var(--light-text)'}}>{t('dashboardFooter.university.name')}</h3>
            </div>
            <p className="text-sm" style={{color: 'var(--light-text)'}}>
              {t('dashboardFooter.university.description')}</p>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-xs" style={{color: 'var(--light-text)'}}>
                <MapPin className="w-3 h-3" />
                <span>{t('dashboardFooter.university.campus')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold" style={{color: 'var(--light-text)'}}>{t('dashboardFooter.quickLinks.title')}</h4>

            <nav className="space-y-2">
              <button
                onClick={() => handleNavClick('/')}
                className="flex items-center gap-2 text-sm hover:scale-105 transition-all w-full text-left"
                style={{color: 'var(--light-text)'}}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--light-text)'}
              >
                <Home className="w-4 h-4" />
                {t('dashboardFooter.quickLinks.home')}
              </button>
              <button
                onClick={() => handleNavClick('/dashboard')}
                className="flex items-center gap-2 text-sm hover:scale-105 transition-all w-full text-left"
                style={{color: 'var(--light-text)'}}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--light-text)'}
              >
                <User className="w-4 h-4" />
                {t('dashboardFooter.quickLinks.dashboard')}
              </button>
              <button
                onClick={() => handleNavClick('/profile')}
                className="flex items-center gap-2 text-sm hover:scale-105 transition-all w-full text-left"
                style={{color: 'var(--light-text)'}}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--light-text)'}
              >
                <Settings className="w-4 h-4" />
                {t('dashboardFooter.quickLinks.profile')}
              </button>
            </nav>
          </div>

          {/* Admin Links */}
          {user?.role === 'admin' && (
            <div className="space-y-4">
              <h4 className="font-semibold" style={{color: 'var(--light-text)'}}>{t('dashboardFooter.admin.title')}</h4>

              <nav className="space-y-2">
                <button
                  onClick={() => handleNavClick('/admin/statistics')}
                  className="block text-sm hover:scale-105 transition-all w-full text-left"
                  style={{color: 'var(--light-text)'}}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--light-text)'}
                >
                  {t('dashboardFooter.admin.statistics')}
                </button>
                <button
                  onClick={() => handleNavClick('/admin/students')}
                  className="block text-sm hover:scale-105 transition-all w-full text-left"
                  style={{color: 'var(--light-text)'}}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--light-text)'}
                >
                  {t('dashboardFooter.admin.manageStudents')}
                </button>
                <button
                  onClick={() => handleNavClick('/admin/tutors')}
                  className="block text-sm hover:scale-105 transition-all w-full text-left"
                  style={{color: 'var(--light-text)'}}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--light-text)'}
                >
                  {t('dashboardFooter.admin.manageTutors')}
                </button>
                <button
                  onClick={() => handleNavClick('/admin/content')}
                  className="block text-sm hover:scale-105 transition-all w-full text-left"
                  style={{color: 'var(--light-text)'}}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--light-text)'}
                >
                  {t('dashboardFooter.admin.contentManagement')}
                </button>
              </nav>
            </div>
          )}

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="font-semibold" style={{color: 'var(--light-text)'}}>{t('dashboardFooter.support.title')}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm" style={{color: 'var(--light-text)'}}>
                <Mail className="w-4 h-4" />
                <span>{t('dashboardFooter.support.email')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{color: 'var(--light-text)'}}>
                <Phone className="w-4 h-4" />
                <span>{t('dashboardFooter.support.phone')}</span>
              </div>

              <button
                onClick={() => handleNavClick('/help')}
                className="flex items-center gap-2 text-sm hover:scale-105 transition-all w-full text-left"
                style={{color: 'var(--light-text)'}}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--light-text)'}
              >
                <HelpCircle className="w-4 h-4" />
                {t('dashboardFooter.support.helpCenter')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm" style={{color: 'var(--light-text)'}}>
              {t('dashboardFooter.copyright').replace('{year}', currentYear)}
            </p>

            <div className="flex gap-4 text-xs">
              <button
                onClick={() => handleNavClick('/privacy')}
                className="hover:scale-105 transition-all text-left"
                style={{color: 'var(--light-text)'}}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--light-text)'}
              >
                {t('dashboardFooter.legal.privacyPolicy')}
              </button>
              <button
                onClick={() => handleNavClick('/terms')}
                className="hover:scale-105 transition-all text-left"
                style={{color: 'var(--light-text)'}}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--light-text)'}
              >
                {t('dashboardFooter.legal.termsOfService')}
              </button>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-sm" style={{color: 'var(--light-text)'}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{backgroundColor: 'var(--primary-color)'}}>
                  {user.first_name?.charAt(0) || 'U'}
                </div>
                <span>{t('dashboardFooter.user.welcome')}, {user.first_name} {user.last_name}</span>
                <span className="px-2 py-1 text-xs rounded" style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'var(--light-text)'
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
              <span className="text-sm">{t('dashboardFooter.user.logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
