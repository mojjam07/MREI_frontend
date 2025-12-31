import React, { useState } from 'react';
import { safeArray } from '../../../../utils/dateUtils';

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

      {/* Edit Student Form */}
      {editingId && (
        <div className="bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg p-6 border border-white/10 shadow-xl shadow-primary/10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-6 bg-gradient-to-b from-primary to-coral rounded-full"></span>
            <h3 className="text-xl font-semibold text-light-text">
              {t('dashboard.editStudent') || 'Edit Student Profile'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.studentId') || 'Student ID'}
                </label>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterStudentId') || 'Enter student ID'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.dateOfBirth') || 'Date of Birth'}
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-light-text mb-1">
                {t('dashboard.address') || 'Address'}
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
                placeholder={t('dashboard.enterAddress') || 'Enter address'}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.emergencyContact') || 'Emergency Contact Name'}
                </label>
                <input
                  type="text"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterEmergencyContact') || 'Enter emergency contact name'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.emergencyPhone') || 'Emergency Phone'}
                </label>
                <input
                  type="text"
                  name="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterEmergencyPhone') || 'Enter emergency phone'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.program') || 'Program'}
                </label>
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterProgram') || 'Enter program'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.year') || 'Year'}
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <div className="flex flex-wrap items-center gap-4 text-sm text-light-text/60">
                    <span>{t('dashboard.email') || 'Email'}: {student?.email || 'N/A'}</span>
                    <span>{t('dashboard.program') || 'Program'}: {student?.program || 'N/A'}</span>
                    <span>{t('dashboard.year') || 'Year'}: {student?.year || 'N/A'}</span>
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
                  {student?.address && (
                    <p className="text-light-text/60 text-sm mt-2">
                      {t('dashboard.address') || 'Address'}: {student.address}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button 
                    onClick={() => startEdit(student)}
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

