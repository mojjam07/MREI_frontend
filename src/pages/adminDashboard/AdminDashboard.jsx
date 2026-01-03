import React, { useState } from 'react';
import { LayoutDashboard, Settings } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboard } from '../../context/DashboardContext';
import DashboardFooter from '../../components/layout/DashboardFooter';
import DashboardSkeleton from '../../components/ui/DashboardSkeleton';
import LanguageSwitcher from '../../components/layout/LanguageSwitcher';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../../components/ui/ErrorBoundary';

// Component imports
import AdminHeader from './components/AdminHeader';
import AdminNavigation from './components/AdminNavigation';
import StatsSection from './components/sections/StatsSection';
import NewsSection from './components/sections/NewsSection';
import EventsSection from './components/sections/EventsSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import CampusLifeSection from './components/sections/CampusLifeSection';
import StudentsSection from './components/sections/StudentsSection';
import TutorsSection from './components/sections/TutorsSection';
import BooksSection from './components/sections/BooksSection';
import TestimonialApprovalSection from './components/sections/TestimonialApprovalSection';
import ContactMessagesSection from './components/sections/ContactMessagesSection';

const AdminDashboard = () => {
  const language = useLanguage();
  const t = language?.t || ((k) => k);

  const [activeTab, setActiveTab] = useState('stats');
  // Get dashboard context
  const dashboardContext = useDashboard() || {};

  // Extract loading states
  const {
    statsLoading,
    adminNewsLoading,
    adminEventsLoading,
    adminTestimonialsLoading,
    adminCampusLifeLoading
  } = dashboardContext;

  // Check if any data is loading
  const isLoading = statsLoading || adminNewsLoading || adminEventsLoading || adminTestimonialsLoading || adminCampusLifeLoading;

  const renderActiveTabContent = () => {
    const commonProps = {
      t,
      ...dashboardContext
    };

    const errorBoundaryProps = {
      fallbackTitle: 'Failed to load section',
      fallbackMessage: 'This section encountered an error. Please try again.',
      showErrorDetails: false,
      showRetry: true,
      showReload: true
    };

    const renderSectionWithErrorBoundary = (Component, props = {}) => (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...commonProps} {...props} />
      </ErrorBoundary>
    );

    switch (activeTab) {
      case 'stats':
        return renderSectionWithErrorBoundary(StatsSection);
      case 'news':
        return renderSectionWithErrorBoundary(NewsSection, {
          news: dashboardContext.adminNews || [],
          newsLoading: dashboardContext.adminNewsLoading,
          createNews: dashboardContext.createNews,
          updateNews: dashboardContext.updateNews,
          deleteNews: dashboardContext.deleteNews
        });
      case 'events':
        return renderSectionWithErrorBoundary(EventsSection, {
          events: dashboardContext.adminEvents || [],
          eventsLoading: dashboardContext.adminEventsLoading,
          createEvent: dashboardContext.createEvent
        });
      case 'testimonials':
        return renderSectionWithErrorBoundary(TestimonialsSection, {
          testimonials: dashboardContext.adminTestimonials || [],
          testimonialsLoading: dashboardContext.adminTestimonialsLoading
        });
      case 'campus-life':
        return renderSectionWithErrorBoundary(CampusLifeSection, {
          campusLife: dashboardContext.adminCampusLife || [],
          campusLifeLoading: dashboardContext.adminCampusLifeLoading,
          createCampusLife: dashboardContext.createCampusLife,
          updateCampusLife: dashboardContext.updateCampusLife,
          deleteCampusLife: dashboardContext.deleteCampusLife
        });
      case 'students':
        return renderSectionWithErrorBoundary(StudentsSection, {
          students: dashboardContext.students || [],
          studentProfilesLoading: dashboardContext.studentProfilesLoading
        });
      case 'tutors':
        return renderSectionWithErrorBoundary(TutorsSection, {
          tutors: dashboardContext.tutors || [],
          tutorProfilesLoading: dashboardContext.tutorProfilesLoading
        });
      case 'books':
        return renderSectionWithErrorBoundary(BooksSection, {
          books: dashboardContext.books || [],
          booksLoading: dashboardContext.booksLoading,
          createBook: dashboardContext.createBook
        });
      case 'testimonial-approval':
        return renderSectionWithErrorBoundary(TestimonialApprovalSection);
      case 'contact-messages':
        return renderSectionWithErrorBoundary(ContactMessagesSection, {
          contactMessages: dashboardContext.contactMessages || [],
          contactMessagesLoading: dashboardContext.contactMessagesLoading,
          markAsRead: dashboardContext.markAsRead,
          replyContactMessage: dashboardContext.replyContactMessage,
          deleteContactMessage: dashboardContext.deleteContactMessage
        });
      default:
        return renderSectionWithErrorBoundary(StatsSection);
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--accent-color)'}}>
      {/* Header */}
      <AdminHeader 
        t={t} 
        LanguageSwitcher={LanguageSwitcher} 
        Settings={Settings} 
        LayoutDashboard={LayoutDashboard} 
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs - Always Visible */}
        <AdminNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          t={t}
          pendingTestimonials={dashboardContext.pendingTestimonials}
          unreadMessages={dashboardContext.unreadMessages}
        />

        {/* Content Area - Always Visible */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            renderActiveTabContent()
          )}
        </div>
      </div>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
};

export default AdminDashboard;
