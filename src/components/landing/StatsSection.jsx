import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const StatsSection = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/');
        const data = await response.json();
        setStats([
          { value: t('home.activeStudents'), label: `${data.active_students}+` },
          { value: t('home.courses'), label: `${data.courses}+` },
          { value: t('home.successRate'), label: `${data.success_rate}%` },
          { value: t('home.tutors'), label: `${data.tutors}+` }
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats([
          { value: t('home.activeStudents'), label: '15,000+' },
          { value: t('home.courses'), label: '200+' },
          { value: t('home.successRate'), label: '95%' },
          { value: t('home.tutors'), label: '500+' }
        ]);
      }
    };
    fetchStats();
  }, [t]);

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-light-text mb-4">
            {t('home.stats')}
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-light-text mb-2">
                {stat.label}
              </div>
              <div className="text-accent">
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
