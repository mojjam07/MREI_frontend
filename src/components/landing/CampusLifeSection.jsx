import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../ui/Button';
import { contentApi } from '../../services/apiClient';

const CampusLifeSection = () => {
  const { t } = useLanguage();
  const [campusPhotos, setCampusPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampusPhotos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await contentApi.getCampusLife();
      const data = response.data.data?.campus_life || [];
      
      // Extract photos from the data, using fallback images if needed
      const photos = data.map(item => 
        item.image_url || 
        '/api/placeholder/300/180'
      );
      
      // If no photos available, use fallback images
      const fallbackPhotos = photos.length > 0 ? photos : [
        'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
      ];
      
      setCampusPhotos(fallbackPhotos);
    } catch (error) {
      console.error('Error fetching campus photos:', error);
      setError(t('home.errorLoadingCampusPhotos'));
      
      // Set fallback photos even on error to ensure UI has content
      const fallbackPhotos = [
        'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
      ];
      setCampusPhotos(fallbackPhotos);
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
            <p className="text-tertiary mb-4">{t('home.errorLoadingCampusPhotos')}</p>
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
                <p className="text-xs sm:text-sm font-medium">{t('home.campusLifeHover')}</p>
                <p className="text-xs opacity-90 hidden sm:block">{t('home.exploreCommunity')}</p>
              </div>

              {/* Corner Badge (for featured image) */}
              {index === 0 && (
                <div className="absolute top-3 right-3 bg-tertiary text-primary text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow-lg">
                  {t('home.featured')}
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