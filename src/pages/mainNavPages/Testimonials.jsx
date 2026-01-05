import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import SideNavigationLayout from '../../components/layout/SideNavigationLayout';
import { contentApi } from '../../services/apiClient';

const Testimonials = () => {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref: featuredRef, animationClasses: featuredAnimation } = useScrollAnimation();

  // Fallback testimonials from translations (used when API fails)
  const fallbackTestimonials = t('testimonials.featuredTestimonials') || [];

  // Fetch testimonials from backend API
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      
      // Fetch all testimonials (limit: 0 or 'all' returns all approved testimonials)
      const response = await contentApi.getTestimonials({ limit: 0 });
      const data = response.data.data;
      const testimonialsData = data.testimonials;
      
      if (testimonialsData && testimonialsData.length > 0) {
        // Map API data to component format (matching DB field names)
        const items = testimonialsData.map(item => ({
          id: item.id,
          name: item.name || 'Anonymous',
          quote: item.content || item.quote || '',
          role: item.position || item.role || 'Student',
          company: item.company || '',
          rating: item.rating || 5,
          image: item.image || 'https://res.cloudinary.com/doi8mindp/image/upload/v1767270351/logo2_h07cix.png'
        }));
        setTestimonials(items);
      } else {
        // Use fallback data when no API data available
        setTestimonials(fallbackTestimonials);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      // Use fallback data on error
      setTestimonials(fallbackTestimonials);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [t]);

  // Loading state
  if (loading) {
    return (
      <SideNavigationLayout>
        <div className="bg-white border-b border-gray-200 p-6 lg:p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
              {t('testimonials.title')}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {t('testimonials.subtitle')}
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SideNavigationLayout>
    );
  }

  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

  const categoryStats = [
    {
      title: t('testimonials.studentTestimonialsTitle'),
      description: t('testimonials.studentTestimonialsDesc'),
      icon: '🎓',
      count: '150+'
    },
    {
      title: t('testimonials.alumniStoriesTitle'),
      description: t('testimonials.alumniStoriesDesc'),
      icon: '🏆',
      count: '200+'
    },
    {
      title: t('testimonials.successCasesTitle'),
      description: t('testimonials.successCasesDesc'),
      icon: '💼',
      count: '75+'
    }
  ];

  return (
    <SideNavigationLayout>
        {/* Content Header */}
        <div className="bg-white border-b border-gray-200 p-6 lg:p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
              {t('testimonials.title')}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {t('testimonials.subtitle')}
            </p>
          </div>
        </div>

        {/* Category Stats Section - moved after header */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {categoryStats.map((category, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg shadow-sm">
                  <div className="text-3xl lg:text-4xl mb-2">{category.icon}</div>
                  <div className="text-xl lg:text-2xl font-bold text-accent">{category.count}</div>
                  <h3 className="text-sm lg:text-base font-bold text-primary">{category.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Testimonials Section */}
        <section ref={featuredRef} className="pb-8 lg:pb-12">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className={`text-center mb-8 lg:mb-12 ${featuredAnimation}`}>
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                {t('testimonials.impactInNumbersTitle')}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                {t('testimonials.impactInNumbersDesc')}
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {displayedTestimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg hover-lift p-6 lg:p-8">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-primary font-semibold">{testimonial.role}</p>
                      <p className="text-xs text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 text-sm lg:text-base leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="mt-4 flex text-accent">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current text-tertiary" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {!showAll && testimonials.length > 3 && (
              <div className="text-center mt-8">
                <button 
                  onClick={() => setShowAll(true)}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-semibold"
                >
                  {t('testimonials.loadMore')}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Success Metrics Section */}
        <section className="py-8 lg:py-12">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-primary to-accent text-white p-8 lg:p-12 rounded-lg shadow-xl">
              <h2 className="text-xl lg:text-2xl font-bold mb-6">
                {t('testimonials.successMetricsTitle')}
              </h2>
              <p className="text-sm lg:text-base text-white/90 mb-8">
                {t('testimonials.successMetricsDesc')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">98%</div>
                  <div className="text-sm text-white/80">{t('testimonials.metrics.studentSatisfaction')}</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">95%</div>
                  <div className="text-sm text-white/80">{t('testimonials.metrics.careerAdvancement')}</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">92%</div>
                  <div className="text-sm text-white/80">{t('testimonials.metrics.wouldRecommend')}</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">89%</div>
                  <div className="text-sm text-white/80">{t('testimonials.metrics.higherEarnings')}</div>
                </div>
              </div>

              <button className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-semibold">
                {t('testimonials.shareYourStory')}
              </button>
            </div>
          </div>
        </section>
    </SideNavigationLayout>
  );
};

export default Testimonials;
