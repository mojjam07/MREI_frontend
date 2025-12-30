import React from 'react';
import { safeArray } from '../../../../utils/dateUtils';

const StudentsSection = ({ t, students = [], studentProfilesLoading }) => {
  const safeStudents = safeArray(students);

  if (studentProfilesLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border border-white/20 animate-pulse"
          >
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
      {/* Header */}
      <div className="flex justify-between items-center animate-fade-in-up">
        <div>
          <h2 className="text-3xl font-bold text-light-text mb-2">
            {t('dashboard.studentsManagement') || 'Students Management'}
          </h2>
          <p className="text-light-text/80">
            {t('dashboard.studentsDescription') || 'Manage student profiles and information'}
          </p>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid gap-6">
        {safeStudents.length > 0 ? (
          safeStudents.map((student, index) => (
            <div
              key={student.id || index}
              className="bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-accent-color/30 hover-lift transition-all duration-300 animate-scale-in"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-light-text mb-2">
                    {student?.name || 'Unknown Student'}
                  </h3>
                  <p className="text-light-text/80 text-sm mb-3">ID: {student?.student_id || 'N/A'}</p>
                  <div className="flex items-center gap-4 text-sm text-light-text/60">
                    <span>{t('dashboard.email') || 'Email'}: {student?.email || 'N/A'}</span>
                    <span>{t('dashboard.program') || 'Program'}: {student?.program || 'N/A'}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        (student?.status || 'active') === 'active'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {student?.status || 'active'}
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
          ))
        ) : (
          <div className="text-center py-12 animate-fade-in-up">
            <p className="text-light-text/60 text-lg">{t('dashboard.noStudents') || 'No students found'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsSection;
