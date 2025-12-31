
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { contentApi } from '../../services/apiClient';

const TestimonialSection = () => {
  const { t, language } = useLanguage();
  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonial = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await contentApi.getHomeContent();
      const data = response.data.data;
      const testimonials = data.testimonials;
      
      if (testimonials.length > 0) {
        const item = testimonials[0];
        setTestimonial({
          quote: item.content,
          name: item.author || 'Anonymous',
          title: item.author_title || 'Student',
          image: item.image || '/placeholder/150/150'
        });
      } else {
        setTestimonial(null);
      }
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      setError(t('home.errorLoadingTestimonial'));
      setTestimonial(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonial();
  }, [t]);


  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-light-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4 px-4">
              {t('home.studentSuccess')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-text px-4">
              {t('home.testimonialDesc')}
            </p>
          </div>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-text mt-4">{t('home.loadingTestimonial')}</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-light-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4 px-4">
              {t('home.studentSuccess')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-text px-4">
              {t('home.testimonialDesc')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-text mb-4">{error}</p>
            <button
              onClick={fetchTestimonial}
              className="bg-primary text-light-text px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              {t('home.tryAgain')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonial) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-light-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4 px-4">
            {t('home.studentSuccess')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text px-4">
            {t('home.testimonialDesc')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-accent rounded-lg p-4 sm:p-6 md:p-8 shadow-sm hover-lift animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <blockquote className="text-base sm:text-lg text-text mb-4 sm:mb-6 leading-relaxed">
              "{testimonial.quote}"
            </blockquote>
            <div className={`flex flex-col sm:flex-row items-center sm:items-center ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-primary hover-scale mb-3 sm:mb-0"
              />
              <div className={`text-center sm:text-left ${language === 'ar' ? 'sm:mr-4 sm:text-right' : 'sm:ml-4'}`}>
                <div className="font-semibold text-primary text-sm sm:text-base">
                  {testimonial.name}
                </div>
                <div className="text-text text-xs sm:text-sm">
                  {testimonial.title}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;