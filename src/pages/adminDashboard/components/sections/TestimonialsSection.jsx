import React, { useState } from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';

const TestimonialsSection = ({ t, testimonials = [], testimonialsLoading, createTestimonial, updateTestimonial, deleteTestimonial }) => {
  const safeTestimonials = safeArray(testimonials);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    rating: 5,
    position: '',
    company: '',
    approved: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateTestimonial({ id: editingId, data: formData });
      } else {
        await createTestimonial(formData);
      }
      setFormData({
        name: '',
        content: '',
        rating: 5,
        position: '',
        company: '',
        approved: false
      });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving testimonial:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || item.student_name || '',
      content: item.content || '',
      rating: item.rating || 5,
      position: item.position || '',
      company: item.company || '',
      approved: item.approved || item.status === 'approved' || false
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('dashboard.confirmDelete') || 'Are you sure you want to delete this testimonial?')) {
      try {
        await deleteTestimonial(id);
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      content: '',
      rating: 5,
      position: '',
      company: '',
      approved: false
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getStatusColor = (testimonial) => {
    // Check both 'approved' (boolean from backend) and 'status' (string)
    const isApproved = testimonial.approved === true || testimonial.status === 'approved';
    return isApproved ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300';
  };

  const getStatusText = (testimonial) => {
    const isApproved = testimonial.approved === true || testimonial.status === 'approved';
    return isApproved ? (t('dashboard.approved') || 'Approved') : (t('dashboard.pending') || 'Pending');
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (testimonialsLoading) {
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
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 animate-fade-in-up">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
            <span className="truncate">{t('dashboard.testimonialsManagement') || 'Testimonials Management'}</span>
          </h2>
          <p className="text-sm sm:text-base text-light-text/80 hidden sm:block">
            {t('dashboard.testimonialsDescription') || 'Manage student and staff testimonials'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium transition-all hover:scale-105 hover-lift animate-bounce-in shadow-lg shadow-primary/30 text-sm sm:text-base"
        >
          {showForm ? (t('dashboard.cancel') || 'Cancel') : (t('dashboard.addTestimonial') || 'Add Testimonial')}
        </button>
      </div>

      {/* Add/Edit Testimonial Form */}
      {showForm && (
        <div className="glass-card p-4 sm:p-6 border border-white/10 animate-fade-in-up hover-glow-emerald">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
            <h3 className="text-base sm:text-lg font-semibold text-light-text">
              {editingId ? (t('dashboard.editTestimonial') || 'Edit Testimonial') : (t('dashboard.addNewTestimonial') || 'Add New Testimonial')}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.name') || 'Name'} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterName') || 'Enter name'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.rating') || 'Rating'}
                </label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.position') || 'Position'}
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterPosition') || 'Enter position'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.company') || 'Company'}
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterCompany') || 'Enter company'}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                {t('dashboard.content') || 'Content'} *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary resize-vertical text-sm sm:text-base"
                placeholder={t('dashboard.enterContent') || 'Enter testimonial content'}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="approved"
                id="approved"
                checked={formData.approved}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="approved" className="text-xs sm:text-sm font-medium text-light-text cursor-pointer">
                {t('dashboard.approved') || 'Approved'}
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 hover-lift hover-scale text-sm sm:text-base"
              >
                {isSubmitting ? (t('dashboard.saving') || 'Saving...') : editingId ? (t('dashboard.update') || 'Update') : (t('dashboard.create') || 'Create')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 glass-card text-light-text rounded-lg font-medium hover-lift hover-scale transition-all border border-white/20 hover:border-white/40 text-sm sm:text-base"
              >
                {t('dashboard.cancel') || 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="grid gap-4 sm:gap-6">
        {safeTestimonials.length > 0 ? (
          safeTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className="glass-card p-4 sm:p-6 hover-lift hover-glow-emerald animate-scale-in glow-emerald border border-white/20 hover:border-white/40 transition-all duration-300"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2 sm:mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
                    <h3 className="text-base sm:text-lg font-semibold text-light-text truncate">
                      {safeString(testimonial.name || testimonial.student_name, 'Anonymous')}
                    </h3>
                    <div className="hidden sm:block">{renderStars(testimonial.rating || 5)}</div>
                  </div>
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 rounded text-xs ${getStatusColor(testimonial)} flex-shrink-0`}
                  >
                    {getStatusText(testimonial)}
                  </span>
                </div>

                {/* Rating on mobile */}
                <div className="sm:hidden mb-2">
                  {renderStars(testimonial.rating || 5)}
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-light-text/80 mb-2 sm:mb-3 italic line-clamp-2">
                  "{safeString(testimonial.content, 'No content')}"
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 text-xs text-light-text/60 mb-2 sm:mb-3">
                  {(testimonial.position || testimonial.role) && (
                    <span className="flex items-center gap-1">
                      <span className="hidden sm:inline">{t('dashboard.role') || 'Role'}:</span>
                      <span className="sm:hidden">💼:</span>
                      {safeString(testimonial.position || testimonial.role, 'Student')}
                    </span>
                  )}
                  {testimonial.company && (
                    <span className="flex items-center gap-1">
                      <span className="hidden sm:inline">{t('dashboard.company') || 'Company'}:</span>
                      <span className="sm:hidden">🏢:</span>
                      {safeString(testimonial.company)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <span className="hidden sm:inline">{t('dashboard.date') || 'Date'}:</span>
                    <span className="sm:hidden">📅:</span>
                    {safeFormatDate(testimonial.created_at)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary/20 to-coral/20 text-light-text rounded-lg hover-lift hover-scale transition-all duration-300 border border-primary/30 hover:border-primary/50 text-xs sm:text-sm"
                  >
                    {t('dashboard.edit') || 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 glass-card text-error-color rounded-lg hover-lift hover-scale transition-all duration-300 border border-error-color/30 hover:border-error-color/50 hover:text-error-color/80 text-xs sm:text-sm"
                  >
                    {t('dashboard.delete') || 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-8 sm:p-12 text-center animate-fade-in-up">
            <p className="text-base sm:text-lg text-light-text/60">
              {t('dashboard.noTestimonials') || 'No testimonials yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsSection;

