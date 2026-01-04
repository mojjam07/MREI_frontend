import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

// Helper function to generate placeholder SVG data URL
const generatePlaceholderUrl = (width, height, bgColor, text) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            fill="#FFFFFF" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
        ${encodeURIComponent(text)}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const Footer = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  // Advert images state - using inline SVG placeholders
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const advertImages = [
    generatePlaceholderUrl(300, 200, '#FF6B6B', 'Advert 1'),
    generatePlaceholderUrl(300, 200, '#4ECDC4', 'Advert 2'),
    generatePlaceholderUrl(300, 200, '#45B7D1', 'Advert 3'),
    generatePlaceholderUrl(300, 200, '#96CEB4', 'Advert 4'),
    generatePlaceholderUrl(300, 200, '#FECA57', 'Advert 5')
  ];

  // Rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % advertImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [advertImages.length]);

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
    <footer className="bg-primary text-light-text py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="footer-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="footer-column">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {t('home.footerAboutTitle')}
            </h3>


            <ul className="footer-links space-y-1.5 sm:space-y-2">
              <li><button onClick={() => handleNavClick('/about')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerMissionVision')}</button></li>
              <li><button onClick={() => handleNavClick('/about')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerHistory')}</button></li>
              <li><button onClick={() => handleNavClick('/about')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerLeadership')}</button></li>
              <li><button onClick={() => handleNavClick('/about')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerAccreditation')}</button></li>
              <li><button onClick={() => handleNavClick('/about')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerEmployment')}</button></li>
              <li><button onClick={() => handleNavClick('/about')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerCampusMap')}</button></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {t('home.footerAcademicsTitle')}
            </h3>


            <ul className="footer-links space-y-1.5 sm:space-y-2">
              <li><button onClick={() => handleNavClick('/academics')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerCollegesSchools')}</button></li>
              <li><button onClick={() => handleNavClick('/academics')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerUndergraduatePrograms')}</button></li>
              <li><button onClick={() => handleNavClick('/academics')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerGraduatePrograms')}</button></li>
              <li><button onClick={() => handleNavClick('/academics')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerOnlineLearning')}</button></li>
              <li><button onClick={() => handleNavClick('/academics')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerAcademicCalendar')}</button></li>
              <li><button onClick={() => handleNavClick('/academics')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerLibrary')}</button></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {t('home.footerAdmissionsTitle')}
            </h3>


            <ul className="footer-links space-y-1.5 sm:space-y-2">
              <li><button onClick={() => handleNavClick('/admissions')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerUndergraduateAdmission')}</button></li>
              <li><button onClick={() => handleNavClick('/admissions')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerGraduateAdmission')}</button></li>
              <li><button onClick={() => handleNavClick('/admissions')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerFinancialAid')}</button></li>
              <li><button onClick={() => handleNavClick('/admissions')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerScholarships')}</button></li>
              <li><button onClick={() => handleNavClick('/admissions')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerVisitCampus')}</button></li>
              <li><button onClick={() => handleNavClick('/admissions')} className="text-accent hover:text-light-text transition-colors text-sm sm:text-base text-left">{t('home.footerApplyNow')}</button></li>
            </ul>
          </div>

          <div className="footer-column">
            <img
              src={advertImages[currentImageIndex]}
              alt="Advertisement"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="bottom-footer border-t border-accent pt-6 sm:pt-8 mt-6 sm:mt-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-accent text-xs sm:text-sm">
            {t('home.footerCopyright').replace('{year}', currentYear)}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3 gap-y-1 text-accent mt-2 text-xs sm:text-sm">
            <button onClick={() => handleNavClick('/')} className="hover:text-light-text transition-colors hover-lift text-left">{t('home.footerPrivacy')}</button>
            <span className="hidden sm:inline">|</span>
            <button onClick={() => handleNavClick('/')} className="hover:text-light-text transition-colors hover-lift text-left">{t('home.footerTerms')}</button>
            <span className="hidden sm:inline">|</span>
            <button onClick={() => handleNavClick('/')} className="hover:text-light-text transition-colors hover-lift text-left">{t('home.footerAccessibility')}</button>
            <span className="hidden sm:inline">|</span>
            <button onClick={() => handleNavClick('/')} className="hover:text-light-text transition-colors hover-lift text-left">{t('home.footerConsumer')}</button>
            <span className="hidden sm:inline">|</span>
            <button onClick={() => handleNavClick('/')} className="hover:text-light-text transition-colors hover-lift text-left">{t('home.footerEmergency')}</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;