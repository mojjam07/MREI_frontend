import React from 'react';
import { safeArray } from '../../../../utils/dateUtils';

const TutorsSection = ({ t, tutors = [], tutorProfilesLoading }) => {
  // Ensure tutors is always an array
  const safeTutors = safeArray(tutors);

  if (tutorProfilesLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 animate-pulse">
            <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/20 rounded w-full mb-1"></div>
            <div className="h-3 bg-white/20 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {t('dashboard.tutorsManagement') || 'Tutors Management'}
          </h2>
          <p className="text-white/80">
            {t('dashboard.tutorsDescription') || 'Manage tutor profiles and information'}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {safeTutors.length > 0 ? safeTutors.map((tutor, index) => (
          <div key={tutor?.id || index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{tutor?.name || 'Unknown Tutor'}</h3>
                <p className="text-white/80 text-sm mb-3">ID: {tutor?.tutor_id || 'N/A'}</p>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span>{t('dashboard.email') || 'Email'}: {tutor?.email || 'N/A'}</span>
                  <span>{t('dashboard.specialization') || 'Specialization'}: {tutor?.specialization || 'N/A'}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    (tutor?.status || 'active') === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {tutor?.status || 'active'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors">
                  {t('dashboard.view') || 'View'}
                </button>
                <button className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors">
                  {t('dashboard.deactivate') || 'Deactivate'}
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">{t('dashboard.noTutors') || 'No tutors found'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorsSection;
