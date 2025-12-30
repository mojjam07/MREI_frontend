import React from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';

const TestimonialsSection = ({ t, testimonials = [], testimonialsLoading }) => {
  const safeTestimonials = safeArray(testimonials);

  if (testimonialsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border border-white/20 animate-pulse"
          >
            <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/20 rounded w-full mb-1"></div>
            <div className="h-3 bg-white/20 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left animate-fade-in-up">
        <h2 className="text-3xl font-bold text-light-text mb-2">
          {t('dashboard.testimonialsManagement') || 'Testimonials Management'}
        </h2>
        <p className="text-light-text/80">
          {t('dashboard.testimonialsDescription') || 'Manage student and staff testimonials'}
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-6">
        {safeTestimonials.length > 0 ? (
          safeTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className="bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-accent-color/30 hover-lift transition-all duration-300 animate-scale-in"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start mb-4 gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-light-text mb-2">
                    {safeString(testimonial.name, 'Anonymous')}
                  </h3>
                  <p className="text-light-text/80 text-sm mb-3 italic">
                    "{safeString(testimonial.content, 'No content')}"
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-light-text/60">
                    <span>
                      {t('dashboard.role') || 'Role'}: {safeString(testimonial.role, 'Student')}
                    </span>
                    <span>
                      {t('dashboard.date') || 'Date'}: {safeFormatDate(testimonial.created_at)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        testimonial.status === 'approved'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      {safeString(testimonial.status, 'pending')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 w-full lg:w-auto lg:ml-4">
                  <button className="flex-1 lg:flex-none px-3 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors">
                    {t('dashboard.edit') || 'Edit'}
                  </button>
                  <button className="flex-1 lg:flex-none px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors">
                    {t('dashboard.delete') || 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 animate-fade-in-up">
            <p className="text-light-text/60 text-lg">
              {t('dashboard.noTestimonials') || 'No testimonials yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsSection;
