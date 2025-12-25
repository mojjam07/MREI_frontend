import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import SideNavigationLayout from '../../components/layout/SideNavigationLayout';

const WhyUs = () => {
  const { t } = useLanguage();
  const { ref: expertTutorsRef, animationClasses: expertTutorsAnimation } = useScrollAnimation();
  const { ref: flexibleRef, animationClasses: flexibleAnimation } = useScrollAnimation();
  const { ref: provenRef, animationClasses: provenAnimation } = useScrollAnimation();
  const { ref: featuresRef, animationClasses: featuresAnimation } = useScrollAnimation();

  return (
    <SideNavigationLayout>
        {/* Content Header */}
        <div className="bg-white border-b border-gray-200 p-6 lg:p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
              {t('whyUs.title')}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {t('whyUs.subtitle')}
            </p>
          </div>
        </div>

        {/* Expert Tutors Section */}
        <section ref={expertTutorsRef} className="py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className={`${expertTutorsAnimation}`}>
                <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4 lg:mb-6">
                  {t('whyUs.expertTutorsTitle')}
                </h2>
                <p className="text-gray-700 text-sm lg:text-base leading-relaxed mb-6">
                  {t('whyUs.expertTutorsDesc')}
                </p>
                <ul className="space-y-3">
                  {t('whyUs.expertTutorsFeatures').map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700 text-sm lg:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg hover-lift">
                <div className="w-full h-48 lg:h-56 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white text-4xl lg:text-5xl font-bold">👨‍🏫</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flexible Learning Section */}
        <section ref={flexibleRef} className="py-8 lg:py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1 bg-white p-6 lg:p-8 rounded-lg shadow-lg hover-lift">
                <div className="w-full h-48 lg:h-56 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-4xl lg:text-5xl font-bold">📚</span>
                </div>
              </div>
              <div className={`order-1 lg:order-2 ${flexibleAnimation}`}>
                <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4 lg:mb-6">
                  {t('whyUs.flexibleLearningTitle')}
                </h2>
                <p className="text-gray-700 text-sm lg:text-base leading-relaxed mb-6">
                  {t('whyUs.flexibleLearningDesc')}
                </p>
                <ul className="space-y-3">
                  {t('whyUs.flexibleLearningFeatures').map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700 text-sm lg:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Proven Success Section */}
        <section ref={provenRef} className="py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className={`${provenAnimation}`}>
                <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4 lg:mb-6">
                  {t('whyUs.provenSuccessTitle')}
                </h2>
                <p className="text-gray-700 text-sm lg:text-base leading-relaxed mb-6">
                  {t('whyUs.provenSuccessDesc')}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-2xl lg:text-3xl font-bold text-accent mb-1">95%</div>
                    <div className="text-xs lg:text-sm text-gray-600">{t('whyUs.provenSuccessFeatures')[0]}</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-2xl lg:text-3xl font-bold text-accent mb-1">5000+</div>
                    <div className="text-xs lg:text-sm text-gray-600">{t('whyUs.provenSuccessFeatures')[1]}</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-2xl lg:text-3xl font-bold text-accent mb-1">100+</div>
                    <div className="text-xs lg:text-sm text-gray-600">{t('whyUs.provenSuccessFeatures')[2]}</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-2xl lg:text-3xl font-bold text-accent mb-1">15+</div>
                    <div className="text-xs lg:text-sm text-gray-600">{t('whyUs.provenSuccessFeatures')[3]}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg hover-lift">
                <div className="w-full h-48 lg:h-56 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white text-4xl lg:text-5xl font-bold">🏆</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section ref={featuresRef} className="py-8 lg:py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className={`text-center mb-8 lg:mb-12 ${featuresAnimation}`}>
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4 lg:mb-6">
                Why Choose Us?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="text-center p-4 lg:p-6 hover-lift hover-scale animate-fade-in-up animate-stagger-1">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:rotate-12">
                  <span className="text-white text-xl lg:text-2xl font-bold">🎯</span>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-primary mb-2">
                  Personalized Learning
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  Tailored educational experiences designed for individual success and growth.
                </p>
              </div>
              <div className="text-center p-4 lg:p-6 hover-lift hover-scale animate-fade-in-up animate-stagger-2">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:rotate-12">
                  <span className="text-white text-xl lg:text-2xl font-bold">🚀</span>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-primary mb-2">
                  Innovative Approach
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  Cutting-edge teaching methods and technology integration for modern learning.
                </p>
              </div>
              <div className="text-center p-4 lg:p-6 hover-lift hover-scale animate-fade-in-up animate-stagger-3">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:rotate-12">
                  <span className="text-white text-xl lg:text-2xl font-bold">💡</span>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-primary mb-2">
                  Continuous Support
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  Ongoing mentorship and guidance throughout your educational journey.
                </p>
              </div>
            </div>
          </div>
        </section>
    </SideNavigationLayout>
  );
};

export default WhyUs;
