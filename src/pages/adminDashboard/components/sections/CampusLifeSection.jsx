import React, { useState } from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';

const CampusLifeSection = ({ t, campusLife = [], campusLifeLoading, createCampusLife, updateCampusLife, deleteCampusLife }) => {
  const safeCampusLife = safeArray(campusLife);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateCampusLife({ id: editingId, data: formData });
      } else {
        await createCampusLife(formData);
      }
      setFormData({
        title: '',
        content: '',
        category: '',
        image_url: ''
      });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving campus life content:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || '',
      content: item.content || item.description || '',
      category: item.category || '',
      image_url: item.image_url || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('dashboard.confirmDelete') || 'Are you sure you want to delete this item?')) {
      try {
        await deleteCampusLife(id);
      } catch (error) {
        console.error('Error deleting campus life content:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      image_url: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  if (campusLifeLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border border-white/20 animate-pulse-gentle"
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
        <div>
          <h2 className="text-3xl font-bold text-light-text mb-2 flex items-center gap-3 animate-fade-in-up">
            <span className="w-1 h-8 bg-gradient-to-b from-primary to-coral rounded-full"></span>
            {t('dashboard.campusLifeManagement') || 'Campus Life Management'}
          </h2>
          <p className="text-light-text/80 animate-fade-in-up delay-100">
            {t('dashboard.campusLifeDescription') || 'Manage campus life content and activities'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium transition-all hover:scale-105 hover-lift animate-bounce-in shadow-lg shadow-primary/30 w-full md:w-auto"
        >
          {showForm ? (t('dashboard.cancel') || 'Cancel') : (t('dashboard.addContent') || 'Add Content')}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg p-6 border border-white/10 shadow-xl shadow-primary/10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-6 bg-gradient-to-b from-primary to-coral rounded-full"></span>
            <h3 className="text-xl font-semibold text-light-text">
              {editingId ? (t('dashboard.editContent') || 'Edit Content') : (t('dashboard.addNewContent') || 'Add New Content')}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.title') || 'Title'} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterTitle') || 'Enter title'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.category') || 'Category'}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{t('dashboard.selectCategory') || 'Select Category'}</option>
                  <option value="sports">{t('dashboard.sports') || 'Sports'}</option>
                  <option value="clubs">{t('dashboard.clubs') || 'Clubs'}</option>
                  <option value="facilities">{t('dashboard.facilities') || 'Facilities'}</option>
                  <option value="events">{t('dashboard.events') || 'Events'}</option>
                  <option value="achievements">{t('dashboard.achievements') || 'Achievements'}</option>
                </select>
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
                placeholder={t('dashboard.enterContent') || 'Enter content'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-light-text mb-1">
                {t('dashboard.imageUrl') || 'Image URL'}
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('dashboard.enterImageUrl') || 'Enter image URL'}
              />
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

      {/* Campus Life Grid */}
      <div className="grid gap-6">
        {safeCampusLife.length > 0 ? (
          safeCampusLife.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-accent-color/30 transition-all duration-300 hover-lift animate-fade-in-left"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-light-text mb-2">{safeString(item.title, 'Untitled')}</h3>
                  <p className="text-light-text/80 text-sm mb-3">{safeString(item.content || item.description, 'No content available')}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-light-text/60">
                    {item.category && (
                      <span>
                        {t('dashboard.category') || 'Category'}: {safeString(item.category, 'General')}
                      </span>
                    )}
                    <span>
                      {t('dashboard.date') || 'Date'}: {safeFormatDate(item.created_at)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.status === 'active' ? 'bg-success-color/20 text-success-color' : 'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {safeString(item.status, 'inactive')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-secondary-color/20 text-secondary-color rounded hover:bg-secondary-color/30 transition-colors"
                  >
                    {t('dashboard.edit') || 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-error-color/20 text-error-color rounded hover:bg-error-color/30 transition-colors"
                  >
                    {t('dashboard.delete') || 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 animate-fade-in-up">
            <p className="text-light-text/60 text-lg">{t('dashboard.noCampusLife') || 'No campus life content yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusLifeSection;

