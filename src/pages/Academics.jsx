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

      {/* Courses We Offered Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-3">
              {t('academics.coursesWeOfferedTitle')}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          {/* Undergraduate Section */}
          <div className="mb-16">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-primary text-white px-6 py-4">
                <h3 className="text-2xl font-bold">
                  {t('academics.undergraduateTitle')}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6 text-lg">
                  {t('academics.undergraduateDesc')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary hover:bg-primary/5 transition-colors duration-300">
                    <h4 className="font-semibold text-primary mb-2">Foundation Programs</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• {t('academics.seerahProgram')}</li>
                      <li>• {t('academics.aqeedahProgram')}</li>
                      <li>• {t('academics.tafsirProgram')}</li>
                      <li>• {t('academics.hadithProgram')}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary hover:bg-primary/5 transition-colors duration-300">
                    <h4 className="font-semibold text-primary mb-2">Islamic Law & Practice</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• {t('academics.fiqhProgram')}</li>
                      <li>• {t('academics.hifzProgram')}</li>
                      <li>• {t('academics.tajweedProgram')}</li>
                      <li>• {t('academics.quranStudiesProgram')}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary hover:bg-primary/5 transition-colors duration-300">
                    <h4 className="font-semibold text-primary mb-2">Language Studies</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• {t('academics.nahwProgram')}</li>
                      <li>• {t('academics.sarfProgram')}</li>
                      <li>• {t('academics.balaghaProgram')}</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-xl font-bold text-primary mb-3">
                    {t('academics.bachelorDegrees')}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {t('academics.bachelorDesc')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      t('academics.islamicCivilizationProgram'),
                      t('academics.islamicHeritageProgram'),
                      t('academics.islamicMediaProgram'),
                      t('academics.khutbahProgram'),
                      t('academics.usulFiqhProgram'),
                    ].map((program, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-700">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span className="text-sm">{program}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
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
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
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
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
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
            <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-3 hover:shadow-xl transition-shadow duration-300">
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
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift transition-all duration-300 hover:shadow-xl">
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

            {/* Da'wah & Islamic Communication */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift transition-all duration-300 hover:shadow-xl">
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
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift transition-all duration-300 hover:shadow-xl">
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

      {/* Graduate Section - Now under Faculties */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-3">
              {t('academics.graduateTitle')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('academics.graduateDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Master's Degrees */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20 hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-primary mb-2">
                {t('academics.masterDegrees')}
              </h4>
              <p className="text-gray-600 text-sm">
                {t('academics.masterDesc')}
              </p>
            </div>

            {/* Doctoral Degrees */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20 hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-primary mb-2">
                {t('academics.doctoralDegrees')}
              </h4>
              <p className="text-gray-600 text-sm">
                {t('academics.doctoralDesc')}
              </p>
            </div>

            {/* Certificate Programs */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20 hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-primary mb-2">
                {t('academics.certificatePrograms')}
              </h4>
              <p className="text-gray-600 text-sm">
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

