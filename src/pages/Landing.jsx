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
    <div className="min-h-screen bg-gradient-to-br from-accent to-light-text">
      {/* University Header */}
      <UniversityHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* News & Events Section */}
      <NewsEventsSection />

      {/* Campus Life Section */}
      <CampusLifeSection />

      {/* Recent Events Gallery */}
      {/*<RecentEventsGallery />*/}
      <OurContact />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
