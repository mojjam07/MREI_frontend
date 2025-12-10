import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const RecentEventsGallery = () => {
  const { t } = useLanguage();
  return (
    <section className="py-10 bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4 animate-fade-in-up">
            {t('home.recentEventsTitle')}
          </h2>
          <p className="text-xl text-text animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('home.recentEventsDesc')}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Event 1 */}
          <div className="bg-light-text rounded-lg shadow-md overflow-hidden hover-lift animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <img src="/api/placeholder/400/250" alt="Annual Science Fair" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">Annual Science Fair</h3>
              <p className="text-text">Students showcased innovative projects in science and technology.</p>
            </div>
          </div>
          {/* Event 2 */}
          <div className="bg-light-text rounded-lg shadow-md overflow-hidden hover-lift animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <img src="/api/placeholder/400/250" alt="Cultural Festival" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">Cultural Festival</h3>
              <p className="text-text">A celebration of diverse cultures with performances and food stalls.</p>
            </div>
          </div>
          {/* Event 3 */}
          <div className="bg-light-text rounded-lg shadow-md overflow-hidden hover-lift animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <img src="/api/placeholder/400/250" alt="Guest Lecture Series" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">Guest Lecture Series</h3>
              <p className="text-text">Renowned experts shared insights on emerging trends in various fields.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentEventsGallery;
