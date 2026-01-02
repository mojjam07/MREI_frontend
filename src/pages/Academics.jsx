import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import PageHeader from '../components/layout/PageHeader';
import Footer from '../components/layout/Footer';

const Academics = () => {
  const { t } = useLanguage();
  const { ref: heroRef, animationClasses: heroAnimation } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      {/* Hero Section */}
      <section ref={heroRef} className="bg-primary text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className={`text-center ${heroAnimation}`}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {t('academics.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-4xl mx-auto">
              {t('academics.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Faculties Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-3">
              {t('academics.collegesTitle')}
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {t('academics.collegesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Theology */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-2">
                {t('academics.theologyTitle')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('academics.theologyDesc')}
              </p>
              <ul className="text-gray-500 space-y-1">
                <li>• {t('academics.aqeedahProgram')}</li>
                <li>• {t('academics.tafsirProgram')}</li>
                <li>• {t('academics.hadithProgram')}</li>
              </ul>
            </div>

            {/* Shariah */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-2">
                {t('academics.shariaTitle')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('academics.shariaDesc')}
              </p>
              <ul className="text-gray-500 space-y-1">
                <li>• {t('academics.fiqhProgram')}</li>
                <li>• {t('academics.usulFiqhProgram')}</li>
                <li>• {t('academics.islamicLawProgram')}</li>
              </ul>
            </div>

            {/* Quran */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-2">
                {t('academics.quranTitle')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('academics.quranDesc')}
              </p>
              <ul className="text-gray-500 space-y-1">
                <li>• {t('academics.hifzProgram')}</li>
                <li>• {t('academics.tajweedProgram')}</li>
                <li>• {t('academics.quranStudiesProgram')}</li>
              </ul>
            </div>

            {/* Islamic Education */}
            <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-3">
              <h3 className="text-xl font-bold text-primary mb-2">
                {t('academics.educationTitle')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('academics.educationDesc')}
              </p>
              <ul className="text-gray-500 space-y-1">
                <li>• {t('academics.islamicEducationProgram')}</li>
                <li>• {t('academics.arabicEducationProgram')}</li>
                <li>• {t('academics.dawahProgram')}</li>
              </ul>
            </div>

            {/* Arabic Language & Linguistics */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift transition-all duration-300">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2">
                {t('academics.arabicLanguageTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4">
                {t('academics.arabicLanguageDesc')}
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• {t('academics.nahwProgram')}</li>
                <li>• {t('academics.sarfProgram')}</li>
                <li>• {t('academics.balaghaProgram')}</li>
              </ul>
            </div>

            {/* Da‘wah & Islamic Communication */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift transition-all duration-300">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2">
                {t('academics.dawahTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4">
                {t('academics.dawahDesc')}
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• {t('academics.islamicMediaProgram')}</li>
                <li>• {t('academics.khutbahProgram')}</li>
                <li>• {t('academics.interfaithProgram')}</li>
              </ul>
            </div>

            {/* Islamic History & Civilization */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift transition-all duration-300">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2">
                {t('academics.islamicHistoryTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4">
                {t('academics.islamicHistoryDesc')}
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• {t('academics.seerahProgram')}</li>
                <li>• {t('academics.islamicCivilizationProgram')}</li>
                <li>• {t('academics.islamicHeritageProgram')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Undergraduate */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-2xl font-bold text-primary mb-3">
            {t('academics.undergraduateTitle')}
          </h2>
          <p className="text-gray-700 mb-6">
            {t('academics.undergraduateDesc')}
          </p>
          <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
            <li>• {t('academics.seerahProgram')}</li>
            <li>• {t('academics.aqeedahProgram')}</li>
            <li>• {t('academics.tafsirProgram')}</li>
            <li>• {t('academics.hadithProgram')}</li>
            <li>• {t('academics.fiqhProgram')}</li>
            <li>• {t('academics.hifzProgram')}</li>
            <li>• {t('academics.tajweedProgram')}</li>
            <li>• {t('academics.quranStudiesProgram')}</li>
          </ul>

          <h3 className="text-xl font-bold text-primary mb-2">
            {t('academics.bachelorDegrees')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('academics.bachelorDesc')}
          </p>
          <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
            <li>• {t('academics.nahwProgram')}</li>
            <li>• {t('academics.sarfProgram')}</li>
            <li>• {t('academics.balaghaProgram')}</li>
            <li>• {t('academics.islamicCivilizationProgram')}</li>
            <li>• {t('academics.islamicHeritageProgram')}</li>
            <li>• {t('academics.islamicMediaProgram')}</li>
            <li>• {t('academics.khutbahProgram')}</li>
            <li>• {t('academics.usulFiqhProgram')}</li>
          </ul>
        </div>
      </section>

      {/* Graduate */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <h2 className="text-2xl font-bold text-primary mb-3">
            {t('academics.graduateTitle')}
          </h2>
          <p className="text-gray-700 mb-8">
            {t('academics.graduateDesc')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-primary mb-2">
                {t('academics.masterDegrees')}
              </h3>
              <p className="text-gray-600">
                {t('academics.masterDesc')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-primary mb-2">
                {t('academics.doctoralDegrees')}
              </h3>
              <p className="text-gray-600">
                {t('academics.doctoralDesc')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-primary mb-2">
                {t('academics.certificatePrograms')}
              </h3>
              <p className="text-gray-600">
                {t('academics.certificateDesc')}
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
