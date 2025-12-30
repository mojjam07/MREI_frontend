import React from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';

const TestimonialApprovalSection = ({ t, pendingTestimonials = [], pendingTestimonialsLoading }) => {
  const safePendingTestimonials = safeArray(pendingTestimonials);

  if (pendingTestimonialsLoading) {
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
      <div className="flex justify-between items-center animate-fade-in-up">
        <div>
          <h2 className="text-3xl font-bold text-light-text mb-2">
            {t('dashboard.testimonialApproval') || 'Testimonial Approval'}
          </h2>
          <p className="text-light-text/80">
            {t('dashboard.testimonialApprovalDescription') || 'Review and approve pending testimonials'}
          </p>
        </div>
        <div className="text-sm text-light-text/60">
          {safePendingTestimonials.length} {t('dashboard.pending') || 'pending'}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-6">
        {safePendingTestimonials.length > 0 ? (
          safePendingTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className="bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-accent-color/30 hover-lift transition-all duration-300 animate-scale-in"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-light-text mb-2">
                    {safeString(testimonial.name, 'Anonymous')}
                  </h3>
                  <p className="text-light-text/80 text-sm mb-3 italic">
                    "{safeString(testimonial.content, 'No content')}"
                  </p>
                  <div className="flex items-center gap-4 text-sm text-light-text/60">
                    <span>
                      {t('dashboard.role') || 'Role'}: {safeString(testimonial.role, 'Student')}
                    </span>
                    <span>
                      {t('dashboard.email') || 'Email'}: {safeString(testimonial.email, 'N/A')}
                    </span>
                    <span>
                      {t('dashboard.submitted') || 'Submitted'}: {safeFormatDate(testimonial.created_at)}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-300">
                      {t('dashboard.pending') || 'pending'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="px-3 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors">
                    {t('dashboard.approve') || 'Approve'}
                  </button>
                  <button className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors">
                    {t('dashboard.reject') || 'Reject'}
                  </button>
                  <button className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors">
                    {t('dashboard.view') || 'View'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 animate-fade-in-up">
            <p className="text-light-text/60 text-lg">
              {t('dashboard.noPendingTestimonials') || 'No pending testimonials'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialApprovalSection;
