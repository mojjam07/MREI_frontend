import React from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';

const NewsSection = ({ t, news = [] }) => {
  const safeNews = safeArray(news);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-light-text mb-2 animate-fade-in-up">
            {t('dashboard.newsManagement') || 'News Management'}
          </h2>
          <p className="text-light-text/80 animate-fade-in-up delay-100">
            {t('dashboard.newsDescription') || 'Manage university news and announcements'}
          </p>
        </div>
        <button className="px-6 py-3 bg-primary text-light-text rounded-lg font-medium transition-all hover:scale-105 hover-lift animate-bounce-in w-full sm:w-auto">
          {t('dashboard.addNews') || 'Add News'}
        </button>
      </div>

      {/* News Grid */}
      <div className="grid gap-6">
        {safeNews.length > 0 ? (
          safeNews.map((article, index) => (
            <div
              key={article.id || index}
              className="bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-accent-color/30 transition-all duration-300 hover-lift animate-fade-in-left"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start mb-4 gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-light-text mb-2">{safeString(article.title, 'Untitled')}</h3>
                  <p className="text-light-text/80 text-sm mb-3">{safeString(article.content, 'No content')}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-light-text/60">
                    <span>
                      {t('dashboard.author') || 'Author'}: {safeString(article.author, 'Admin')}
                    </span>
                    <span>
                      {t('dashboard.date') || 'Date'}: {safeFormatDate(article.created_at)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        article.status === 'published' ? 'bg-success-color/20 text-success-color' : 'bg-warning-color/20 text-warning-color'
                      }`}
                    >
                      {safeString(article.status, 'draft')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 w-full lg:w-auto lg:ml-4 mt-4 lg:mt-0">
                  <button className="flex-1 lg:flex-none px-3 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors">
                    {t('dashboard.edit') || 'Edit'}
                  </button>
                  <button className="flex-1 lg:flex-none px-3 py-1 bg-error-color/20 text-error-color rounded hover:bg-error-color/30 transition-colors">
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
