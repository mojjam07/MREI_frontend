import React, { useState } from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';

const NewsSection = ({ t, news = [], createNews }) => {
  const safeNews = safeArray(news);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: '',
    status: 'published',
    image_url: ''
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
      await createNews(formData);
      setFormData({
        title: '',
        content: '',
        category: '',
        author: '',
        status: 'published',
        image_url: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating news:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-light-text mb-2 animate-fade-in-up flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-primary to-coral rounded-full"></span>
            {t('dashboard.newsManagement') || 'News Management'}
          </h2>
          <p className="text-light-text/80 animate-fade-in-up delay-100">
            {t('dashboard.newsDescription') || 'Manage university news and announcements'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium transition-all hover:scale-105 hover-lift animate-bounce-in shadow-lg shadow-primary/30 w-full sm:w-auto"
        >
          {showForm ? (t('dashboard.cancel') || 'Cancel') : (t('dashboard.addNews') || 'Add News')}
        </button>
      </div>

      {/* Add News Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg p-6 border border-white/10 shadow-xl shadow-primary/10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-6 bg-gradient-to-b from-primary to-coral rounded-full"></span>
            <h3 className="text-xl font-semibold text-light-text">
              {t('dashboard.addNewNews') || 'Add New News'}
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
                  placeholder={t('dashboard.enterTitle') || 'Enter news title'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.category') || 'Category'}
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterCategory') || 'Enter category'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.author') || 'Author'}
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterAuthor') || 'Enter author name'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.imageUrl') || 'Image URL'}
                </label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterImageUrl') || 'Enter image URL'}
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
                placeholder={t('dashboard.enterContent') || 'Enter news content'}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.status') || 'Status'}
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="published">{t('dashboard.published') || 'Published'}</option>
                  <option value="draft">{t('dashboard.draft') || 'Draft'}</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (t('dashboard.creating') || 'Creating...') : (t('dashboard.createNews') || 'Create News')}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-white/10 text-light-text rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                {t('dashboard.cancel') || 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* News Grid */}
      <div className="grid gap-6">
        {safeNews.length > 0 ? (
          safeNews.map((article, index) => (
            <div
              key={article.id || index}
              className="bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg p-6 border border-white/10 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 hover-lift animate-fade-in-left group"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start mb-4 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary to-coral rounded-full group-hover:scale-y-110 transition-transform"></div>
                    <h3 className="text-xl font-semibold text-light-text">{safeString(article.title, 'Untitled')}</h3>
                  </div>
                  <p className="text-light-text/80 text-sm mb-3">{safeString(article.content, 'No content')}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-light-text/60">
                    <span className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✎</span>
                      {t('dashboard.author') || 'Author'}: {safeString(article.author, 'Admin')}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-coral/20 flex items-center justify-center text-coral text-xs">📅</span>
                      {t('dashboard.date') || 'Date'}: {safeFormatDate(article.created_at)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        article.status === 'published' || article.published 
                          ? 'bg-success-color/20 text-success-color' 
                          : 'bg-warning-color/20 text-warning-color'
                      }`}
                    >
                      {article.status || (article.published ? 'published' : 'draft')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 w-full lg:w-auto lg:ml-4 mt-4 lg:mt-0">
                  <button className="flex-1 lg:flex-none px-3 py-1 bg-gradient-to-r from-primary/20 to-coral/20 text-light-text rounded hover:from-primary/30 hover:to-coral/30 transition-all border border-primary/20 group-hover:border-primary/40">
                    {t('dashboard.edit') || 'Edit'}
                  </button>
                  <button className="flex-1 lg:flex-none px-3 py-1 bg-error-color/20 text-error-color rounded hover:bg-error-color/30 transition-colors border border-error-color/20">
                    {t('dashboard.delete') || 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 animate-fade-in-up">
            <p className="text-light-text/60 text-lg">{t('dashboard.noNews') || 'No news articles yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSection;
