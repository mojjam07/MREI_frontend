
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { contentApi } from '../../services/apiClient';

const NewsEventsSection = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('news');
  const [newsItems, setNewsItems] = useState([]);
  const [eventsItems, setEventsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomeContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch news and events separately
      const [newsResponse, eventsResponse] = await Promise.all([
        contentApi.getNews({ limit: 3 }),
        contentApi.getEvents({ limit: 3 })
      ]);
      
      const newsData = newsResponse.data.data?.news || [];
      const eventsData = eventsResponse.data.data?.events || [];
      
      setNewsItems(newsData.map(item => ({
        date: new Date(item.created_at).toLocaleDateString(),
        title: item.title,
        description: item.content,
        image: item.image || '/placeholder/400/250'
      })));
      
      setEventsItems(eventsData.map(item => ({
        date: new Date(item.event_date).toLocaleDateString(),
        title: item.title,
        details: item.description,
        videoId: 'dQw4w9WgXcQ' // default YouTube video
      })));
    } catch (error) {
      console.error('Error fetching home content:', error);
      setError(t('home.errorLoadingNewsEvents'));
      setNewsItems([]);
      setEventsItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);


  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4 px-4">
              {t('home.newsEventsTitle')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-text px-4">
              {t('home.newsEventsDesc')}
            </p>
          </div>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-text mt-4">{t('home.loadingNewsEvents')}</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4 px-4">
              {t('home.newsEventsTitle')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-text px-4">
              {t('home.newsEventsDesc')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-text mb-4">{t('home.errorLoadingNewsEvents')}</p>
            <button
              onClick={fetchHomeContent}
              className="bg-primary text-light-text px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              {t('home.tryAgain')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4 animate-fade-in-up px-4">
            {t('home.newsEventsTitle')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
            {t('home.newsEventsDesc')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className={`bg-tertiary rounded-lg p-1 shadow-sm w-full sm:w-auto ${language === 'ar' ? 'flex flex-row-reverse' : 'flex'}`}>
            <button
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'news'
                  ? 'bg-primary text-light-text'
                  : 'text-text hover:text-primary'
              }`}
              onClick={() => setActiveTab('news')}
            >
              {t('home.newsTab')}
            </button>
            <button
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'events'
                  ? 'bg-primary text-light-text'
                  : 'text-text hover:text-primary'
              }`}
              onClick={() => setActiveTab('events')}
            >
              {t('home.eventsTab')}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'news' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
            <ul className="space-y-6">
              {newsItems.map((item, index) => (
                <li key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6 ${language === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="flex-1 order-2 lg:order-1">
                      <span className="text-xs sm:text-sm text-primary font-medium">
                        {item.date}
                      </span>
                      <h4 className="text-base sm:text-lg font-semibold text-primary mt-2 mb-2">
                        <a href="#" className="hover:text-primary transition-colors">
                          {item.title}
                        </a>
                      </h4>
                      <p className="text-sm sm:text-base text-text">
                        {item.description}
                      </p>
                    </div>
                    <div className="w-full lg:w-1/3 order-1 lg:order-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-40 sm:h-48 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 sm:mt-8 text-center">
              <a href="#" className="text-sm sm:text-base text-primary hover:text-link-hover font-medium">
                {t('home.viewAllNews')}
              </a>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
            <ul className="space-y-6">
              {eventsItems.map((item, index) => (
                <li key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6 ${language === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="flex-1 order-2 lg:order-1">
                      <span className="text-xs sm:text-sm text-primary font-medium">
                        {item.date}
                      </span>
                      <h4 className="text-base sm:text-lg font-semibold text-primary mt-2 mb-2">
                        <a href="#" className="hover:text-primary transition-colors">
                          {item.title}
                        </a>
                      </h4>
                      <p className="text-sm sm:text-base text-text">
                        {item.details}
                      </p>
                    </div>
                    <div className="w-full lg:w-1/3 order-1 lg:order-2">
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${item.videoId}`}
                          title={item.title}
                          className="w-full h-full rounded-lg shadow-md"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 sm:mt-8 text-center">
              <a href="#" className="text-sm sm:text-base text-primary hover:text-link-hover font-medium">
                {t('home.viewAllEvents')}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsEventsSection;