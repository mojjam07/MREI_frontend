
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, Globe, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../i18n/translations';
import MainNav from '../layout/MainNav';
import SearchDropdown from '../ui/SearchDropdown';
import logo from '../../assets/logo.png';


const UniversityHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const audienceLinks = [
    t.header.currentStudents,
    t.header.adminStaff,
    t.header.alumni,
    t.header.partnersSponsors
  ];

  return (

    <header className="sticky top-0 z-50 bg-primary border-b border-accent" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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


            {/* Search and actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Desktop Search */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="flex items-center gap-2 px-3 py-1 border border-accent rounded-md hover:bg-accent hover:text-text transition-colors text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-tertiary">{t.header.searchPlaceholderShort}</span>
                </button>
                <SearchDropdown
                  isOpen={isSearchOpen}
                  onClose={() => setIsSearchOpen(false)}
                  placeholder={t.header.searchPlaceholder}
                  className="top-full left-0 w-80"
                  onSearchResultClick={(result) => {
                    console.log('Search result clicked:', result);
                    setIsSearchOpen(false);
                  }}
                />
              </div>

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
              <h1 className="text-lg sm:text-2md md:text-3xl font-bold text-tertiary">{t.header.universityName}</h1>
            </div>


            {/* Mobile actions */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-tertiary hover:text-light-text"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

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


          {/* Mobile Search Dropdown */}
          {isSearchOpen && (
            <div className="md:hidden mt-4 pb-4">
              <SearchDropdown
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                placeholder={t.header.searchPlaceholder}
                className="w-full"
                onSearchResultClick={(result) => {
                  console.log('Search result clicked:', result);
                  setIsSearchOpen(false);
                }}
              />
            </div>
          )}

          {/* Mobile menu */}
          {isMobileMenuOpen && !isSearchOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-accent pt-4 animate-fade-in-up">
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