import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Users,
  Calendar,
  MessageCircle,
  Building,
  DollarSign,
  Lightbulb,
  MessageSquare,
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

import LanguageSwitcher from './LanguageSwitcher';
// import DashboardFooter from './DashboardFooter';
import LoadingOverlay from '../ui/LoadingOverlay';

const AlumniSideNavigationLayout = ({ 
  children, 
  activeSection, 
  onSectionChange, 
  loading = false, 
  loadingText = 'Loading...',
  showAdminSection = false
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigationItems = [
    {
      id: 'overview',
      label: t('alumni.tabs.overview'),
      icon: LayoutDashboard,
      description: 'Dashboard overview and quick stats'
    },
    {
      id: 'presentExcos',
      label: t('alumni.tabs.presentExcos'),
      icon: Users,
      description: 'Current executive members and their roles'
    },
    {
      id: 'alumniMessage',
      label: t('alumni.tabs.alumniMessage'),
      icon: MessageCircle,
      description: 'Messages from alumni admin'
    },
    {
      id: 'almaMataInfo',
      label: t('alumni.tabs.almaMataInfo'),
      icon: Building,
      description: 'News and events from your alma mater'
    },
    {
      id: 'events',
      label: t('alumni.tabs.newsEvents'),
      icon: Calendar,
      description: 'Alumni events and activities'
    },
    {
      id: 'finance',
      label: t('alumni.tabs.finance'),
      icon: DollarSign,
      description: 'Financial records and contributions'
    },
    {
      id: 'suggestions',
      label: t('alumni.tabs.suggestions'),
      icon: Lightbulb,
      description: 'Share your feedback and suggestions'
    },
    {
      id: 'groupChat',
      label: t('alumni.tabs.groupChat'),
      icon: MessageSquare,
      description: 'Alumni discussion forum'
    }
  ];

  const adminItems = showAdminSection ? [
    {
      id: 'admin',
      label: t('alumni.adminDashboard'),
      icon: Settings,
      description: 'Alumni admin dashboard management'
    }
  ] : [];

  return (
    <div className="min-h-screen flex" style={{backgroundColor: 'var(--accent-color)'}}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 shadow-sm border-b" style={{backgroundColor: 'var(--primary-color)'}}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8" style={{color: 'var(--tertiary-color)'}} />
              <h1 className="text-2xl font-bold" style={{color: 'var(--light-text)'}}>
                {t('alumni.dashboard')}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button 
                className="p-2 rounded-lg transition-all hover:scale-105 hover-glow" 
                style={{color: 'var(--tertiary-color)'}}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside 
        className={`fixed top-20 left-0 h-[calc(100vh-5rem)] z-40 transition-all duration-300 overflow-hidden ${
          sidebarCollapsed ? 'w-16' : 'w-80'
        }`}
        style={{backgroundColor: 'var(--light-text)'}}
      >
        <div className="h-full overflow-y-auto">
          {/* Welcome Section */}
          {!sidebarCollapsed && (
            <div className="p-6 border-b" style={{borderColor: 'var(--accent-color)'}}>
              <h2 className="text-lg font-semibold mb-1" style={{color: 'var(--text-color)'}}>
                {t('alumni.welcomeBack')}, {user?.first_name}!
              </h2>
              <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                {t('alumni.stayConnected')}
              </p>
            </div>
          )}

          {/* Navigation */}
          <nav className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all hover:scale-[1.02] ${
                      isActive ? 'text-white shadow-md' : ''
                    }`}
                    style={{
                      backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
                      color: isActive ? 'var(--light-text)' : 'var(--text-color)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = 'var(--accent-color)';
                        e.target.style.color = 'var(--primary-color)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'var(--text-color)';
                      }
                    }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs opacity-75 truncate">{item.description}</div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Admin Section */}
            {adminItems.length > 0 && (
              <>
                {!sidebarCollapsed && (
                  <div className="mt-8 mb-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{color: 'var(--text-secondary)'}}>
                      Administration
                    </h3>
                  </div>
                )}
                <div className="space-y-2">
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all hover:scale-[1.02] ${
                          isActive ? 'text-white shadow-md' : ''
                        }`}
                        style={{
                          backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
                          color: isActive ? 'var(--light-text)' : 'var(--text-color)'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.target.style.backgroundColor = 'var(--accent-color)';
                            e.target.style.color = 'var(--primary-color)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'var(--text-color)';
                          }
                        }}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!sidebarCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs opacity-75 truncate">{item.description}</div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={`flex-1 transition-all duration-300 pt-20 ${
          sidebarCollapsed ? 'ml-16' : 'ml-80'
        }`}
      >
        <LoadingOverlay
          isLoading={loading}
          loadingText={loadingText}
          overlayColor="rgba(0, 0, 0, 0.8)"
          spinnerColor="var(--primary-color)"
          textColor="white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </LoadingOverlay>
      </main>

      {/* Footer */}
      <footer className={`fixed bottom-0 transition-all duration-300 ${
        sidebarCollapsed ? 'left-16' : 'left-80'
      } right-0 z-30`}>
        {/* <DashboardFooter /> */}
      </footer>
    </div>
  );
};

export default AlumniSideNavigationLayout;
