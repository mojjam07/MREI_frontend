

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';
import PageHeader from '../components/layout/PageHeader';
import Footer from '../components/layout/Footer';

const AboutUs = () => {
  const { t, language } = useLanguage();
  const { ref: HERO_REF, animationClasses: HERO_ANIMATION } = useScrollAnimation();
  const { ref: MISSION_REF, animationClasses: MISSION_ANIMATION } = useScrollAnimation();
  const { ref: HISTORY_REF, animationClasses: HISTORY_ANIMATION } = useScrollAnimation();
  const { ref: LEADERSHIP_REF, animationClasses: LEADERSHIP_ANIMATION } = useScrollAnimation();
  const { ref: VALUES_REF, animationClasses: VALUES_ANIMATION } = useScrollAnimation();
  const { ref: STATS_REF, animationClasses: STATS_ANIMATION } = useScrollAnimation();
  
  // Counter animation for statistics
  const [counters, setCounters] = useState({
    founded: 1996,
    students: 10000,
    faculty: 30,
    employment: 95
  });
  
  const { visibleItems: visibleStats } = useStaggeredAnimation(4, 200);

  useEffect(() => {
    if (visibleStats.size > 0) {
      // Animate counters when they come into view
      const targets = { founded: 1900, students: 25000, faculty: 1200, employment: 95 };
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;
      
      Object.keys(targets).forEach((key, index) => {
        if (visibleStats.has(index)) {
          const target = targets[key];
          const increment = target / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
          }, stepDuration);
        }
      });
    }
  }, [visibleStats]);


  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      


      {/* Hero Section */}
      <section ref={HERO_REF} className="bg-primary text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center ${HERO_ANIMATION}`}>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
              {t('about.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>



      {/* Mission & Vision Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg hover-lift">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">
                {t('about.missionTitle')}
              </h2>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t('about.missionText')}
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg hover-lift">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">
                {t('about.visionTitle')}
              </h2>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t('about.visionText')}
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* History Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-4 sm:mb-6 lg:mb-8">
              {t('about.historyTitle')}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
              {t('about.historyText')}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8 lg:mt-12">
              <div className={`text-center hover-scale transition-transform duration-300 ${visibleStats.has(0) ? 'animate-count-up' : ''}`}>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent mb-1 sm:mb-2">
                  {/* {counters.founded}{counters.founded > 0 && counters.founded < 1900 ? '+' : ''} */}
                  <span className='text-primary'>{counters.founded}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">{t('about.founded')}</div>
              </div>
              <div className={`text-center hover-scale transition-transform duration-300 ${visibleStats.has(1) ? 'animate-count-up' : ''}`}>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent mb-1 sm:mb-2">
                  <span className='text-primary'>{counters.students > 0 ? (counters.students >= 1000 ? `${(counters.students / 1000).toFixed(0)}K+` : counters.students) : '0'}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">{t('about.students')}</div>
              </div>
              <div className={`text-center hover-scale transition-transform duration-300 ${visibleStats.has(2) ? 'animate-count-up' : ''}`}>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent mb-1 sm:mb-2">
                  <span className='text-primary'>{counters.faculty > 0 ? (counters.faculty >= 1000 ? `${(counters.faculty / 1000).toFixed(0)}K+` : counters.faculty) : '0'}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">{t('about.faculty')}</div>
              </div>
              <div className={`text-center hover-scale transition-transform duration-300 ${visibleStats.has(3) ? 'animate-count-up' : ''}`}>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent mb-1 sm:mb-2">
                  <span className='text-primary'>{counters.employment}%</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">{t('about.employmentRate')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Leadership Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">
              {t('about.leadershipTitle')}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base lg:text-lg max-w-xl sm:max-w-2xl mx-auto">
              {t('about.leadershipSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* President Card */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift hover-glow transition-all duration-300">
              <div className={`flex ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} items-center gap-4`}>
                <div className="flex-shrink-0">
                  <img 
                    src="https://res.cloudinary.com/doi8mindp/image/upload/v1767333034/FB_IMG_1762014536592_y34z5u.jpg" 
                    alt={t('about.presidentName')}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded object-cover transition-transform duration-300 hover-scale shadow-md"
                  />
                </div>
                <div className={`text-center sm:text-left ${language === 'ar' ? 'sm:text-right' : 'sm:text-left'} flex-1`}>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-1 sm:mb-2">
                    {t('about.presidentName')}
                  </h3>
                  <p className="text-primary text-xs sm:text-sm lg:text-base mb-1 sm:mb-2">{t('about.presidentTitle')}</p>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{t('about.presidentBio')}</p>
                </div>
              </div>
            </div>
            
            {/* Vice President Card */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift hover-glow transition-all duration-300">
              <div className={`flex ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} items-center gap-4`}>
                <div className="flex-shrink-0">
                  <img 
                    src="https://res.cloudinary.com/doi8mindp/image/upload/v1767270351/logo2_h07cix.png" 
                    alt={t('about.vpName')}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded object-cover transition-transform duration-300 hover-scale shadow-md"
                  />
                </div>
                <div className={`text-center sm:text-left ${language === 'ar' ? 'sm:text-right' : 'sm:text-left'} flex-1`}>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-1 sm:mb-2">
                    {t('about.vpName')}
                  </h3>
                  <p className="text-primary text-xs sm:text-sm lg:text-base mb-1 sm:mb-2">{t('about.vpTitle')}</p>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{t('about.vpBio')}</p>
                </div>
              </div>
            </div>
            
            {/* Dean Card */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover-lift hover-glow transition-all duration-300 lg:col-span-1 xl:col-span-1">
              <div className={`flex ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} items-center gap-4`}>
                <div className="flex-shrink-0">
                  <img 
                    src="https://res.cloudinary.com/doi8mindp/image/upload/v1767270351/logo2_h07cix.png" 
                    alt={t('about.deanName')}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded object-cover transition-transform duration-300 hover-scale shadow-md"
                  />
                </div>
                <div className={`text-center sm:text-left ${language === 'ar' ? 'sm:text-right' : 'sm:text-left'} flex-1`}>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-1 sm:mb-2">
                    {t('about.deanName')}
                  </h3>
                  <p className="text-primary text-xs sm:text-sm lg:text-base mb-1 sm:mb-2">{t('about.deanTitle')}</p>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{t('about.deanBio')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Values Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">
              {t('about.valuesTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center p-3 sm:p-4 lg:p-6 hover-lift hover-scale animate-fade-in-up animate-stagger-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 hover:rotate-12">
                <span className="text-primary text-lg sm:text-xl lg:text-2xl font-bold">E</span>
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-1 sm:mb-2">
                {t('about.excellenceTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                {t('about.excellenceText')}
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-6 hover-lift hover-scale animate-fade-in-up animate-stagger-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 hover:rotate-12">
                <span className="text-primary text-lg sm:text-xl lg:text-2xl font-bold">I</span>
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-1 sm:mb-2">
                {t('about.innovationTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                {t('about.innovationText')}
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-6 hover-lift hover-scale animate-fade-in-up animate-stagger-3 xs:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 hover:rotate-12">
                <span className="text-primary text-lg sm:text-xl lg:text-2xl font-bold">C</span>
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-1 sm:mb-2">
                {t('about.communityTitle')}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                {t('about.communityText')}
              </p>
            </div>
          </div>

        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
