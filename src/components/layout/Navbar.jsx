import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, GraduationCap, Globe, ChevronDown, Bell, LogOut } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const isRTL = language === 'ar';

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
                <Link to="/dashboard" className="text-text hover:text-link transition-colors">{t('nav.dashboard')}</Link>
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
                <Bell className="w-5 h-5 text-text cursor-pointer hover:text-link" />
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-text hover:text-link transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('nav.logout')}</span>
                </button>
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
              <Link to="/" className="text-text hover:text-link">{t('nav.home')}</Link>
              {user && (
                <Link to="/dashboard" className="text-text hover:text-link">{t('nav.dashboard')}</Link>
              )}
              <Link to="/alumni" className="text-text hover:text-link">{t('nav.alumni')}</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
