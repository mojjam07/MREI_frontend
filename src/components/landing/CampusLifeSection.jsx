import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../ui/Button';
import { API_ENDPOINTS } from '../../config';
import apiClient from '../../services/apiClient';

const CampusLifeSection = () => {
  const { t } = useLanguage();
  const [campusPhotos, setCampusPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampusPhotos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(API_ENDPOINTS.COMMUNICATION.HOME_CONTENT);
      const data = response.data.data;
      const photos = data.campus_life.map(item => item.image || '/api/placeholder/300/180');
      setCampusPhotos(photos);
    } catch (error) {
      console.error('Error fetching campus photos:', error);
      setError(t('home.errorLoadingCampusPhotos'));
      setCampusPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampusPhotos();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-tertiary mb-3 sm:mb-4 animate-fade-in-up px-4">
              {t('home.campusLife')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-tertiary animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
              {t('home.campusLifeDesc')}
            </p>
          </div>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-tertiary"></div>
            <p className="text-tertiary mt-4">{t('home.loadingCampusPhotos')}</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-tertiary mb-3 sm:mb-4 animate-fade-in-up px-4">
              {t('home.campusLife')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-tertiary animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
              {t('home.campusLifeDesc')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-tertiary mb-4">{error}</p>
            <button
              onClick={fetchCampusPhotos}
              className="bg-tertiary text-primary px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              {t('home.tryAgain')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-tertiary mb-3 sm:mb-4 animate-fade-in-up px-4">
            {t('home.campusLife')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-tertiary animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
            {t('home.campusLifeDesc')}
          </p>
        </div>

        {/* Modern Masonry-style Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {campusPhotos.map((photo, index) => (
            <div
              key={index}
              className={`relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer animate-scale-in ${
                index === 0 ? 'col-span-2 row-span-2' :
                index === 4 ? 'col-span-2 sm:col-span-1 lg:col-span-2' :
                ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className={`w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110 ${
                index === 0 ? 'h-64 sm:h-80 md:h-96' :
                index === 4 ? 'h-48 sm:h-48 md:h-64' :
                'h-40 sm:h-48 md:h-56'
              }`}
                style={{ backgroundImage: `url(${photo})` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs sm:text-sm font-medium">Campus Life</p>
                <p className="text-xs opacity-90 hidden sm:block">Explore our vibrant community</p>
              </div>

              {/* Corner Badge (for featured image) */}
              {index === 0 && (
                <div className="absolute top-3 right-3 bg-tertiary text-primary text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow-lg">
                  Featured
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="onblue" size="lg" className="w-full sm:w-auto">
            {t('home.campusGalleryBtn')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CampusLifeSection;