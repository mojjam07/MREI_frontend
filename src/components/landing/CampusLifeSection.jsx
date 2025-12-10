import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../ui/Button';

const CampusLifeSection = () => {
  const { t } = useLanguage();
  const [campusPhotos, setCampusPhotos] = useState([]);

  useEffect(() => {
    const fetchCampusPhotos = async () => {
      try {
        const response = await fetch('/api/announcements/');
        const data = await response.json();
        const photos = data.filter(item => item.type === 'campus_life').map(item => item.image || '/api/placeholder/300/180');
        setCampusPhotos(photos.length > 0 ? photos : [
          '/api/placeholder/300/180',
          '/api/placeholder/300/180',
          '/api/placeholder/300/180',
          '/api/placeholder/300/180',
          '/api/placeholder/300/180',
          '/api/placeholder/300/180',
          '/api/placeholder/300/180',
          '/api/placeholder/300/180'
        ]);
      } catch (error) {
        console.error('Error fetching campus photos:', error);
        setCampusPhotos([
          '/api/placeholder/300/180',
          '/api/placeholder/300/180',
          '/api/placeholder/300/180',
          '/api/placeholder/300/180',
          '/api/placeholder/300/180',
          '/api/placeholder/300/180',
          '/api/placeholder/300/180',
          '/api/placeholder/300/180'
        ]);
      }
    };
    fetchCampusPhotos();
  }, []);

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-tertiary mb-4 animate-fade-in-up">
            {t('home.campusLife')}
          </h2>
          <p className="text-xl text-tertiary animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('home.campusLifeDesc')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {campusPhotos.map((photo, index) => (
            <div
              key={index}
              className="aspect-video bg-white bg-cover bg-center rounded-lg shadow-md hover:shadow-lg transition-shadow hover-scale animate-scale-in"
              style={{ backgroundImage: `url(${photo})`, animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>

        <div className="text-center">
          <Button variant="onblue" size="lg">
            View Campus Gallery
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CampusLifeSection;
