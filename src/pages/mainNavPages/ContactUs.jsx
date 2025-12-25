import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import SideNavigationLayout from '../../components/layout/SideNavigationLayout';

const ContactUs = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  
  const { ref: contactRef, animationClasses: contactAnimation } = useScrollAnimation();
  const { ref: formRef, animationClasses: formAnimation } = useScrollAnimation();

  const contactInfo = t('contactUs.contactInfo');
  const departments = t('contactUs.departments');
  const inquiryForm = t('contactUs.inquiryForm');
  const socialMedia = t('contactUs.socialMedia');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = inquiryForm.required;
    if (!formData.email.trim()) newErrors.email = inquiryForm.required;
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = inquiryForm.emailInvalid;
    if (!formData.message.trim()) newErrors.message = inquiryForm.required;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Handle form submission
      console.log('Form submitted:', formData);
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  };

  return (
    <SideNavigationLayout>
        {/* Content Header */}
        <div className="bg-white border-b border-gray-200 p-6 lg:p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
              {t('contactUs.title')}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {t('contactUs.subtitle')}
            </p>
          </div>
        </div>

        {/* Contact Information Section */}
        <section ref={contactRef} className="py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className={`text-center mb-8 lg:mb-12 ${contactAnimation}`}>
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                {t('contactUs.contactDetailsTitle')}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                {t('contactUs.contactDetailsDesc')}
              </p>
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-lg hover-lift text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Address</h3>
                <p className="text-gray-600 text-sm">{contactInfo.address}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg hover-lift text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Phone</h3>
                <p className="text-gray-600 text-sm">{contactInfo.phone}</p>
                <p className="text-gray-500 text-xs mt-1">{contactInfo.emergency}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg hover-lift text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Email</h3>
                <p className="text-gray-600 text-sm">{contactInfo.email}</p>
                <p className="text-gray-500 text-xs mt-1">{contactInfo.hours}</p>
              </div>
            </div>

            {/* Departments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {departments.map((dept, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover-lift">
                  <h3 className="text-lg font-bold text-primary mb-2">{dept.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{dept.description}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Email:</span> {dept.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Phone:</span> {dept.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section ref={formRef} className="py-8 lg:py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 lg:px-8">
            <div className={`text-center mb-8 ${formAnimation}`}>
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                {t('contactUs.sendInquiryTitle')}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base">
                {t('contactUs.sendInquiryDesc')}
              </p>
            </div>

            <div className="bg-gray-50 p-6 lg:p-8 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {inquiryForm.name} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {inquiryForm.email} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {inquiryForm.phone}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      {inquiryForm.subject}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Subject of your inquiry"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {inquiryForm.message} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Please describe your inquiry in detail..."
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-semibold"
                  >
                    {inquiryForm.send}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Map and Social Media Section */}
        <section className="py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map Placeholder */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-primary mb-4">Find Us</h3>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">{t('contactUs.mapEmbed')}</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-primary mb-4">{socialMedia.title}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {socialMedia.platforms.map((platform, index) => (
                    <a
                      key={index}
                      href={platform.url}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
                    >
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {platform.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{platform.name}</div>
                        <div className="text-sm text-gray-500">{platform.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
    </SideNavigationLayout>
  );
};

export default ContactUs;
