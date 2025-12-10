import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, Globe } from 'lucide-react';
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
        {/* Top navigation for audience segments */}
        <div className="py-2 border-b border-accent animate-fade-in-up">
          <nav className={`flex justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`} aria-label="Audience navigation">
            <ul className="flex flex-wrap gap-4 text-sm">
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
            <div className="flex items-center gap-4">
              <form className="flex items-center gap-2" role="search">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative">
                  <input
                    type="search"
                    id="search"
                    placeholder={t.header.searchPlaceholder}
                    className="w-48 px-3 py-1 border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
                <span className="text-sm uppercase">{language}</span>
              </button>

              {/* Login link */}
              <Link
                to="/login"
                className="text-tertiary hover:text-light-text transition-colors text-sm font-medium"
              >
                {t.header.login}
              </Link>
            </div>
          </nav>
        </div>

        <div className="py-4">
          {/* Logo and name */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt={t.header.logoAlt}
                className="w-12 h-12"
              />
              <h1 className="text-3xl font-bold text-tertiary">{t.header.universityName}</h1>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-tertiary hover:text-light-text"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="pt-4">
            {/* MainNav */}
            <MainNav className="bg-link-hover hover:text-text py-3 px-6 rounded-md shadow-md justify-center" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default UniversityHeader;
