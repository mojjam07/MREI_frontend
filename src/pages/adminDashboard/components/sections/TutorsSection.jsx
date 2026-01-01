import React, { useState } from 'react';
import { safeArray, safeString } from '../../../../utils/dateUtils';
import { Edit2, X, Mail, BookOpen, Clock, Briefcase, Award, MapPin, User, GraduationCap } from 'lucide-react';

const TutorsSection = ({ t, tutors = [], tutorProfilesLoading, updateTutor }) => {
  const safeTutors = safeArray(tutors);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tutor_id: '',
    specialization: '',
    qualification: '',
    experience_years: '',
    department: '',
    office_location: '',
    consultation_hours: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startEdit = (tutor) => {
    setEditingId(tutor.id);
    setFormData({
      tutor_id: tutor.tutor_id || '',
      specialization: tutor.specialization || '',
      qualification: tutor.qualification || '',
      experience_years: tutor.experience_years || '',
      department: tutor.department || '',
      office_location: tutor.office_location || '',
      consultation_hours: tutor.consultation_hours || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      tutor_id: '',
      specialization: '',
      qualification: '',
      experience_years: '',
      department: '',
      office_location: '',
      consultation_hours: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateTutor(editingId, formData);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating tutor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      case 'on_leave':
        return 'bg-amber-400/20 text-amber-400 border border-amber-400/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  if (tutorProfilesLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-4 sm:p-6 animate-pulse-gentle">
            <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/20 rounded w-full mb-1"></div>
            <div className="h-3 bg-white/20 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 animate-fade-in-up">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
            <span className="truncate">{t('dashboard.tutorsManagement') || 'Tutors Management'}</span>
          </h2>
          <p className="text-sm sm:text-base text-light-text/80 hidden sm:block">
            {t('dashboard.tutorsDescription') || 'Manage tutor profiles and information'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-light-text/60">
          <span className="glass-card px-2 sm:px-3 py-1 rounded-full">
            {safeTutors.length} {t('dashboard.tutors') || 'tutors'}
          </span>
        </div>
      </div>

      {/* Edit Tutor Form */}
      {editingId && (
        <div className="glass-card p-4 sm:p-6 animate-fade-in-up hover-lift hover-glow-coral">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
            <h3 className="text-lg sm:text-xl font-semibold text-light-text">
              {t('dashboard.editTutor') || 'Edit Tutor Profile'}
            </h3>
            <button
              onClick={cancelEdit}
              className="ml-auto p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              aria-label="Cancel"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.tutorId') || 'Tutor ID'}
                </label>
                <input
                  type="text"
                  name="tutor_id"
                  value={formData.tutor_id}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterTutorId') || 'Enter tutor ID'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.specialization') || 'Specialization'}
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterSpecialization') || 'Enter specialization'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.qualification') || 'Qualification'}
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterQualification') || 'e.g., PhD, MSc, BSc'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.experienceYears') || 'Years of Experience'}
                </label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterExperienceYears') || 'Enter years of experience'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.department') || 'Department'}
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterDepartment') || 'Enter department'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.officeLocation') || 'Office Location'}
                </label>
                <input
                  type="text"
                  name="office_location"
                  value={formData.office_location}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterOfficeLocation') || 'Enter office location'}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                {t('dashboard.consultationHours') || 'Consultation Hours'}
              </label>
              <input
                type="text"
                name="consultation_hours"
                value={formData.consultation_hours}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                placeholder={t('dashboard.enterConsultationHours') || 'e.g., Mon-Wed 9AM-12PM'}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover-lift hover-scale transition-all disabled:opacity-50 shadow-lg hover:shadow-primary/30 text-sm sm:text-base"
              >
                {isSubmitting ? (t('dashboard.saving') || 'Saving...') : (t('dashboard.save') || 'Save')}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 glass-card text-light-text rounded-lg font-medium hover-lift hover-scale transition-all border border-white/20 hover:border-white/40 text-sm sm:text-base"
              >
                {t('dashboard.cancel') || 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tutors Grid */}
      <div className="grid gap-4 sm:gap-6">
        {safeTutors.length > 0 ? safeTutors.map((tutor, index) => (
          <div 
            key={tutor?.id || index} 
            className="glass-card p-4 sm:p-6 hover-lift hover-glow-coral animate-scale-in glow-coral border border-white/20 hover:border-white/40 transition-all duration-300"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
                    <h3 className="text-lg sm:text-xl font-semibold text-light-text truncate">
                      {safeString(tutor?.name, 'Unknown Tutor')}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-light-text/60 truncate">
                      ID: {safeString(tutor?.tutor_id, 'N/A')}
                    </span>
                    <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(tutor?.status || 'active')}`}>
                      {safeString(tutor?.status, 'active')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-light-text/60 mb-3">
                {tutor?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-coral flex-shrink-0" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{safeString(tutor.email)}</span>
                  </span>
                )}
                {tutor?.specialization && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span>{safeString(tutor.specialization)}</span>
                  </span>
                )}
                {tutor?.qualification && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-color flex-shrink-0" />
                    <span>{safeString(tutor.qualification)}</span>
                  </span>
                )}
                {tutor?.experience_years && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 flex-shrink-0" />
                    <span>{tutor.experience_years} {t('dashboard.years') || 'years'}</span>
                  </span>
                )}
                {tutor?.department && (
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
                    <span className="hidden sm:inline">{safeString(tutor.department)}</span>
                    <span className="sm:hidden">{safeString(tutor.department, '').substring(0, 10)}...</span>
                  </span>
                )}
                {tutor?.office_location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                    <span className="hidden sm:inline">{safeString(tutor.office_location)}</span>
                    <span className="sm:hidden">Office</span>
                  </span>
                )}
                {tutor?.consultation_hours && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                    <span className="hidden sm:inline">{safeString(tutor.consultation_hours)}</span>
                    <span className="sm:hidden">Hours</span>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full pt-2 border-t border-white/10">
                <button 
                  onClick={() => startEdit(tutor)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary/20 to-coral/20 text-light-text rounded-lg hover-lift hover-scale transition-all duration-300 border border-primary/30 hover:border-primary/50 text-xs sm:text-sm flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{t('dashboard.edit') || 'Edit'}</span>
                </button>
                <button className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 glass-card text-amber-400 rounded-lg hover-lift hover-scale transition-all duration-300 border border-amber-400/30 hover:border-amber-400/50 hover:text-amber-300 text-xs sm:text-sm flex items-center justify-center gap-1">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{t('dashboard.deactivate') || 'Deactivate'}</span>
                  <span className="sm:hidden">{t('dashboard.deactivate') || 'Deactivate'}</span>
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="glass-card p-8 sm:p-12 text-center animate-fade-in-up">
            <User className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-light-text/20 mb-4" />
            <p className="text-base sm:text-lg text-light-text/60">
              {t('dashboard.noTutors') || 'No tutors found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorsSection;

