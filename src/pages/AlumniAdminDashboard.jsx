import React, { useState } from 'react';

import { useLanguage } from '../context/LanguageContext';

import SideNavigationLayout from '../components/layout/SideNavigationLayout';

// Import all the admin alumni management components
import AlumniContentManagement from '../components/admin/AlumniContentManagement';
import AlumniExecutiveManagement from '../components/admin/AlumniExecutiveManagement';
import AlumniFinancialManagement from '../components/admin/AlumniFinancialManagement';
import AlumniCommunicationManagement from '../components/admin/AlumniCommunicationManagement';

const AlumniAdminDashboard = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('overview');

  // Define navigation items for alumni admin dashboard
  const navigationItems = [
    { id: 'overview', label: t('admin.alumni.overview', 'Overview'), icon: 'LayoutDashboard' },
    { id: 'content-management', label: t('admin.alumni.contentManagement', 'Content Management'), icon: 'FileText' },
    { id: 'executive-management', label: t('admin.alumni.executiveManagement', 'Executive Management'), icon: 'Users' },
    { id: 'financial-management', label: t('admin.alumni.financialManagement', 'Financial Management'), icon: 'DollarSign' },
    { id: 'communication-management', label: t('admin.alumni.communicationManagement', 'Communication Management'), icon: 'MessageSquare' },
  ];

  // Render the active component based on selected section
  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'content-management':
        return <AlumniContentManagement />;
      case 'executive-management':
        return <AlumniExecutiveManagement />;
      case 'financial-management':
        return <AlumniFinancialManagement />;
      case 'communication-management':
        return <AlumniCommunicationManagement />;
      case 'overview':
      default:
        return renderOverviewSection();
    }
  };

  const renderOverviewSection = () => (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          {t('admin.alumni.welcomeAdmin', 'Alumni Administration Center')}
        </h2>
        <p className="text-purple-100">
          {t('admin.alumni.manageAlumniContent', 'Manage alumni content, executive members, and communications')}
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('admin.alumni.totalAlumni', 'Total Alumni')}</p>
              <p className="text-2xl font-semibold text-gray-900">1,247</p>
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
              <p className="text-sm text-gray-600">{t('admin.alumni.activeEvents', 'Active Events')}</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('admin.alumni.totalDonations', 'Total Donations')}</p>
              <p className="text-2xl font-semibold text-gray-900">$125K</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('admin.alumni.activeChats', 'Active Chats')}</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('admin.alumni.quickActions', 'Quick Actions')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveSection('content-management')}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm text-gray-600">{t('admin.alumni.manageContent', 'Manage Content')}</span>
          </button>

          <button
            onClick={() => setActiveSection('executive-management')}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm text-gray-600">{t('admin.alumni.manageExecutives', 'Manage Executives')}</span>
          </button>

          <button
            onClick={() => setActiveSection('financial-management')}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="text-sm text-gray-600">{t('admin.alumni.manageFinance', 'Manage Finance')}</span>
          </button>

          <button
            onClick={() => setActiveSection('communication-management')}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm text-gray-600">{t('admin.alumni.manageCommunications', 'Manage Communications')}</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('admin.alumni.recentActivity', 'Recent Activity')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New Executive Member Added</p>
              <p className="text-xs text-gray-500">Sarah Johnson added as Alumni Relations Director</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Donation Received</p>
              <p className="text-xs text-gray-500">$5,000 donation from Class of 2015</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-full">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New Event Created</p>
              <p className="text-xs text-gray-500">Annual Alumni Meet 2024 scheduled for March 15</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SideNavigationLayout
      navigationItems={navigationItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      title={t('admin.alumni.dashboard', 'Alumni Administration')}
      subtitle={t('admin.alumni.manageAlumni', 'Manage alumni content, members, and communications')}
    >
      {renderActiveComponent()}
    </SideNavigationLayout>
  );
};

export default AlumniAdminDashboard;
