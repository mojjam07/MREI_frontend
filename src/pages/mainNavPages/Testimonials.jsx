import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import SideNavigationLayout from '../../components/layout/SideNavigationLayout';

const Testimonials = () => {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const { ref: featuredRef, animationClasses: featuredAnimation } = useScrollAnimation();
  const { ref: categoriesRef, animationClasses: categoriesAnimation } = useScrollAnimation();

  const testimonials = t('testimonials.featuredTestimonials');
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

        {/* Featured Testimonials Section */}
        <section ref={featuredRef} className="py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className={`text-center mb-8 lg:mb-12 ${featuredAnimation}`}>
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                Featured Stories
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                Discover the transformative journeys of our students and alumni who have achieved remarkable success through our educational programs.
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
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
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

        {/* Testimonial Categories Section */}
        <section ref={categoriesRef} className="py-8 lg:py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                The success stories from our community speak for themselves. Here's what our students and alumni have to say about their experience.
              </p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 ${categoriesAnimation}`}>
              {categoryStats.map((category, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg shadow-lg hover-lift">
                  <div className="text-4xl lg:text-5xl mb-4">{category.icon}</div>
                  <div className="text-2xl lg:text-3xl font-bold text-accent mb-2">{category.count}</div>
                  <h3 className="text-lg lg:text-xl font-bold text-primary mb-2">{category.title}</h3>
                  <p className="text-sm lg:text-base text-gray-600">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Metrics Section */}
        <section className="py-8 lg:py-12">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-primary to-accent text-white p-8 lg:p-12 rounded-lg shadow-xl">
              <h2 className="text-xl lg:text-2xl font-bold mb-6">
                Join Our Success Stories
              </h2>
              <p className="text-sm lg:text-base text-white/90 mb-8">
                Become part of our growing community of successful graduates who have transformed their careers and lives through quality education at Mahdu Rahmah Institute.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">98%</div>
                  <div className="text-sm text-white/80">Student Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">95%</div>
                  <div className="text-sm text-white/80">Career Advancement</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">92%</div>
                  <div className="text-sm text-white/80">Would Recommend</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">89%</div>
                  <div className="text-sm text-white/80">Higher Earnings</div>
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
