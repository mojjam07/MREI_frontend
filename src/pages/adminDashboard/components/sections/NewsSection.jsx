import React, { useState } from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';

const NewsSection = ({ t, news = [], createNews, updateNews, deleteNews }) => {
  const safeNews = safeArray(news);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: '',
    status: 'published',
    image_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

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
        await updateNews({ id: editingId, data: formData });
      } else {
        await createNews(formData);
      }
      setFormData({
        title: '',
        content: '',
        category: '',
        author: '',
        status: 'published',
        image_url: ''
      });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error submitting news:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (newsItem) => {
    setFormData({
      title: newsItem.title || '',
      content: newsItem.content || '',
      category: newsItem.category || '',
      author: newsItem.author || '',
      status: newsItem.status || 'published',
      image_url: newsItem.image_url || ''
    });
    setEditingId(newsItem.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('dashboard.confirmDelete') || 'Are you sure you want to delete this news item?')) {
      try {
        await deleteNews(id);
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 animate-fade-in-up">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full animate-pulse-gentle flex-shrink-0"></span>
            <span className="truncate">{t('dashboard.newsManagement') || 'News Management'}</span>
          </h2>
          <p className="text-sm sm:text-base text-light-text/80 animate-fade-in-up delay-100 hidden sm:block">
            {t('dashboard.newsDescription') || 'Manage university news and announcements'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium transition-all hover-lift hover-scale animate-bounce-in shadow-lg hover:shadow-primary/30 w-full sm:w-auto glow-coral flex items-center justify-center gap-2"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">{t('dashboard.cancel') || 'Cancel'}</span>
              <span className="xs:hidden">Close</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('dashboard.addNews') || 'Add News'}
            </>
          )}
        </button>
      </div>

      {/* Add News Form */}
      {showForm && (
        <div className="glass-card p-4 sm:p-6 animate-scale-in hover-lift hover-glow-amber">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full animate-pulse-gentle flex-shrink-0"></span>
            <h3 className="text-lg sm:text-xl font-semibold text-primary-text">
              {editingId ? (t('dashboard.updateNews') || 'Update News') : (t('dashboard.addNewNews') || 'Add New News')}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.title') || 'Title'} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300 text-sm sm:text-base"
                  placeholder={t('dashboard.enterTitle') || 'Enter news title'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.category') || 'Category'}
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm sm:text-base"
                  placeholder={t('dashboard.enterCategory') || 'Enter category'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.author') || 'Author'}
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300 text-sm sm:text-base"
                  placeholder={t('dashboard.enterAuthor') || 'Enter author name'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.imageUrl') || 'Image URL'}
                </label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm sm:text-base"
                  placeholder={t('dashboard.enterImageUrl') || 'Enter image URL'}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                {t('dashboard.content') || 'Content'} *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300 resize-vertical text-sm sm:text-base"
                placeholder={t('dashboard.enterContent') || 'Enter news content'}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.status') || 'Status'}
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm sm:text-base"
                >
                  <option value="published">{t('dashboard.published') || 'Published'}</option>
                  <option value="draft">{t('dashboard.draft') || 'Draft'}</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover-lift hover-scale transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-amber-500/30 glow-amber flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        {editingId ? (t('dashboard.updating') || 'Updating...') : (t('dashboard.creating') || 'Creating...')}
                      </>
                    ) : (
                      <>
                        {editingId ? <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                        {editingId ? (t('dashboard.updateNews') || 'Update News') : (t('dashboard.createNews') || 'Create News')}
                      </>
                    )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 sm:px-6 py-2 sm:py-3 glass-card text-primary-text rounded-lg font-medium hover-lift hover-scale transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center justify-center text-sm sm:text-base"
              >
                {t('dashboard.cancel') || 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* News Grid */}
      <div className="grid gap-4 sm:gap-6">
        {safeNews.length > 0 ? (
          safeNews.map((article, index) => (
            <div
              key={article.id || index}
              className="glass-card p-4 sm:p-6 hover-lift hover-glow-amber animate-scale-in glow-amber border border-white/20 hover:border-white/40 transition-all duration-300"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex flex-col">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
                      <h3 className="text-lg sm:text-xl font-semibold text-primary-text truncate">
                        {safeString(article.title, 'Untitled')}
                      </h3>
                    </div>
                    <p className="text-sm text-light-text/80 line-clamp-2">{safeString(article.content, 'No content')}</p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border animate-pulse-gentle flex-shrink-0 ${
                      article.status === 'published' || article.published
                        ? 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30'
                        : 'bg-amber-400/20 text-amber-400 border-amber-400/30'
                    }`}
                  >
                    {article.status || (article.published ? 'published' : 'draft')}
                  </span>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-light-text/60 mb-3">
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 text-xs animate-float flex-shrink-0">✎</span>
                    <span className="hidden sm:inline">{t('dashboard.author') || 'Author'}:</span>
                    <span className="sm:hidden">By:</span>
                    {safeString(article.author, 'Admin')}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-orange-400/20 flex items-center justify-center text-orange-400 text-xs animate-float flex-shrink-0">📅</span>
                    <span className="hidden sm:inline">{t('dashboard.date') || 'Date'}:</span>
                    <span className="sm:hidden">📆:</span>
                    {safeFormatDate(article.created_at)}
                  </span>
                </div>

                {/* Expand/Collapse Content */}
                {expandedId === (article.id || index) && (
                  <div className="mb-3 p-3 bg-white/5 rounded-lg animate-fade-in">
                    <p className="text-sm text-light-text/80">{safeString(article.content, 'No content available')}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 w-full pt-2 border-t border-white/10">
                  <button 
                    onClick={() => toggleExpand(article.id || index)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary/20 to-coral/20 text-primary-text rounded-lg hover-lift hover-scale transition-all duration-300 border border-primary/30 hover:border-primary/50 hover:bg-primary/30 text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    {expandedId === (article.id || index) ? (
                      <>
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{t('dashboard.showLess') || 'Show Less'}</span>
                        <span className="sm:hidden">Less</span>
                      </>
                    ) : (
                      <>
                        <span className="sm:hidden">More</span>
                        <span className="hidden sm:inline">{t('dashboard.readMore') || 'Read More'}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(article)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 rounded-lg hover-lift hover-scale transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{t('dashboard.edit') || 'Edit'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
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
          <div className="text-center py-8 sm:py-12 animate-fade-in-up">
            <div className="glass-card p-6 sm:p-8 max-w-sm mx-auto">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 animate-float">📰</div>
              <p className="text-base sm:text-lg text-light-text/60">
                {t('dashboard.noNews') || 'No news articles yet'}
              </p>
              <p className="text-xs sm:text-sm text-light-text/40 mt-2">
                {t('dashboard.createFirstNews') || 'Create your first news article to get started'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSection;
