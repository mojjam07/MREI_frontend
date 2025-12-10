import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, Globe, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../i18n/translations';
import MainNav from '../layout/MainNav';
import logo from '../../assets/logo.png';

const UniversityHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const audienceLinks = [
    t.header.currentStudents,
    t.header.adminStaff,
    t.header.alumni,
    t.header.partnersSponsors
  ];

  return (
    <header className="bg-primary border-b border-accent" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top navigation for audience segments - Hidden on mobile */}
        <div className="hidden md:block py-2 border-b border-accent animate-fade-in-up">
          <nav className={`flex justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`} aria-label="Audience navigation">
            <ul className="flex flex-wrap gap-2 lg:gap-4 text-xs lg:text-sm">
              {audienceLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-tertiary hover:text-light-text transition-colors hover-lift"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            {/* Search form and actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              <form className="hidden lg:flex items-center gap-2" role="search">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative">
                  <input
                    type="search"
                    id="search"
                    placeholder={t.header.searchPlaceholder}
                    className="w-32 lg:w-48 px-3 py-1 border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-tertiary hover:text-text"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Language toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-1 text-tertiary hover:text-light-text transition-colors"
                aria-label="Switch language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs lg:text-sm uppercase">{language}</span>
              </button>

              {/* Login link */}
              <Link
                to="/login"
                className="text-tertiary hover:text-light-text transition-colors text-xs lg:text-sm font-medium"
              >
                {t.header.login}
              </Link>
            </div>
          </nav>
        </div>

        <div className="py-3 sm:py-4">
          {/* Logo and name */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <img
                src={logo}
                alt={t.header.logoAlt}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
              />
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-tertiary">{t.header.universityName}</h1>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Language toggle mobile */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-1 text-tertiary hover:text-light-text transition-colors p-2"
                aria-label="Switch language"
              >
                <Globe className="w-5 h-5" />
              </button>

              {/* Mobile menu button */}
              <button
                className="p-2 text-tertiary hover:text-light-text"
                aria-label="Toggle menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block pt-4">
            <MainNav className="bg-link-hover hover:text-text py-3 px-6 rounded-md shadow-md justify-center" />
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-accent pt-4 animate-fade-in-up">
              {/* Mobile search */}
              <form className="mb-4" role="search">
                <label htmlFor="mobile-search" className="sr-only">Search</label>
                <div className="relative">
                  <input
                    type="search"
                    id="mobile-search"
                    placeholder={t.header.searchPlaceholder}
                    className="w-full px-3 py-2 border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tertiary hover:text-text"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Mobile audience links */}
              <nav className="mb-4">
                <ul className="space-y-2">
                  {audienceLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="block py-2 text-tertiary hover:text-light-text transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile main nav */}
              <MainNav className="flex-col items-start space-y-2" />

              {/* Mobile login */}
              <Link
                to="/login"
                className="block mt-4 py-2 text-tertiary hover:text-light-text transition-colors text-sm font-medium"
              >
                {t.header.login}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UniversityHeader;