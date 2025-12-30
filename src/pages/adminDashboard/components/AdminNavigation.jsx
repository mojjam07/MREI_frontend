import React from 'react';

const AdminNavigation = ({
  activeTab,
  setActiveTab,
  t,
  pendingTestimonials = [],
  unreadMessages = []
}) => {
  const tabs = [
    { id: 'stats', label: t('dashboard.stats') || 'Statistics' },
    { id: 'news', label: t('dashboard.news') || 'News' },
    { id: 'events', label: t('dashboard.events') || 'Events' },
    { id: 'testimonials', label: t('dashboard.testimonials') || 'Testimonials' },
    { id: 'campus-life', label: t('dashboard.campusLife') || 'Campus Life' },
    { id: 'students', label: t('dashboard.students') || 'Students' },
    { id: 'tutors', label: t('dashboard.tutors') || 'Tutors' },
    { id: 'books', label: t('dashboard.books') || 'Books' },
    { id: 'library', label: t('dashboard.library') || 'Library' },
    { 
      id: 'testimonial-approval', 
      label: t('dashboard.testimonialApproval') || 'Testimonial Approval',
      badge: pendingTestimonials?.length || 0 
    },
    { 
      id: 'contact-messages', 
      label: t('dashboard.contactMessages') || 'Contact Messages',
      badge: unreadMessages?.length || 0 
    },
  ];

  const handleTabClick = (tabId) => {
    if (tabId !== activeTab) setActiveTab(tabId);
  };

  return (
    <div className="mb-8">
      <nav className="flex flex-wrap gap-2 p-4 bg-accent-color/20 backdrop-blur-sm rounded-lg border border-white/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick(tab.id);
            }}
            className={`
              relative px-4 py-2 rounded-lg min-w-[120px] text-sm font-medium transition-colors duration-200
              ${activeTab === tab.id 
                ? 'bg-primary text-light-text shadow-lg hover-lift animate-pulse-gentle'
                : 'bg-accent-color/10 text-text-color hover:bg-accent-color/30 hover-scale'
              }
            `}
            style={{
              willChange: 'transform, opacity',
            }}
          >
            <span className="inline-flex items-center gap-2">
              {tab.label}
              {tab.badge > 0 && (
                <span className="inline-flex items-center justify-center bg-error-color text-light-text text-xs rounded-full w-5 h-5 flex-shrink-0 animate-bounce-in">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminNavigation;
