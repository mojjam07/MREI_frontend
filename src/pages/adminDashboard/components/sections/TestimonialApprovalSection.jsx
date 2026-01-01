import React from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';

const TestimonialApprovalSection = ({ t, pendingTestimonials = [], pendingTestimonialsLoading, onApprove, onReject, onView }) => {
  const safePendingTestimonials = safeArray(pendingTestimonials);

  if (pendingTestimonialsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative bg-gradient-to-br from-emerald-500/10 via-accent-color/20 to-teal-500/10 backdrop-blur-xl rounded-xl p-6 border border-emerald-400/30 shadow-lg shadow-emerald-500/10 animate-pulse"
          >
            {/* Glass shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl" />
            
            <div className="relative flex justify-between items-start">
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-2/3"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-emerald-500/20 rounded"></div>
                <div className="h-8 w-20 bg-red-500/20 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Emerald Glow */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 rounded-xl opacity-20 blur-xl animate-pulse"></div>
        <div className="relative flex justify-between items-center animate-fade-in-up">
          <div>
            <h2 className="text-3xl font-bold text-light-text mb-2 flex items-center gap-3">
              <span className="relative">
                <span className="absolute inset-0 bg-emerald-400/20 blur-md rounded-full"></span>
                <span className="relative text-emerald-400">✦</span>
              </span>
              {t('dashboard.testimonialApproval') || 'Testimonial Approval'}
            </h2>
            <p className="text-light-text/80">
              {t('dashboard.testimonialApprovalDescription') || 'Review and approve pending testimonials'}
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
            <div className="relative px-4 py-2 bg-gradient-to-br from-primary/30 to-coral/30 backdrop-blur-sm rounded-lg border border-primary/30">
              <span className="text-emerald-300 font-medium">
                {safePendingTestimonials.length} {t('dashboard.pending') || 'pending'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Grid with Enhanced Glassmorphism */}
      <div className="grid gap-6">
        {safePendingTestimonials.length > 0 ? (
          safePendingTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className="group relative bg-gradient-to-br from-emerald-500/10 via-accent-color/20 to-teal-500/10 backdrop-blur-xl rounded-xl p-6 border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Enhanced glass shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-bl-full" />
              </div>

              <div className="relative flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h3 className="text-xl font-semibold text-light-text mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full"></span>
                    {safeString(testimonial.name, 'Anonymous')}
                  </h3>
                  <p className="text-light-text/80 text-sm mb-4 italic leading-relaxed">
                    "{safeString(testimonial.content, 'No content')}"
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-400/20">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                      {t('dashboard.role') || 'Role'}: {safeString(testimonial.role, 'Student')}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/10 rounded-full border border-teal-400/20">
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
                      {t('dashboard.email') || 'Email'}: {safeString(testimonial.email, 'N/A')}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 rounded-full border border-cyan-400/20">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                      {t('dashboard.submitted') || 'Submitted'}: {safeFormatDate(testimonial.created_at)}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                      {t('dashboard.pending') || 'pending'}
                    </span>
                  </div>
                </div>
                
                {/* Enhanced Action Buttons with Emerald Glow */}
                <div className="flex flex-col gap-2 ml-4">
                  <button 
                    onClick={() => onApprove?.(testimonial.id)}
                    className="group/btn relative px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/40 hover:to-teal-500/40 text-emerald-300 rounded-lg border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300 flex items-center gap-2 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></span>
                    <span className="relative flex items-center gap-1.5">
                      <span className="text-lg">✓</span>
                      {t('dashboard.approve') || 'Approve'}
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => onReject?.(testimonial.id)}
                    className="group/btn relative px-4 py-2 bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/40 hover:to-rose-500/40 text-red-300 rounded-lg border border-red-400/30 hover:border-red-400/50 transition-all duration-300 flex items-center gap-2 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></span>
                    <span className="relative flex items-center gap-1.5">
                      <span className="text-lg">✕</span>
                      {t('dashboard.reject') || 'Reject'}
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => onView?.(testimonial)}
                    className="group/btn relative px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/40 hover:to-indigo-500/40 text-blue-300 rounded-lg border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 flex items-center gap-2 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></span>
                    <span className="relative flex items-center gap-1.5">
                      <span className="text-lg">👁</span>
                      {t('dashboard.view') || 'View'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl blur-xl"></div>
            <div className="relative text-center py-16 animate-fade-in-up bg-gradient-to-br from-emerald-500/5 via-accent-color/10 to-teal-500/5 backdrop-blur-xl rounded-2xl border border-emerald-400/10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 mb-6">
                <span className="text-4xl">✨</span>
              </div>
              <p className="text-light-text/70 text-lg">
                {t('dashboard.noPendingTestimonials') || 'No pending testimonials'}
              </p>
              <p className="text-light-text/50 text-sm mt-2">
                All testimonials have been reviewed
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialApprovalSection;
