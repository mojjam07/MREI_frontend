import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import UniversityHeader from '../components/landing/UniversityHeader';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import StatsSection from '../components/landing/StatsSection';
import TestimonialSection from '../components/landing/TestimonialSection';
import NewsEventsSection from '../components/landing/NewsEventsSection';
import CampusLifeSection from '../components/landing/CampusLifeSection';
// import RecentEventsGallery from '../components/landing/RecentEventsGallery';
import Footer from '../components/layout/Footer';
import OurContact from '../components/landing/OurContact';

const Landing = () => {
  const { t } = useLanguage();


  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-light-text relative">
      {/* University Header */}
      <UniversityHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="why-us" style={{ scrollMarginTop: '200px' }}>
        <FeaturesSection />
      </section>

      {/* Stats Section */}
      <section id="our-impact" style={{ scrollMarginTop: '200px' }}>
        <StatsSection />
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" style={{ scrollMarginTop: '200px' }}>
        <TestimonialSection />
      </section>

      {/* News & Events Section */}
      <section id="news-events" style={{ scrollMarginTop: '200px' }}>
        <NewsEventsSection />
      </section>

      {/* Campus Life Section */}
      <section id="school-life" style={{ scrollMarginTop: '200px' }}>
        <CampusLifeSection />
      </section>

      {/* Recent Events Gallery */}
      {/*<RecentEventsGallery />*/}
      <section id="our-contact" style={{ scrollMarginTop: '200px' }}>
        <OurContact />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
