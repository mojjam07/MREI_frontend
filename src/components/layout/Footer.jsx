import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-primary text-light-text py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="footer-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="footer-column">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {t('home.footerAboutTitle')}
            </h3>
            <ul className="footer-links space-y-1.5 sm:space-y-2">
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerMissionVision')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerHistory')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerLeadership')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerAccreditation')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerEmployment')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerCampusMap')}</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {t('home.footerAcademicsTitle')}
            </h3>
            <ul className="footer-links space-y-1.5 sm:space-y-2">
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerCollegesSchools')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerUndergraduatePrograms')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerGraduatePrograms')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerOnlineLearning')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerAcademicCalendar')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerLibrary')}</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {t('home.footerAdmissionsTitle')}
            </h3>
            <ul className="footer-links space-y-1.5 sm:space-y-2">
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerUndergraduateAdmission')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerGraduateAdmission')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerFinancialAid')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerScholarships')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerVisitCampus')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors text-sm sm:text-base">{t('home.footerApplyNow')}</a></li>
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
            {t('home.footerCopyright')}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3 gap-y-1 text-accent mt-2 text-xs sm:text-sm">
            <a href="#" className="hover:text-light-text transition-colors hover-lift">{t('home.footerPrivacy')}</a>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:text-light-text transition-colors hover-lift">{t('home.footerTerms')}</a>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:text-light-text transition-colors hover-lift">{t('home.footerAccessibility')}</a>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:text-light-text transition-colors hover-lift">{t('home.footerConsumer')}</a>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:text-light-text transition-colors hover-lift">{t('home.footerEmergency')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;