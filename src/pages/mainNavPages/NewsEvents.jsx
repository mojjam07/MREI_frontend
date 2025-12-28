import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { contentApi } from '../../services/apiClient';
import SideNavigationLayout from '../../components/layout/SideNavigationLayout';

const NewsEvents = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ref: newsRef, animationClasses: newsAnimation } = useScrollAnimation();
  const { ref: eventsRef, animationClasses: eventsAnimation } = useScrollAnimation();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [newsResponse, eventsResponse] = await Promise.all([
        contentApi.getNews({ limit: 9 }),
        contentApi.getEvents({ limit: 9 })
      ]);
      
      // Transform news data
      const newsData = newsResponse.data.data.map(item => ({
        title: item.title,
        summary: item.content,
        date: item.created_at,
        image: item.image || '/placeholder/400/250',
        category: 'News'
      }));
      
      // Transform events data
      const eventsData = eventsResponse.data.data.map(item => ({
        title: item.title,
        summary: item.content,
        date: item.event_date,
        time: '10:00 AM', // Default time since API doesn't have time field
        location: 'University Campus', // Default location since API doesn't have location field
        category: 'Event'
      }));
      
      setNews(newsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching news and events:', error);
      setError('Failed to load news and events. Please try again later.');
      setNews([]);
      setEvents([]);
    } finally {
      setLoading(false);
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

  const formatEventDate = (dateString, timeString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    })} • ${timeString}`;
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
                  <p className="text-gray-500 mt-4">Loading latest news...</p>
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
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {news.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">No news available at the moment.</p>
                    </div>
                  ) : (
                    news.map((item, index) => (
                      <article key={index} className="bg-white rounded-lg shadow-lg hover-lift overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                              {item.category}
                            </span>
                            <time className="text-sm text-gray-500">
                              {formatDate(item.date)}
                            </time>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                            {item.summary}
                          </p>
                          <button className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors duration-300">
                            Read More →
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              )}

              {!loading && !error && news.length > 0 && (
                <div className="text-center mt-8">
                  <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-semibold">
                    {t('newsEvents.viewAllNews')}
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
                  <p className="text-gray-500 mt-4">Loading upcoming events...</p>
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
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {events.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">No events available at the moment.</p>
                    </div>
                  ) : (
                    events.map((event, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-lg hover-lift p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                            {event.category}
                          </span>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatEventDate(event.date, event.time)}
                            </div>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {event.summary}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location}
                        </div>
                        <button className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-semibold">
                          Register Now
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {!loading && !error && events.length > 0 && (
                <div className="text-center mt-8">
                  <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-semibold">
                    {t('newsEvents.viewAllEvents')}
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
                Stay Updated
              </h2>
              <p className="text-sm lg:text-base text-white/90 mb-6">
                Subscribe to our newsletter to receive the latest news, events, and announcements directly in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
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
