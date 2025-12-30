import React from 'react';

const StatsSection = ({ t, statValues = {} }) => {
  const safeStats = statValues || {};

  const statsData = [
    { label: t('statValues.totalUsers') || 'Total Users', value: safeStats.totalUsers || 0, color: 'text-blue-400' },
    { label: t('statValues.totalStudents') || 'Total Students', value: safeStats.totalStudents || 0, color: 'text-green-400' },
    { label: t('statValues.totalTutors') || 'Total Tutors', value: safeStats.totalTutors || 0, color: 'text-purple-400' },
    { label: t('statValues.totalNews') || 'News Articles', value: safeStats.totalNews || 0, color: 'text-yellow-400' },
    { label: t('statValues.totalEvents') || 'Events', value: safeStats.totalEvents || 0, color: 'text-red-400' },
    { label: t('statValues.totalTestimonials') || 'Testimonials', value: safeStats.totalTestimonials || 0, color: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in-up">
        <h2 className="text-3xl font-bold text-light-text mb-2">
          {t('dashboard.overview') || 'Dashboard Overview'}
        </h2>
        <p className="text-light-text/80">
          {t('dashboard.overviewDescription') || 'Real-time statistics and insights'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {statsData.map((statValues, index) => (
          <div
            key={index}
            className="bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-accent-color/30 hover-lift transition-all duration-300 animate-scale-in"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-light-text/80 text-sm font-medium">{statValues.label}</p>
                <p className={`text-3xl font-bold ${statValues.color}`}>{statValues.value.toLocaleString()}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary opacity-20 flex items-center justify-center`}
              >
                <div className={`w-6 h-6 rounded-full ${statValues.color.replace('text-', 'bg-')}`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
