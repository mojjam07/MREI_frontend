import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import SideNavigationLayout from '../../components/layout/SideNavigationLayout';

const OurImpact = () => {
  const { t } = useLanguage();
  const { ref: studentStatsRef, animationClasses: studentStatsAnimation } = useScrollAnimation();
  const { ref: courseStatsRef, animationClasses: courseStatsAnimation } = useScrollAnimation();
  const { ref: successMetricsRef, animationClasses: successMetricsAnimation } = useScrollAnimation();
  const { ref: tutorNetworkRef, animationClasses: tutorNetworkAnimation } = useScrollAnimation();

  const statsData = {
    studentStats: [
      { label: t('ourImpact.studentStats.totalStudents'), value: '2,500+' },
      { label: t('ourImpact.studentStats.activeLearners'), value: '2,200+' },
      { label: t('ourImpact.studentStats.graduateRate'), value: '94%' },
      { label: t('ourImpact.studentStats.internationalStudents'), value: '450+' }
    ],
    courseStats: [
      { label: t('ourImpact.courseStats.totalPrograms'), value: '50+' },
      { label: t('ourImpact.courseStats.certificationCourses'), value: '25+' },
      { label: t('ourImpact.courseStats.degreePrograms'), value: '15+' },
      { label: t('ourImpact.courseStats.specializedTracks'), value: '10+' }
    ],
    successMetrics: [
      { label: t('ourImpact.successMetrics.employmentRate'), value: '96%' },
      { label: t('ourImpact.successMetrics.averageSalary'), value: '+45%' },
      { label: t('ourImpact.successMetrics.studentSatisfaction'), value: '98%' },
      { label: t('ourImpact.successMetrics.industryPartnerships'), value: '100+' }
    ],
    tutorNetwork: [
      { label: t('ourImpact.tutorNetwork.certifiedTutors'), value: '150+' },
      { label: t('ourImpact.tutorNetwork.subjectExperts'), value: '80+' },
      { label: t('ourImpact.tutorNetwork.industryProfessionals'), value: '45+' },
      { label: t('ourImpact.tutorNetwork.ongoingTraining'), value: '100%' }
    ]
  };

  return (
    <SideNavigationLayout>
        {/* Content Header */}
        <div className="bg-white border-b border-gray-200 p-6 lg:p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
              {t('ourImpact.title')}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {t('ourImpact.subtitle')}
            </p>
          </div>
        </div>

        {/* Student Statistics Section */}
        <section ref={studentStatsRef} className="py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                {t('ourImpact.studentStatsTitle')}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                {t('ourImpact.studentStatsDesc')}
              </p>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${studentStatsAnimation}`}>
              {statsData.studentStats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-lg shadow-lg hover-lift">
                  <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">{stat.value}</div>
                  <div className="text-sm lg:text-base text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Course Offerings Section */}
        <section ref={courseStatsRef} className="py-8 lg:py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                {t('ourImpact.courseOfferingsTitle')}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                {t('ourImpact.courseOfferingsDesc')}
              </p>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${courseStatsAnimation}`}>
              {statsData.courseStats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg shadow-lg hover-lift">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm lg:text-base text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Metrics Section */}
        <section ref={successMetricsRef} className="py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                {t('ourImpact.successMetricsTitle')}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                {t('ourImpact.successMetricsDesc')}
              </p>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${successMetricsAnimation}`}>
              {statsData.successMetrics.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-gradient-to-br from-primary to-accent text-white rounded-lg shadow-lg hover-lift">
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm lg:text-base text-white/90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tutor Network Section */}
        <section ref={tutorNetworkRef} className="py-8 lg:py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                {t('ourImpact.tutorNetworkTitle')}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                {t('ourImpact.tutorNetworkDesc')}
              </p>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${tutorNetworkAnimation}`}>
              {statsData.tutorNetwork.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white border-2 border-accent rounded-lg shadow-lg hover-lift">
                  <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">{stat.value}</div>
                  <div className="text-sm lg:text-base text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Summary Section */}
        <section className="py-8 lg:py-12">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-primary to-accent text-white p-8 lg:p-12 rounded-lg shadow-xl">
              <h2 className="text-xl lg:text-2xl font-bold mb-4">
                {t('ourImpact.commitmentTitle')}
              </h2>
              <p className="text-sm lg:text-base text-white/90 mb-6">
                {t('ourImpact.commitmentDesc')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">20+</div>
                  <div className="text-sm text-white/80">{t('ourImpact.stats.yearsOfExcellence')}</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">50+</div>
                  <div className="text-sm text-white/80">{t('ourImpact.stats.industryPartners')}</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">99%</div>
                  <div className="text-sm text-white/80">{t('ourImpact.stats.successRate')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </SideNavigationLayout>
  );
};

export default OurImpact;
