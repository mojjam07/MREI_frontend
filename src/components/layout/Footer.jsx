


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

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
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {t('home.footerConnectTitle')}
            </h3>
            <div className="contact-info space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-sm sm:text-base text-accent">
              <p>{t('home.footerAddress')}</p>
              <p>{t('home.footerPhone')}</p>
              <p className="break-all">{t('home.footerEmail')}</p>
            </div>
            <div className="social-links flex flex-wrap gap-2 sm:gap-3">
              <a href="#" className="social-icon w-8 h-8 sm:w-9 sm:h-9 bg-tertiary rounded-full flex items-center justify-center text-text hover:text-accent hover:bg-link transition-colors text-xs sm:text-sm font-medium" aria-label={t('home.footerFacebook')}>f</a>
              <a href="#" className="social-icon w-8 h-8 sm:w-9 sm:h-9 bg-tertiary rounded-full flex items-center justify-center text-text hover:text-accent hover:bg-link transition-colors text-xs sm:text-sm font-medium" aria-label={t('home.footerTwitter')}>t</a>
              <a href="#" className="social-icon w-8 h-8 sm:w-9 sm:h-9 bg-tertiary rounded-full flex items-center justify-center text-text hover:text-accent hover:bg-link transition-colors text-xs sm:text-sm font-medium" aria-label={t('home.footerInstagram')}>i</a>
              <a href="#" className="social-icon w-8 h-8 sm:w-9 sm:h-9 bg-tertiary rounded-full flex items-center justify-center text-text hover:text-accent hover:bg-link transition-colors text-xs sm:text-sm font-medium" aria-label={t('home.footerLinkedIn')}>in</a>
              <a href="#" className="social-icon w-8 h-8 sm:w-9 sm:h-9 bg-tertiary rounded-full flex items-center justify-center text-text hover:text-accent hover:bg-link transition-colors text-xs sm:text-sm font-medium" aria-label={t('home.footerYouTube')}>y</a>
            </div>
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