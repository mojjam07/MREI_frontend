
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { contentApi } from '../../services/apiClient';

const StatsSection = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const response = await contentApi.getStatistics();
      const data = response.data.data.statistics;
      
      setStats([
        { value: t('home.activeStudents'), label: `${data.active_students?.toLocaleString() || data.totalStudents?.toLocaleString() || '0'}+` },
        { value: t('home.courses'), label: `${data.courses || 0}+` },
        { value: t('home.successRate'), label: `${data.success_rate || data.successRate || 0}%` },
        { value: t('home.tutors'), label: `${data.tutors?.toLocaleString() || data.totalTutors?.toLocaleString() || '0'}+` }
      ]);
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Use fallback data instead of showing error
      setStats([
        { value: t('home.activeStudents'), label: '500+' },
        { value: t('home.courses'), label: '50+' },
        { value: t('home.successRate'), label: '95%' },
        { value: t('home.tutors'), label: '25+' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [t]);


  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-light-text mb-3 sm:mb-4 px-4">
              {t('home.stats')}
            </h2>
          </div>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-light-text"></div>
            <p className="text-light-text mt-4">{t('home.loadingStatistics')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-light-text mb-3 sm:mb-4 px-4">
            {t('home.stats')}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-light-text mb-1 sm:mb-2">
                {stat.label}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-accent">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
