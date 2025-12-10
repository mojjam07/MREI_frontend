import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const TestimonialSection = () => {
  const { t, language } = useLanguage();
  const [testimonial, setTestimonial] = useState(null);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await fetch('/api/announcements/');
        const data = await response.json();
        const testimonials = data.filter(item => item.type === 'testimonial');
        if (testimonials.length > 0) {
          const item = testimonials[0];
          setTestimonial({
            quote: item.content,
            name: item.author || t('home.testimonialName'),
            title: item.author_title || t('home.testimonialTitle'),
            image: item.image || t('home.testimonialImage')
          });
        } else {
          setTestimonial({
            quote: t('home.testimonialQuote'),
            name: t('home.testimonialName'),
            title: t('home.testimonialTitle'),
            image: t('home.testimonialImage')
          });
        }
      } catch (error) {
        console.error('Error fetching testimonial:', error);
        setTestimonial({
          quote: t('home.testimonialQuote'),
          name: t('home.testimonialName'),
          title: t('home.testimonialTitle'),
          image: t('home.testimonialImage')
        });
      }
    };
    fetchTestimonial();
  }, [t]);

  if (!testimonial) return null;

  return (
    <section className="py-20 bg-light-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">{t('home.studentSuccess')}</h2>
          <p className="text-xl text-text">{t('home.testimonialDesc')}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-accent rounded-lg p-8 shadow-sm hover-lift animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <blockquote className="text-lg text-text mb-6 leading-relaxed">
              {testimonial.quote}
            </blockquote>
            <div className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary hover-scale"
              />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <div className="font-semibold text-primary">{testimonial.name}</div>
                <div className="text-text">{testimonial.title}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
