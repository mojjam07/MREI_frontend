import React, { useState } from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';
import { Edit2, X, Trash2, Image, FolderOpen, Calendar, Plus, MessageSquare } from 'lucide-react';

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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'sports':
        return 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30';
      case 'clubs':
        return 'bg-blue-400/20 text-blue-400 border border-blue-400/30';
      case 'facilities':
        return 'bg-purple-400/20 text-purple-400 border border-purple-400/30';
      case 'events':
        return 'bg-amber-400/20 text-amber-400 border border-amber-400/30';
      case 'achievements':
        return 'bg-coral/20 text-coral border border-coral/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const categories = [
    { value: 'sports', label: t('dashboard.sports') || 'Sports' },
    { value: 'clubs', label: t('dashboard.clubs') || 'Clubs' },
    { value: 'facilities', label: t('dashboard.facilities') || 'Facilities' },
    { value: 'events', label: t('dashboard.events') || 'Events' },
    { value: 'achievements', label: t('dashboard.achievements') || 'Achievements' }
  ];

  if (campusLifeLoading) {
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
            <span className="truncate">{t('dashboard.campusLifeManagement') || 'Campus Life Management'}</span>
          </h2>
          <p className="text-sm sm:text-base text-light-text/80 hidden sm:block">
            {t('dashboard.campusLifeDescription') || 'Manage campus life content and activities'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover-lift hover-scale transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{t('dashboard.cancel') || 'Cancel'}</span>
              <span className="sm:hidden">Close</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('dashboard.addContent') || 'Add Content'}
            </>
          )}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="glass-card p-4 sm:p-6 animate-fade-in-up hover-lift hover-glow-rose">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
            <h3 className="text-lg sm:text-xl font-semibold text-light-text">
              {editingId ? (t('dashboard.editContent') || 'Edit Content') : (t('dashboard.addNewContent') || 'Add New Content')}
            </h3>
            <button
              onClick={handleCancel}
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
                  {t('dashboard.title') || 'Title'} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterTitle') || 'Enter title'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.category') || 'Category'}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                >
                  <option value="">{t('dashboard.selectCategory') || 'Select Category'}</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
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
                placeholder={t('dashboard.enterContent') || 'Enter content'}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                {t('dashboard.imageUrl') || 'Image URL'}
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                placeholder={t('dashboard.enterImageUrl') || 'Enter image URL'}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover-lift hover-scale transition-all disabled:opacity-50 shadow-lg hover:shadow-primary/30 text-sm sm:text-base"
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

      {/* Campus Life Grid */}
      <div className="grid gap-4 sm:gap-6">
        {safeCampusLife.length > 0 ? (
          safeCampusLife.map((item, index) => (
            <div
              key={item.id || index}
              className="glass-card p-4 sm:p-6 hover-lift hover-glow-rose animate-scale-in glow-rose border border-white/20 hover:border-white/40 transition-all duration-300"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
                      <h3 className="text-lg sm:text-xl font-semibold text-light-text truncate">
                        {safeString(item.title, 'Untitled')}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {item.category && (
                        <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(item.category)}`}>
                          <FolderOpen className="w-3 h-3" />
                          {safeString(item.category, 'General')}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {safeString(item.status, 'inactive')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Preview */}
                <p className="text-sm sm:text-base text-light-text/80 mb-3 line-clamp-2">
                  {safeString(item.content || item.description, 'No content available')}
                </p>

                {/* Footer Info */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-light-text/60 mb-3">
                  {item.created_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-coral flex-shrink-0" />
                      <span className="hidden sm:inline">{t('dashboard.date') || 'Date'}:</span>
                      <span className="sm:hidden">📅:</span>
                      {safeFormatDate(item.created_at)}
                    </span>
                  )}
                  {item.image_url && (
                    <span className="flex items-center gap-1 text-blue-400">
                      <Image className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="hidden sm:inline">{t('dashboard.hasImage') || 'Has Image'}</span>
                      <span className="sm:hidden">IMG</span>
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary/20 to-coral/20 text-light-text rounded-lg hover-lift hover-scale transition-all duration-300 border border-primary/30 hover:border-primary/50 text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{t('dashboard.edit') || 'Edit'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 glass-card text-rose-400 rounded-lg hover-lift hover-scale transition-all duration-300 border border-rose-400/30 hover:border-rose-400/50 hover:text-rose-300 text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{t('dashboard.delete') || 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-8 sm:p-12 text-center animate-fade-in-up">
            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-light-text/20 mb-4" />
            <p className="text-base sm:text-lg text-light-text/60">
              {t('dashboard.noCampusLife') || 'No campus life content yet'}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover-lift transition-all shadow-lg hover:shadow-primary/30"
            >
              {t('dashboard.createFirstContent') || 'Create your first content'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusLifeSection;

