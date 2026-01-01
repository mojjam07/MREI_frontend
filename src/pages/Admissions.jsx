

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import PageHeader from '../components/layout/PageHeader';
import Footer from '../components/layout/Footer';

const Admissions = () => {
  const { t } = useLanguage();
  const { ref: heroRef, animationClasses: heroAnimation } = useScrollAnimation();
  const { ref: applyRef, animationClasses: applyAnimation } = useScrollAnimation();
  const { ref: undergradRef, animationClasses: undergradAnimation } = useScrollAnimation();
  const { ref: graduateRef, animationClasses: graduateAnimation } = useScrollAnimation();
  const { ref: financialRef, animationClasses: financialAnimation } = useScrollAnimation();
  const { ref: visitRef, animationClasses: visitAnimation } = useScrollAnimation();


  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      


      {/* Hero Section */}
      <section ref={heroRef} className="bg-primary text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center ${heroAnimation}`}>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
              {t('admissions.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed">
              {t('admissions.subtitle')}
            </p>
          </div>
        </div>
      </section>



      {/* Apply Now Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">
              {t('admissions.applyNowTitle')}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base lg:text-lg max-w-xl sm:max-w-2xl mx-auto mb-4 sm:mb-6 lg:mb-8">
              {t('admissions.applyNowDesc')}
            </p>
            <button className="bg-primary hover:bg-accent/90 text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 animate-pulse-gentle">
              {t('admissions.startApplication')}
            </button>
          </div>
        </div>
      </section>



      {/* Undergraduate Admission Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">
                {t('admissions.undergraduateTitle')}
              </h2>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg">
                {t('admissions.undergraduateDesc')}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg hover-lift hover-glow transition-all duration-300 animate-fade-in-left animate-stagger-1">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 sm:mb-4">
                  {t('admissions.requirementsTitle')}
                </h3>
                <ul className="text-gray-600 text-xs sm:text-sm lg:text-base space-y-1 sm:space-y-2">
                  <li>• {t('admissions.highSchoolDiploma')}</li>
                  <li>• {t('admissions.satOrAct')}</li>
                  <li>• {t('admissions.transcripts')}</li>
                  <li>• {t('admissions.essays')}</li>
                  <li>• {t('admissions.letterOfRecommendation')}</li>
                  <li>• {t('admissions.applicationFee')}</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg hover-lift hover-glow transition-all duration-300 animate-fade-in-right animate-stagger-2">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 sm:mb-4">
                  {t('admissions.timelineTitle')}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between animate-timeline-in">
                    <span className="text-gray-600 text-xs sm:text-sm lg:text-base">{t('admissions.earlyDecision')}</span>
                    <span className="text-primary font-semibold text-xs sm:text-sm lg:text-base">{t('admissions.november1')}</span>
                  </div>
                  <div className="flex justify-between animate-timeline-in animate-stagger-1">
                    <span className="text-gray-600 text-xs sm:text-sm lg:text-base">{t('admissions.earlyAction')}</span>
                    <span className="text-primary font-semibold text-xs sm:text-sm lg:text-base">{t('admissions.november15')}</span>
                  </div>
                  <div className="flex justify-between animate-timeline-in animate-stagger-2">
                    <span className="text-gray-600 text-xs sm:text-sm lg:text-base">{t('admissions.regularDecision')}</span>
                    <span className="text-primary font-semibold text-xs sm:text-sm lg:text-base">{t('admissions.january15')}</span>
                  </div>
                  <div className="flex justify-between animate-timeline-in animate-stagger-3">
                    <span className="text-gray-600 text-xs sm:text-sm lg:text-base">{t('admissions.transferDeadline')}</span>
                    <span className="text-primary font-semibold text-xs sm:text-sm lg:text-base">{t('admissions.march1')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 animate-pulse-gentle">
                {t('admissions.undergraduateChecklist')}
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* Graduate Admission Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">
                {t('admissions.graduateTitle')}
              </h2>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg">
                {t('admissions.graduateDesc')}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift hover-glow transition-all duration-300 animate-fade-in-up animate-stagger-1">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 sm:mb-4">
                  {t('admissions.masterRequirements')}
                </h3>
                <ul className="text-gray-600 text-xs sm:text-sm lg:text-base space-y-1 sm:space-y-2">
                  <li>• {t('admissions.bachelorDegree')}</li>
                  <li>• {t('admissions.greScores')}</li>
                  <li>• {t('admissions.transcripts')}</li>
                  <li>• {t('admissions.statementsOfPurpose')}</li>
                  <li>• {t('admissions.lettersOfRecommendation')}</li>
                  <li>• {t('admissions.interview')}</li>
                </ul>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift hover-glow transition-all duration-300 animate-fade-in-up animate-stagger-2">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 sm:mb-4">
                  {t('admissions.phdRequirements')}
                </h3>
                <ul className="text-gray-600 text-xs sm:text-sm lg:text-base space-y-1 sm:space-y-2">
                  <li>• {t('admissions.masterDegree')}</li>
                  <li>• {t('admissions.researchProposal')}</li>
                  <li>• {t('admissions.academicWriting')}</li>
                  <li>• {t('admissions.facultySupport')}</li>
                  <li>• {t('admissions.qualifyingExam')}</li>
                  <li>• {t('admissions.comprehensiveExam')}</li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <button className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 animate-pulse-gentle">
                {t('admissions.graduateChecklist')}
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Financial Aid Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">
              {t('admissions.financialAidTitle')}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base lg:text-lg max-w-xl sm:max-w-2xl mx-auto">
              {t('admissions.financialAidDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center p-3 sm:p-4 lg:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white text-lg sm:text-xl lg:text-2xl">💰</span>
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2">
                {t('admissions.scholarshipsTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                {t('admissions.scholarshipsDesc')}
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white text-lg sm:text-xl lg:text-2xl">🎓</span>
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2">
                {t('admissions.grantsTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                {t('admissions.grantsDesc')}
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white text-lg sm:text-xl lg:text-2xl">🏦</span>
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2">
                {t('admissions.studentLoansTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                {t('admissions.studentLoansDesc')}
              </p>
            </div>
          </div>
          <div className="text-center mt-6 sm:mt-8 lg:mt-12">
            <button className="bg-primary hover:bg-accent/90 text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-colors">
              {t('admissions.financialAidCalculator')}
            </button>
          </div>
        </div>
      </section>


      {/* Visit Campus Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">
              {t('admissions.visitCampusTitle')}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8">
              {t('admissions.visitCampusDesc')}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-lg">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2">
                  {t('admissions.campusToursTitle')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                  {t('admissions.campusToursDesc')}
                </p>
              </div>
              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-lg">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2">
                  {t('admissions.infoSessionsTitle')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                  {t('admissions.infoSessionsDesc')}
                </p>
              </div>
              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-lg">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2">
                  {t('admissions.overnightStaysTitle')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                  {t('admissions.overnightStaysDesc')}
                </p>
              </div>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-colors">
              {t('admissions.scheduleVisit')}
            </button>
          </div>

        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Admissions;
