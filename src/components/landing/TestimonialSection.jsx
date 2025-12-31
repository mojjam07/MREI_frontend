import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { contentApi } from '../../services/apiClient';

const TestimonialSection = () => {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback testimonial data (single testimonial for fallback)
  const fallbackTestimonial = [{
    quote: t('home.testimonialQuote'),
    name: t('home.testimonialName'),
    title: t('home.testimonialTitle'),
    image: t('home.testimonialImage'),
    rating: 5
  }];

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      
      // Fetch testimonials from the testimonials endpoint with limit=3
      const response = await contentApi.getTestimonials({ limit: 3 });
      const data = response.data.data;
      const testimonialsData = data.testimonials;
      
      if (testimonialsData && testimonialsData.length > 0) {
        const items = testimonialsData.slice(0, 1).map(item => ({
          quote: item.content,
          name: item.student_name || 'Anonymous',
          title: item.position || item.company || 'Student',
          image: item.image || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          rating: item.rating || 5
        }));
        setTestimonials(items);
      } else {
        // Use fallback data when no API data available
        setTestimonials(fallbackTestimonial);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Use fallback data on error
      setTestimonials(fallbackTestimonial);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
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
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center justify-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

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

        <div className="max-w-2xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-accent rounded-lg p-4 sm:p-6 shadow-sm hover-lift animate-scale-in"
            >
              {renderStars(testimonial.rating)}
              <blockquote className="text-base sm:text-lg text-text mb-4 leading-relaxed text-center">
                "{testimonial.quote}"
              </blockquote>
              <div className={`flex flex-col items-center`}>
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-primary hover-scale mb-3"
                />
                <div className="text-center">
                  <div className="font-semibold text-primary text-sm sm:text-base">
                    {testimonial.name}
                  </div>
                  <div className="text-text text-xs sm:text-sm">
                    {testimonial.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Testimonials Link */}
        <div className="mt-8 sm:mt-10 text-center">
          <a 
            href="/testimonials" 
            className="inline-block text-sm sm:text-base text-primary hover:text-link-hover font-medium hover:underline transition-all"
          >
            {t('home.viewAllTestimonials')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;

