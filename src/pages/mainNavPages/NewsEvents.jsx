import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { contentApi } from '../../services/apiClient';
import SideNavigationLayout from '../../components/layout/SideNavigationLayout';

// Helper function to extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper function to determine event status based on date
const getEventStatus = (eventDate) => {
  const now = new Date();
  const event = new Date(eventDate);
  return event >= now ? 'upcoming' : 'past';
};

const NewsEvents = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ref: newsRef, animationClasses: newsAnimation } = useScrollAnimation();
  const { ref: eventsRef, animationClasses: eventsAnimation } = useScrollAnimation();
  
  // Pagination states
  const [newsPagination, setNewsPagination] = useState({ page: 1, pages: 1, limit: 9 });
  const [eventsPagination, setEventsPagination] = useState({ page: 1, pages: 1, limit: 9 });
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchNews = async (page = 1, append = false) => {
    try {
      const response = await contentApi.getNews({ page, limit: newsPagination.limit });
      const { news: newsData, pagination } = response.data.data;
      
      if (append) {
        setNews(prev => [...prev, ...newsData]);
      } else {
        setNews(newsData || []);
      }
      
      setNewsPagination(prev => ({
        ...prev,
        page: pagination.page,
        pages: pagination.pages
      }));
      
      return pagination;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  };

  const fetchEvents = async (page = 1, append = false) => {
    try {
      const response = await contentApi.getEvents({ page, limit: eventsPagination.limit });
      const { events: eventsData, pagination } = response.data.data;
      
      if (append) {
        setEvents(prev => [...prev, ...eventsData]);
      } else {
        setEvents(eventsData || []);
      }
      
      setEventsPagination(prev => ({
        ...prev,
        page: pagination.page,
        pages: pagination.pages
      }));
      
      return pagination;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchNews(1, false),
        fetchEvents(1, false)
      ]);
    } catch (error) {
      console.error('Error fetching news and events:', error);
      setError('Failed to load news and events. Please try again later.');
      setNews([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNews = async () => {
    if (loadingMore || newsPagination.page >= newsPagination.pages) return;
    
    try {
      setLoadingMore(true);
      await fetchNews(newsPagination.page + 1, true);
    } catch (error) {
      console.error('Error loading more news:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMoreEvents = async () => {
    if (loadingMore || eventsPagination.page >= eventsPagination.pages) return;
    
    try {
      setLoadingMore(true);
      await fetchEvents(eventsPagination.page + 1, true);
    } catch (error) {
      console.error('Error loading more events:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tabs = [
    { id: 'news', label: t('newsEvents.latestNewsTitle'), icon: '📰' },
    { id: 'events', label: t('newsEvents.upcomingEventsTitle'), icon: '📅' }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <SideNavigationLayout>
        {/* Content Header */}
        <div className="bg-white border-b border-gray-200 p-6 lg:p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
              {t('newsEvents.title')}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {t('newsEvents.subtitle')}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-300
                    ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* News Section */}
        {activeTab === 'news' && (
          <section ref={newsRef} className="py-8 lg:py-12">
            <div className="max-w-6xl mx-auto px-4 lg:px-8">
              <div className={`text-center mb-8 lg:mb-12 ${newsAnimation}`}>
                <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                  {t('newsEvents.latestNewsTitle')}
                </h2>
                <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                  {t('newsEvents.latestNewsDesc')}
                </p>
              </div>

              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-gray-500 mt-4">{t('common.loading') || 'Loading...'}</p>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                      onClick={fetchData}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {t('home.tryAgain') || 'Try Again'}
                    </button>
                  </div>
                </div>
              )}

              {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {news.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">{t('newsEvents.noNewsAvailable')}</p>
                    </div>
                  ) : (
                    news.map((item, index) => (
                      <article key={`${item.id}-${index}`} className="bg-white rounded-lg shadow-lg hover-lift overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9">
                          <img 
                            src={item.image || '/placeholder/400/250'} 
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                              {item.category || 'News'}
                            </span>
                            <time className="text-sm text-gray-500">
                              {formatDate(item.created_at)}
                            </time>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                            {item.content}
                          </p>
                          <button className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors duration-300">
                            {t('newsEvents.readMore') || 'Read More'} →
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              )}

              {!loading && !error && news.length > 0 && newsPagination.page < newsPagination.pages && (
                <div className="text-center mt-8">
                  <button 
                    onClick={loadMoreNews}
                    disabled={loadingMore}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? 'Loading...' : (t('newsEvents.viewMoreNews') || 'View More News')}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Events Section */}
        {activeTab === 'events' && (
          <section ref={eventsRef} className="py-8 lg:py-12">
            <div className="max-w-6xl mx-auto px-4 lg:px-8">
              <div className={`text-center mb-8 lg:mb-12 ${eventsAnimation}`}>
                <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                  {t('newsEvents.upcomingEventsTitle')}
                </h2>
                <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                  {t('newsEvents.upcomingEventsDesc')}
                </p>
              </div>

              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-gray-500 mt-4">{t('common.loading') || 'Loading...'}</p>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                      onClick={fetchData}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {t('home.tryAgain') || 'Try Again'}
                    </button>
                  </div>
                </div>
              )}

              {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {events.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">{t('newsEvents.noEventsAvailable')}</p>
                    </div>
                  ) : (
                    events.map((event, index) => {
                      // Support both videoId field and video_url field (for compatibility)
                      const videoId = event.videoId || getYouTubeVideoId(event.video_url);
                      const status = getEventStatus(event.event_date);
                      
                      return (
                        <div key={`${event.id}-${index}`} className="bg-white rounded-lg shadow-lg hover-lift overflow-hidden">
                          {videoId ? (
                            <div className="aspect-w-16 aspect-h-9">
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={event.title}
                                className="w-full h-48 object-cover"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : event.image ? (
                            <div className="aspect-w-16 aspect-h-9">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-48 object-cover"
                              />
                            </div>
                          ) : null}
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {status === 'upcoming' ? t('newsEvents.upcoming') : t('newsEvents.past')}
                              </span>
                              {videoId && (
                                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                  </svg>
                                  {t('newsEvents.videoAvailable')}
                                </span>
                              )}
                            </div>
                            {event.organizer && (
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{t('newsEvents.organizer')}: {event.organizer}</span>
                              </div>
                            )}
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                              {event.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                              {event.description}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {event.location || 'University Campus'}
                            </div>
                            <button className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-semibold">
                              {t('newsEvents.viewDetails') || 'View Details'}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {!loading && !error && events.length > 0 && eventsPagination.page < eventsPagination.pages && (
                <div className="text-center mt-8">
                  <button 
                    onClick={loadMoreEvents}
                    disabled={loadingMore}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? 'Loading...' : (t('newsEvents.viewMoreEvents') || 'View More Events')}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Newsletter Subscription Section */}
        <section className="py-8 lg:py-12">
          <div className="max-w-4xl mx-auto px-4 lg:px-8">
            <div className="bg-gradient-to-r from-primary to-accent text-white p-8 lg:p-12 rounded-lg shadow-xl text-center">
              <h2 className="text-xl lg:text-2xl font-bold mb-4">
                {t('newsEvents.newsletterTitle')}
              </h2>
              <p className="text-sm lg:text-base text-white/90 mb-6">
                {t('newsEvents.newsletterDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder={t('newsEvents.newsletterPlaceholder')}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="bg-white text-primary px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-semibold whitespace-nowrap">
                  {t('newsEvents.subscribeNewsletter')}
                </button>
              </div>
            </div>
          </div>
        </section>
    </SideNavigationLayout>
  );
};

export default NewsEvents;

