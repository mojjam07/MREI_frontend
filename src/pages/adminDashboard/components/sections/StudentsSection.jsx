import React, { useState } from 'react';
import { safeArray } from '../../../../utils/dateUtils';
import { Edit2, X, Save, UserX, UserCheck } from 'lucide-react';

const StudentsSection = ({ t, students = [], studentProfilesLoading, updateStudent }) => {
  const safeStudents = safeArray(students);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    date_of_birth: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    program: '',
    year: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      student_id: student.student_id || '',
      date_of_birth: student.date_of_birth || '',
      address: student.address || '',
      emergency_contact: student.emergency_contact || '',
      emergency_phone: student.emergency_phone || '',
      program: student.program || '',
      year: student.year || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      student_id: '',
      date_of_birth: '',
      address: '',
      emergency_contact: '',
      emergency_phone: '',
      program: '',
      year: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateStudent(editingId, formData);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (studentProfilesLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card p-4 sm:p-6 animate-pulse-gentle"
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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center animate-fade-in-up">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full animate-pulse-gentle flex-shrink-0"></span>
            <span className="truncate">{t('dashboard.studentsManagement') || 'Students Management'}</span>
          </h2>
          <p className="text-sm sm:text-base text-light-text/80 hidden sm:block">
            {t('dashboard.studentsDescription') || 'Manage student profiles and information'}
          </p>
        </div>
      </div>

      {/* Edit Student Form */}
      {editingId && (
        <div className="glass-card p-4 sm:p-6 animate-fade-in-up hover-lift hover-glow-emerald">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
            <h3 className="text-lg sm:text-xl font-semibold text-primary-text">
              {t('dashboard.editStudent') || 'Edit Student Profile'}
            </h3>
            <button
              onClick={cancelEdit}
              className="ml-auto p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              aria-label="Cancel edit"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.studentId') || 'Student ID'}
                </label>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterStudentId') || 'Enter student ID'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.dateOfBirth') || 'Date of Birth'}
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                {t('dashboard.address') || 'Address'}
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary resize-vertical text-sm sm:text-base"
                placeholder={t('dashboard.enterAddress') || 'Enter address'}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.emergencyContact') || 'Emergency Contact Name'}
                </label>
                <input
                  type="text"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterEmergencyContact') || 'Enter emergency contact name'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.emergencyPhone') || 'Emergency Phone'}
                </label>
                <input
                  type="text"
                  name="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterEmergencyPhone') || 'Enter emergency phone'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.program') || 'Program'}
                </label>
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterProgram') || 'Enter program'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.year') || 'Year'}
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                >
                  <option value="">{t('dashboard.selectYear') || 'Select year'}</option>
                  <option value="1">{t('dashboard.year1') || 'Year 1'}</option>
                  <option value="2">{t('dashboard.year2') || 'Year 2'}</option>
                  <option value="3">{t('dashboard.year3') || 'Year 3'}</option>
                  <option value="4">{t('dashboard.year4') || 'Year 4'}</option>
                  <option value="5">{t('dashboard.year5') || 'Year 5'}</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover-lift hover-scale transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-emerald-500/30 glow-emerald flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    {t('dashboard.saving') || 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t('dashboard.save') || 'Save'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 sm:px-6 py-2 sm:py-3 glass-card text-primary-text rounded-lg font-medium hover-lift hover-scale transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center justify-center text-sm sm:text-base"
              >
                {t('dashboard.cancel') || 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Students Grid */}
      <div className="grid gap-4 sm:gap-6">
        {safeStudents.length > 0 ? (
          safeStudents.map((student, index) => (
            <div
              key={student.id || index}
              className="glass-card p-4 sm:p-6 hover-lift hover-glow-blue animate-scale-in glow-blue border border-white/20 hover:border-white/40 transition-all duration-300"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex flex-col">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full animate-pulse-gentle flex-shrink-0"></span>
                      <h3 className="text-lg sm:text-xl font-semibold text-primary-text truncate">
                        {student?.first_name || 'Unknown Student'}
                      </h3>
                    </div>
                    <p className="text-sm text-primary-text/80">ID: {student?.student_id || 'N/A'}</p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      (student?.status || 'active') === 'active'
                        ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {student?.status || 'active'}
                  </span>
                </div>

                {/* Quick Info - Always Visible */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-primary-text/60 mb-3">
                  <span className="flex items-center gap-1">
                    <span className="hidden sm:inline">{t('dashboard.email') || 'Email'}:</span>
                    <span className="sm:hidden">✉:</span>
                    {student?.email || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="hidden sm:inline">{t('dashboard.program') || 'Program'}:</span>
                    <span className="sm:hidden">📚:</span>
                    {student?.program || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="hidden sm:inline">{t('dashboard.year') || 'Year'}:</span>
                    <span className="sm:hidden">📅:</span>
                    {student?.year || 'N/A'}
                  </span>
                </div>

                {/* Expanded Content */}
                {expandedId === (student.id || index) && (
                  <div className="mb-3 p-3 bg-white/5 rounded-lg animate-fade-in">
                    {student?.address && (
                      <p className="text-xs sm:text-sm text-primary-text/80 mb-2">
                        <span className="font-medium">{t('dashboard.address') || 'Address'}:</span> {student.address}
                      </p>
                    )}
                    {student?.emergency_contact && (
                      <p className="text-xs sm:text-sm text-primary-text/80 mb-1">
                        <span className="font-medium">{t('dashboard.emergencyContact') || 'Emergency Contact'}:</span> {student.emergency_contact}
                      </p>
                    )}
                    {student?.emergency_phone && (
                      <p className="text-xs sm:text-sm text-primary-text/80">
                        <span className="font-medium">{t('dashboard.emergencyPhone') || 'Emergency Phone'}:</span> {student.emergency_phone}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 w-full pt-2 border-t border-white/10">
                  <button 
                    onClick={() => toggleExpand(student.id || index)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary/20 to-coral/20 text-primary-text rounded-lg hover-lift hover-scale transition-all duration-300 border border-primary/30 hover:border-primary/50 hover:bg-primary/30 text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    {expandedId === (student.id || index) ? (
                      <>
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{t('dashboard.showLess') || 'Show Less'}</span>
                        <span className="sm:hidden">Less</span>
                      </>
                    ) : (
                      <>
                        <span className="sm:hidden">More</span>
                        <span className="hidden sm:inline">{t('dashboard.moreInfo') || 'More Info'}</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => startEdit(student)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 rounded-lg hover-lift hover-scale transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{t('dashboard.edit') || 'Edit'}</span>
                  </button>
                  <button className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 glass-card text-rose-400 rounded-lg hover-lift hover-scale transition-all duration-300 border border-rose-400/30 hover:border-rose-400/50 hover:text-rose-300 text-xs sm:text-sm flex items-center justify-center gap-1">
                    {(student?.status || 'active') === 'active' ? (
                      <>
                        <UserX className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{t('dashboard.deactivate') || 'Deactivate'}</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{t('dashboard.activate') || 'Activate'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-8 sm:p-12 text-center animate-fade-in-up">
            <p className="text-base sm:text-lg text-primary-text/60">
              {t('dashboard.noStudents') || 'No students found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsSection;

