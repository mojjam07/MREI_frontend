import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-primary text-light-text py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="footer-grid grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="footer-column">
            <h3 className="text-lg font-semibold mb-4">{t('home.footerAboutTitle')}</h3>
            <ul className="footer-links space-y-2">
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerMissionVision')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerHistory')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerLeadership')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerAccreditation')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerEmployment')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerCampusMap')}</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="text-lg font-semibold mb-4">{t('home.footerAcademicsTitle')}</h3>
            <ul className="footer-links space-y-2">
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerCollegesSchools')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerUndergraduatePrograms')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerGraduatePrograms')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerOnlineLearning')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerAcademicCalendar')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerLibrary')}</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="text-lg font-semibold mb-4">{t('home.footerAdmissionsTitle')}</h3>
            <ul className="footer-links space-y-2">
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerUndergraduateAdmission')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerGraduateAdmission')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerFinancialAid')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerScholarships')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerVisitCampus')}</a></li>
              <li><a href="#" className="text-accent hover:text-light-text transition-colors">{t('home.footerApplyNow')}</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="text-lg font-semibold mb-4">{t('home.footerConnectTitle')}</h3>
            <div className="contact-info space-y-2 mb-4">
              <p>{t('home.footerAddress').replace('\n', <br />)}</p>
              <p>{t('home.footerPhone')}</p>
              <p>{t('home.footerEmail')}</p>
            </div>
            <div className="social-links flex space-x-4">
              <a href="#" className="social-icon w-8 h-8 bg-tertiary rounded-full flex items-center justify-center text-text hover:text-accent hover:bg-link transition-colors" aria-label={t('home.footerFacebook')}>f</a>
              <a href="#" className="social-icon w-8 h-8 bg-tertiary rounded-full flex items-center justify-center text-text hover:text-accent hover:bg-link transition-colors" aria-label={t('home.footerTwitter')}>t</a>
              <a href="#" className="social-icon w-8 h-8 bg-tertiary rounded-full flex items-center justify-center text-text hover:text-accent hover:bg-link transition-colors" aria-label={t('home.footerInstagram')}>i</a>
              <a href="#" className="social-icon w-8 h-8 bg-tertiary rounded-full flex items-center justify-center text-text hover:text-accent hover:bg-link transition-colors" aria-label={t('home.footerLinkedIn')}>in</a>
              <a href="#" className="social-icon w-8 h-8 bg-tertiary rounded-full flex items-center justify-center text-text hover:text-accent hover:bg-link transition-colors" aria-label={t('home.footerYouTube')}>y</a>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-footer border-t border-accent pt-8 mt-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-accent">{t('home.footerCopyright')}</p>
          <p className="text-center text-accent mt-2">
            <a href="#" className="hover:text-light-text transition-colors hover-lift">{t('home.footerPrivacy')}</a> |
            <a href="#" className="hover:text-light-text transition-colors hover-lift ml-2">{t('home.footerTerms')}</a> |
            <a href="#" className="hover:text-light-text transition-colors hover-lift ml-2">{t('home.footerAccessibility')}</a> |
            <a href="#" className="hover:text-light-text transition-colors hover-lift ml-2">{t('home.footerConsumer')}</a> |
            <a href="#" className="hover:text-light-text transition-colors hover-lift ml-2">{t('home.footerEmergency')}</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
