
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { API_ENDPOINTS } from '../../config';
import apiClient from '../../services/apiClient';

const StatsSection = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get(API_ENDPOINTS.COMMUNICATION.STATISTICS);
      const data = response.data.data.statistics;
      
      setStats([
        { value: t('home.activeStudents'), label: `${data.active_students.toLocaleString()}+` },
        { value: t('home.courses'), label: `${data.courses}+` },
        { value: t('home.successRate'), label: `${data.success_rate}%` },
        { value: t('home.tutors'), label: `${data.tutors.toLocaleString()}+` }
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics. Please try again.');
      setStats([]);
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
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-light-text"></div>
            <p className="text-light-text mt-4">Loading statistics...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-light-text mb-4">{error}</p>
            <button 
              onClick={fetchStats}
              className="bg-accent text-primary px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Try Again
            </button>
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