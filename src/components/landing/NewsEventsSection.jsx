import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const NewsEventsSection = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('news');
  const [newsItems, setNewsItems] = useState([]);
  const [eventsItems, setEventsItems] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcements/');
        const data = await response.json();
        // Assuming announcements have type: 'news' or 'event'
        const news = data.filter(item => item.type === 'news' || !item.type);
        const events = data.filter(item => item.type === 'event');
        setNewsItems(news.map(item => ({
          date: new Date(item.created_at).toLocaleDateString(),
          title: item.title,
          description: item.content,
          image: item.image || '/api/placeholder/400/250'
        })));
        setEventsItems(events.map(item => ({
          date: new Date(item.created_at).toLocaleDateString(),
          title: item.title,
          details: item.content,
          videoId: item.video_id || 'dQw4w9WgXcQ'
        })));
      } catch (error) {
        console.error('Error fetching announcements:', error);
        // Fallback to hardcoded values
        setNewsItems([
          {
            date: 'May 10, 2025',
            title: 'Hillside University Receives $5M Grant for Renewable Energy Research',
            description: 'The Department of Energy awarded the grant to support innovative solar technology development.',
            image: '/api/placeholder/400/250'
          },
          {
            date: 'May 7, 2025',
            title: 'Professor Jane Smith Named National Academy Member',
            description: 'The distinguished faculty member was recognized for his pioneering work in quantum physics.',
            image: '/api/placeholder/400/250'
          },
          {
            date: 'May 3, 2025',
            title: 'Hillside Launches New Community Partnership Initiative',
            description: 'The program will connect students with local organizations for service-learning opportunities.',
            image: '/api/placeholder/400/250'
          }
        ]);
        setEventsItems([
          {
            date: 'May 15, 2025',
            title: 'Spring Commencement Ceremony',
            details: '10:00 AM - Main Campus Stadium',
            videoId: 'dQw4w9WgXcQ'
          },
          {
            date: 'May 20, 2025',
            title: 'Faculty Research Symposium',
            details: '1:00 PM - Science Center Auditorium',
            videoId: 'dQw4w9WgXcQ'
          },
          {
            date: 'May 25, 2025',
            title: 'Alumni Weekend',
            details: 'Various locations across campus',
            videoId: 'dQw4w9WgXcQ'
          }
        ]);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4 animate-fade-in-up">{t('home.newsEventsTitle')}</h2>
          <p className="text-xl text-text animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{t('home.newsEventsDesc')}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className={`bg-tertiary rounded-lg p-1 shadow-sm ${language === 'ar' ? 'flex flex-row-reverse' : ''}`}>
            <button
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'news'
                  ? 'bg-primary text-light-text'
                  : 'text-text hover:text-primary'
              }`}
              onClick={() => setActiveTab('news')}
            >
              {t('home.newsTab')}
            </button>
            <button
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
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
          <div className="bg-white rounded-lg shadow-sm p-8">
            <ul className="space-y-6">
              {newsItems.map((item, index) => (
                <li key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 ${language === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="flex-1">
                      <span className="text-sm text-primary font-medium">{item.date}</span>
                      <h4 className="text-lg font-semibold text-primary mt-2 mb-2">
                        <a href="#" className="hover:text-primary transition-colors">{item.title}</a>
                      </h4>
                      <p className="text-text">{item.description}</p>
                    </div>
                    <div className="lg:w-1/3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-center">
              <a href="#" className="text-primary hover:text-link-hover font-medium">{t('home.viewAllNews')}</a>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <ul className="space-y-6">
              {eventsItems.map((item, index) => (
                <li key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 ${language === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="flex-1">
                      <span className="text-sm text-primary font-medium">{item.date}</span>
                      <h4 className="text-lg font-semibold text-primary mt-2 mb-2">
                        <a href="#" className="hover:text-primary transition-colors">{item.title}</a>
                      </h4>
                      <p className="text-text">{item.details}</p>
                    </div>
                    <div className="lg:w-1/3">
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
            <div className="mt-8 text-center">
              <a href="#" className="text-primary hover:text-link-hover font-medium">View All Events →</a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsEventsSection;
