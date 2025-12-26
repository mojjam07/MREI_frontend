import React, { useState } from 'react';

import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

import AlumniSideNavigationLayout from '../components/layout/AlumniSideNavigationLayout';

// Import all the new alumni components
import AlumniExecutiveMembers from '../components/alumni/AlumniExecutiveMembers';
import AlumniEventsSection from '../components/alumni/AlumniEventsSection';
import AlumniMessages from '../components/alumni/AlumniMessages';
import AlmaMataInfo from '../components/alumni/AlmaMataInfo';
import AlumniFinance from '../components/alumni/AlumniFinance';
import AlumniSuggestions from '../components/alumni/AlumniSuggestions';
import AlumniGroupChat from '../components/alumni/AlumniGroupChat';

const AlumniDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  // Define navigation items for alumni dashboard
  const navigationItems = [
    { id: 'overview', label: t('alumni.overview', 'Overview'), icon: 'LayoutDashboard' },
    { id: 'executive-members', label: t('alumni.executiveMembers', 'Executive Members'), icon: 'Users' },
    { id: 'events', label: t('alumni.events', 'Events'), icon: 'Calendar' },
    { id: 'messages', label: t('alumni.messages', 'Messages'), icon: 'MessageCircle' },
    { id: 'alma-mata', label: t('alumni.almaMata', 'Alma Mata Info'), icon: 'School' },
    { id: 'finance', label: t('alumni.finance', 'Finance'), icon: 'DollarSign' },
    { id: 'suggestions', label: t('alumni.suggestions', 'Suggestions'), icon: 'Lightbulb' },
    { id: 'group-chat', label: t('alumni.groupChat', 'Group Chat'), icon: 'MessageSquare' },
  ];

  // Render the active component based on selected section
  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'executive-members':
        return <AlumniExecutiveMembers />;
      case 'events':
        return <AlumniEventsSection />;
      case 'messages':
        return <AlumniMessages />;
      case 'alma-mata':
        return <AlmaMataInfo />;
      case 'finance':
        return <AlumniFinance />;
      case 'suggestions':
        return <AlumniSuggestions />;
      case 'group-chat':
        return <AlumniGroupChat />;
      case 'overview':
      default:
        return renderOverviewSection();
    }
  };

  const renderOverviewSection = () => (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          {t('alumni.welcomeBack', 'Welcome back')}, {user?.first_name || 'Alumni'}!
        </h2>
        <p className="text-blue-100">
          {t('alumni.stayConnected', 'Stay connected with your alma mater and fellow alumni')}
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3v9" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('alumni.newsEvents', 'News & Events')}</p>
              <p className="text-2xl font-semibold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('alumni.upcomingEvents', 'Upcoming Events')}</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('alumni.totalAlumni', 'Total Alumni')}</p>
              <p className="text-2xl font-semibold text-gray-900">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('alumni.donations', 'Total Donations')}</p>
              <p className="text-2xl font-semibold text-gray-900">$125K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('alumni.quickActions', 'Quick Actions')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveSection('group-chat')}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm text-gray-600">{t('alumni.joinChat', 'Join Chat')}</span>
          </button>

          <button
            onClick={() => setActiveSection('events')}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-600">{t('alumni.viewEvents', 'View Events')}</span>
          </button>

          <button
            onClick={() => setActiveSection('finance')}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="text-sm text-gray-600">{t('alumni.donate', 'Donate')}</span>
          </button>

          <button
            onClick={() => setActiveSection('suggestions')}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-sm text-gray-600">{t('alumni.suggest', 'Suggest')}</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('alumni.recentActivity', 'Recent Activity')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Annual Alumni Meet 2024</p>
              <p className="text-xs text-gray-500">Scheduled for March 15, 2024</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New Donation Campaign</p>
              <p className="text-xs text-gray-500">Building fund campaign launched</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-full">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Group Chat Activity</p>
              <p className="text-xs text-gray-500">15 new messages in Class of 2020 chat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AlumniSideNavigationLayout
      navigationItems={navigationItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      title={t('alumni.dashboard', 'Alumni Dashboard')}
      subtitle={t('alumni.welcomeMessage', 'Welcome to your alumni dashboard')}
    >
      {renderActiveComponent()}
    </AlumniSideNavigationLayout>
  );
};

export default AlumniDashboard;
