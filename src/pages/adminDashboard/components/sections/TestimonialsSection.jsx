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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold text-light-text mb-2 flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-primary to-coral rounded-full"></span>
            {t('dashboard.testimonialsManagement') || 'Testimonials Management'}
          </h2>
          <p className="text-light-text/80">
            {t('dashboard.testimonialsDescription') || 'Manage student and staff testimonials'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium transition-all hover:scale-105 hover-lift animate-bounce-in shadow-lg shadow-primary/30 w-full md:w-auto"
        >
          {showForm ? (t('dashboard.cancel') || 'Cancel') : (t('dashboard.addTestimonial') || 'Add Testimonial')}
        </button>
      </div>

      {/* Add/Edit Testimonial Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg p-6 border border-white/10 shadow-xl shadow-primary/10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-6 bg-gradient-to-b from-primary to-coral rounded-full"></span>
            <h3 className="text-xl font-semibold text-light-text">
              {editingId ? (t('dashboard.editTestimonial') || 'Edit Testimonial') : (t('dashboard.addNewTestimonial') || 'Add New Testimonial')}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.name') || 'Name'} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterName') || 'Enter name'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.rating') || 'Rating'}
                </label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.position') || 'Position'}
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterPosition') || 'Enter position'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.company') || 'Company'}
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterCompany') || 'Enter company'}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-light-text mb-1">
                {t('dashboard.content') || 'Content'} *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
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
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
              />
              <label htmlFor="approved" className="text-sm font-medium text-light-text">
                {t('dashboard.approved') || 'Approved'}
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (t('dashboard.saving') || 'Saving...') : editingId ? (t('dashboard.update') || 'Update') : (t('dashboard.create') || 'Create')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-white/10 text-light-text rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                {t('dashboard.cancel') || 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="grid gap-6">
        {safeTestimonials.length > 0 ? (
          safeTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className="bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg p-6 border border-white/10 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 hover-lift group"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start mb-4 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary to-coral rounded-full group-hover:scale-y-110 transition-transform"></div>
                    <h3 className="text-xl font-semibold text-light-text">
                      {safeString(testimonial.name || testimonial.student_name, 'Anonymous')}
                    </h3>
                    {renderStars(testimonial.rating || 5)}
                  </div>
                  <p className="text-light-text/80 text-sm mb-3 italic">
                    "{safeString(testimonial.content, 'No content')}"
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-light-text/60">
                    {(testimonial.position || testimonial.role) && (
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">💼</span>
                        {t('dashboard.role') || 'Role'}: {safeString(testimonial.position || testimonial.role, 'Student')}
                      </span>
                    )}
                    {testimonial.company && (
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-secondary-color/20 flex items-center justify-center text-secondary-color text-xs">🏢</span>
                        {t('dashboard.company') || 'Company'}: {safeString(testimonial.company)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-coral/20 flex items-center justify-center text-coral text-xs">📅</span>
                      {t('dashboard.date') || 'Date'}: {safeFormatDate(testimonial.created_at)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(testimonial)}`}
                    >
                      {getStatusText(testimonial)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 w-full lg:w-auto lg:ml-4">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="flex-1 lg:flex-none px-3 py-1 bg-gradient-to-r from-primary/20 to-coral/20 text-light-text rounded hover:from-primary/30 hover:to-coral/30 transition-all border border-primary/20 group-hover:border-primary/40"
                  >
                    {t('dashboard.edit') || 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="flex-1 lg:flex-none px-3 py-1 bg-error-color/20 text-error-color rounded hover:bg-error-color/30 transition-colors border border-error-color/20"
                  >
                    {t('dashboard.delete') || 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 animate-fade-in-up">
            <p className="text-light-text/60 text-lg">
              {t('dashboard.noTestimonials') || 'No testimonials yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsSection;

