import React, { useState } from 'react';
import { safeArray } from '../../../../utils/dateUtils';

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-light-text mb-2">
            {t('dashboard.tutorsManagement') || 'Tutors Management'}
          </h2>
          <p className="text-light-text/80">
            {t('dashboard.tutorsDescription') || 'Manage tutor profiles and information'}
          </p>
        </div>
      </div>

      {/* Edit Tutor Form */}
      {editingId && (
        <div className="bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg p-6 border border-white/10 shadow-xl shadow-primary/10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-6 bg-gradient-to-b from-primary to-coral rounded-full"></span>
            <h3 className="text-xl font-semibold text-light-text">
              {t('dashboard.editTutor') || 'Edit Tutor Profile'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.tutorId') || 'Tutor ID'}
                </label>
                <input
                  type="text"
                  name="tutor_id"
                  value={formData.tutor_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterTutorId') || 'Enter tutor ID'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.specialization') || 'Specialization'}
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterSpecialization') || 'Enter specialization'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.qualification') || 'Qualification'}
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterQualification') || 'e.g., PhD, MSc, BSc'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.experienceYears') || 'Years of Experience'}
                </label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterExperienceYears') || 'Enter years of experience'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.department') || 'Department'}
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterDepartment') || 'Enter department'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.officeLocation') || 'Office Location'}
                </label>
                <input
                  type="text"
                  name="office_location"
                  value={formData.office_location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterOfficeLocation') || 'Enter office location'}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-light-text mb-1">
                {t('dashboard.consultationHours') || 'Consultation Hours'}
              </label>
              <input
                type="text"
                name="consultation_hours"
                value={formData.consultation_hours}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('dashboard.enterConsultationHours') || 'e.g., Mon-Wed 9AM-12PM'}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-light-text rounded-lg font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (t('dashboard.saving') || 'Saving...') : (t('dashboard.save') || 'Save')}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg font-medium hover:bg-gray-500/30 transition-colors"
              >
                {t('dashboard.cancel') || 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tutors Grid */}
      <div className="grid gap-6">
        {safeTutors.length > 0 ? safeTutors.map((tutor, index) => (
          <div key={tutor?.id || index} className="bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-gradient-to-br hover:from-dark-gradient-start/80 hover:to-dark-gradient-end/80 hover-lift transition-all duration-300 shadow-xl shadow-primary/10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-light-text mb-2">{tutor?.name || 'Unknown Tutor'}</h3>
                <p className="text-light-text/80 text-sm mb-3">ID: {tutor?.tutor_id || 'N/A'}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-light-text/60">
                  <span>{t('dashboard.email') || 'Email'}: {tutor?.email || 'N/A'}</span>
                  <span>{t('dashboard.specialization') || 'Specialization'}: {tutor?.specialization || 'N/A'}</span>
                  <span>{t('dashboard.qualification') || 'Qualification'}: {tutor?.qualification || 'N/A'}</span>
                  <span>{t('dashboard.experience') || 'Experience'}: {tutor?.experience_years || '0'} {t('dashboard.years') || 'years'}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    (tutor?.status || 'active') === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {tutor?.status || 'active'}
                  </span>
                </div>
                {tutor?.department && (
                  <p className="text-light-text/60 text-sm mt-2">
                    {t('dashboard.department') || 'Department'}: {tutor.department}
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button 
                  onClick={() => startEdit(tutor)}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors"
                >
                  {t('dashboard.edit') || 'Edit'}
                </button>
                <button className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors">
                  {t('dashboard.deactivate') || 'Deactivate'}
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 animate-fade-in-up">
            <p className="text-light-text/60 text-lg">{t('dashboard.noTutors') || 'No tutors found'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorsSection;

