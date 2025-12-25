import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { API } from '../../config';

const OurContact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear status when user starts typing again
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API}/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        console.log('Contact form submitted successfully:', data);
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        console.error('Error submitting contact form:', errorData);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Network error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4 animate-fade-in-up px-4">
            {t('home.contactTitle')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
            {t('home.contactDesc')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          {/* Contact Information */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-4 sm:mb-6">
              {t('home.contactInfo')}
            </h3>
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-start">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2 sm:mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-primary text-sm sm:text-base">{t('home.address')}</p>
                  <p className="text-text text-sm sm:text-base">{t('home.addressValue')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2 sm:mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-semibold text-primary text-sm sm:text-base">{t('home.phone')}</p>
                  <p className="text-text text-sm sm:text-base">{t('home.phoneValue')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2 sm:mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-semibold text-primary text-sm sm:text-base">{t('home.email')}</p>
                  <p className="text-text text-sm sm:text-base break-all">{t('home.emailValue')}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 sm:mt-8">
              <h4 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4">
                {t('home.followUs')}
              </h4>
              <div className="flex space-x-3 sm:space-x-4">
                {/* Facebook */}
                <a href="#" className="text-primary hover:text-secondary transition-colors p-2 hover:bg-white/50 rounded-full">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.691V11.01h3.13V8.309c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.696h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a href="#" className="text-primary hover:text-secondary transition-colors p-2 hover:bg-white/50 rounded-full">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.98 2.98 0 0 0-2.097-2.108C19.554 3.5 12 3.5 12 3.5s-7.554 0-9.401.578A2.98 2.98 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.98 2.98 0 0 0 2.097 2.108C4.446 20.5 12 20.5 12 20.5s7.554 0 9.401-.578a2.98 2.98 0 0 0 2.097-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a href="#" className="text-primary hover:text-secondary transition-colors p-2 hover:bg-white/50 rounded-full">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.316.975.975 1.254 2.242 1.316 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.34 2.633-1.316 3.608-.975.975-2.242 1.254-3.608 1.316-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.34-3.608-1.316-.975-.975-1.254-2.242-1.316-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.34-2.633 1.316-3.608C4.524 2.573 5.79 2.295 7.156 2.233 8.422 2.175 8.802 2.163 12 2.163zM12 6.838A5.162 5.162 0 1 0 12 17.162 5.162 5.162 0 0 0 12 6.838zm0 8.513A3.351 3.351 0 1 1 12 8.649a3.351 3.351 0 0 1 0 6.702zm6.406-8.845a1.205 1.205 0 1 1-2.41 0 1.205 1.205 0 0 1 2.41 0z"/>
                  </svg>
                </a>

                {/* Twitter / X */}
                <a href="#" className="text-primary hover:text-secondary transition-colors p-2 hover:bg-white/50 rounded-full">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045C7.728 8.087 4.1 6.127 1.671 3.149c-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a href="#" className="text-primary hover:text-secondary transition-colors p-2 hover:bg-white/50 rounded-full">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.75 2h3.02c.29 2.04 1.43 3.81 3.23 4.8v3.04c-1.86.06-3.63-.55-5.02-1.64v7.56a6.5 6.5 0 1 1-6.5-6.5c.34 0 .67.03 1 .09v3.2a3.5 3.5 0 1 0 2.27 3.3V2z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a href="#" className="text-primary hover:text-secondary transition-colors p-2 hover:bg-white/50 rounded-full">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM7.119 20.452H3.555V9h3.564v11.452z"/>
                  </svg>
                </a>
              </div>

            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-4 sm:mb-6">
              {t('home.sendMessage')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                  {t('home.messageSuccess')}
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {t('home.messageError')}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-primary mb-1">
                  {t('home.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-primary mb-1">
                  {t('home.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-xs sm:text-sm font-medium text-primary mb-1">
                  {t('home.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-primary mb-1">
                  {t('home.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-2.5 sm:py-3 px-4 rounded-md hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('home.sendingMessage')}
                  </>
                ) : (
                  t('home.send')
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurContact;