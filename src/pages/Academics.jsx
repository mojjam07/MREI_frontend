

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import PageHeader from '../components/layout/PageHeader';
import Footer from '../components/layout/Footer';

const Academics = () => {
  const { t } = useLanguage();
  const { ref: heroRef, animationClasses: heroAnimation } = useScrollAnimation();
  const { ref: collegesRef, animationClasses: collegesAnimation } = useScrollAnimation();
  const { ref: undergradRef, animationClasses: undergradAnimation } = useScrollAnimation();
  const { ref: graduateRef, animationClasses: graduateAnimation } = useScrollAnimation();
  const { ref: resourcesRef, animationClasses: resourcesAnimation } = useScrollAnimation();


  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      


      {/* Hero Section */}
      <section ref={heroRef} className="bg-primary text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center ${heroAnimation}`}>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
              {t('academics.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed">
              {t('academics.subtitle')}
            </p>
          </div>
        </div>
      </section>



      {/* Colleges & Schools Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">
              {t('academics.collegesTitle')}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base lg:text-lg max-w-xl sm:max-w-2xl mx-auto">
              {t('academics.collegesSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift hover-glow transition-all duration-300 animate-fade-in-up animate-stagger-1">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2 sm:mb-3">
                {t('academics.engineeringTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">
                {t('academics.engineeringDesc')}
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• {t('academics.csProgram')}</li>
                <li>• {t('academics.mechanicalProgram')}</li>
                <li>• {t('academics.electricalProgram')}</li>
              </ul>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift hover-glow transition-all duration-300 animate-fade-in-up animate-stagger-2">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2 sm:mb-3">
                {t('academics.businessTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">
                {t('academics.businessDesc')}
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• {t('academics.mbaProgram')}</li>
                <li>• {t('academics.financeProgram')}</li>
                <li>• {t('academics.marketingProgram')}</li>
              </ul>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift hover-glow transition-all duration-300 animate-fade-in-up animate-stagger-3 xs:col-span-2 lg:col-span-1">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2 sm:mb-3">
                {t('academics.sciencesTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">
                {t('academics.sciencesDesc')}
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• {t('academics.biologyProgram')}</li>
                <li>• {t('academics.chemistryProgram')}</li>
                <li>• {t('academics.physicsProgram')}</li>
              </ul>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift hover-glow transition-all duration-300 animate-fade-in-up animate-stagger-4">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2 sm:mb-3">
                {t('academics.liberalArtsTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">
                {t('academics.liberalArtsDesc')}
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• {t('academics.englishProgram')}</li>
                <li>• {t('academics.historyProgram')}</li>
                <li>• {t('academics.philosophyProgram')}</li>
              </ul>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift hover-glow transition-all duration-300 animate-fade-in-up animate-stagger-5">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2 sm:mb-3">
                {t('academics.medicineTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">
                {t('academics.medicineDesc')}
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• {t('academics.medicineProgram')}</li>
                <li>• {t('academics.nursingProgram')}</li>
                <li>• {t('academics.pharmacyProgram')}</li>
              </ul>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift hover-glow transition-all duration-300 animate-fade-in-up animate-stagger-6 xs:col-span-2 lg:col-span-1">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2 sm:mb-3">
                {t('academics.educationTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">
                {t('academics.educationDesc')}
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• {t('academics.elementaryProgram')}</li>
                <li>• {t('academics.secondaryProgram')}</li>
                <li>• {t('academics.specialEdProgram')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Undergraduate Programs Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">
                {t('academics.undergraduateTitle')}
              </h2>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg">
                {t('academics.undergraduateDesc')}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 sm:mb-4">
                  {t('academics.bachelorDegrees')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">
                  {t('academics.bachelorDesc')}
                </p>
                <ul className="text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-2">
                  <li>• {t('academics.120CreditHour')}</li>
                  <li>• {t('academics.generalEducation')}</li>
                  <li>• {t('academics.majorRequirements')}</li>
                  <li>• {t('academics.electiveCourses')}</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 sm:mb-4">
                  {t('academics.associateDegrees')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">
                  {t('academics.associateDesc')}
                </p>
                <ul className="text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-2">
                  <li>• {t('academics.60CreditHour')}</li>
                  <li>• {t('academics.transferReady')}</li>
                  <li>• {t('academics.careerFocused')}</li>
                  <li>• {t('academics.fastTrack')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Graduate Programs Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">
                {t('academics.graduateTitle')}
              </h2>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg">
                {t('academics.graduateDesc')}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2 sm:mb-3">
                  {t('academics.masterDegrees')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">
                  {t('academics.masterDesc')}
                </p>
                <p className="text-accent text-xs sm:text-sm font-semibold">
                  {t('academics.duration')}: 1-2 {t('academics.years')}
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2 sm:mb-3">
                  {t('academics.doctoralDegrees')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">
                  {t('academics.doctoralDesc')}
                </p>
                <p className="text-accent text-xs sm:text-sm font-semibold">
                  {t('academics.duration')}: 4-6 {t('academics.years')}
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg lg:col-span-1">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2 sm:mb-3">
                  {t('academics.certificatePrograms')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">
                  {t('academics.certificateDesc')}
                </p>
                <p className="text-accent text-xs sm:text-sm font-semibold">
                  {t('academics.duration')}: 6-12 {t('academics.months')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Academic Resources Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">
              {t('academics.resourcesTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center p-3 sm:p-4 lg:p-6 hover-lift hover-scale animate-fade-in-up animate-stagger-1 cursor-pointer" onClick={() => window.location.href = '/library'}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 hover:rotate-12 animate-pulse-gentle">
                <span className="text-white text-lg sm:text-xl lg:text-2xl">📚</span>
              </div>
              <h3 className="text-xs sm:text-sm lg:text-xl font-bold text-primary mb-1 sm:mb-2">
                {t('academics.libraryTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t('academics.libraryDesc')}
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-6 hover-lift hover-scale animate-fade-in-up animate-stagger-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 hover:rotate-12 animate-pulse-gentle">
                <span className="text-white text-lg sm:text-xl lg:text-2xl">🖥️</span>
              </div>
              <h3 className="text-xs sm:text-sm lg:text-xl font-bold text-primary mb-1 sm:mb-2">
                {t('academics.onlineLearningTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t('academics.onlineLearningDesc')}
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-6 hover-lift hover-scale animate-fade-in-up animate-stagger-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 hover:rotate-12 animate-pulse-gentle">
                <span className="text-white text-lg sm:text-xl lg:text-2xl">🔬</span>
              </div>
              <h3 className="text-xs sm:text-sm lg:text-xl font-bold text-primary mb-1 sm:mb-2">
                {t('academics.researchTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t('academics.researchDesc')}
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-6 hover-lift hover-scale animate-fade-in-up animate-stagger-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 hover:rotate-12 animate-pulse-gentle">
                <span className="text-white text-lg sm:text-xl lg:text-2xl">📅</span>
              </div>
              <h3 className="text-xs sm:text-sm lg:text-xl font-bold text-primary mb-1 sm:mb-2">
                {t('academics.calendarTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t('academics.calendarDesc')}
              </p>
            </div>
          </div>

        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Academics;
