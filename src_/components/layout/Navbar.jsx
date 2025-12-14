
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, GraduationCap, Globe, ChevronDown, Bell, LogOut, User, Settings, BarChart3 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import NotificationCenter from '../notifications/NotificationCenter';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'tutor': return '/tutor/dashboard';
      case 'student': return '/student/dashboard';
      case 'alumni': return '/alumni/dashboard';
      default: return '/dashboard';
    }
  };

  // Get role display name
  const getRoleDisplayName = () => {
    if (!user) return '';
    switch (user.role) {
      case 'admin': return 'Administrator';
      case 'tutor': return 'Tutor';
      case 'student': return 'Student';
      case 'alumni': return 'Alumni';
      default: return user.role;
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-link" />
              <span className="text-xl font-bold text-text">EduPlatform</span>
            </Link>


            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-text hover:text-link transition-colors">{t('nav.home')}</Link>
              {user && (
                <Link to={getDashboardUrl()} className="text-text hover:text-link transition-colors">{t('nav.dashboard')}</Link>
              )}
              <Link to="/alumni" className="text-text hover:text-link transition-colors">{t('nav.alumni')}</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 text-text hover:text-link transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline">{language === 'en' ? 'English' : 'العربية'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <button
                    onClick={() => { setLanguage('en'); setLangOpen(false); }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-text"
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setLanguage('ar'); setLangOpen(false); }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-text"
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>


            {user ? (
              <div className="flex items-center gap-4">
                {/* Notification Center */}
                <NotificationCenter />
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name || user.username}
                      </div>
                      <div className="text-xs text-gray-500">{getRoleDisplayName()}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <>
                      {/* Overlay */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setUserMenuOpen(false)}
                      />
                      
                      {/* User Menu Dropdown */}
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : user.username
                            }
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-blue-600 font-medium">{getRoleDisplayName()}</div>
                        </div>
                        
                        <div className="py-1">
                          <Link
                            to={getDashboardUrl()}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <BarChart3 className="w-4 h-4" />
                            Dashboard
                          </Link>
                          
                          {user.role === 'student' && (
                            <Link
                              to="/student/profile"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <User className="w-4 h-4" />
                              My Profile
                            </Link>
                          )}
                          
                          {user.role === 'tutor' && (
                            <Link
                              to="/tutor/profile"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Settings className="w-4 h-4" />
                              Profile Settings
                            </Link>
                          )}
                          
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              logout();
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4" />
                            {t('nav.logout')}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Button onClick={() => window.location.href = '/login'}>{t('nav.login')}</Button>
            )}

            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>


        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-text hover:text-link" onClick={() => setIsOpen(false)}>
                {t('nav.home')}
              </Link>
              {user && (
                <Link to={getDashboardUrl()} className="text-text hover:text-link" onClick={() => setIsOpen(false)}>
                  {t('nav.dashboard')}
                </Link>
              )}
              <Link to="/alumni" className="text-text hover:text-link" onClick={() => setIsOpen(false)}>
                {t('nav.alumni')}
              </Link>
              
              {/* Mobile User Info */}
              {user && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name || user.username}
                      </div>
                      <div className="text-xs text-gray-500">{getRoleDisplayName()}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link
                      to={getDashboardUrl()}
                      className="text-sm text-gray-700 hover:text-link"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="text-sm text-gray-700 hover:text-link"
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      className="text-sm text-red-700 hover:text-red-900 text-left"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
