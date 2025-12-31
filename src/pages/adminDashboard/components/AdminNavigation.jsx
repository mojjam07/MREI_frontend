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
    { id: 'library', label: t('dashboard.library') || 'Course' },
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
      <nav 
        className="flex flex-wrap gap-2 p-4 rounded-xl border shadow-lg"
        style={{ 
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          borderColor: '#e94560',
          boxShadow: '0 10px 40px rgba(233, 69, 96, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick(tab.id);
            }}
            className={`
              relative px-5 py-2.5 rounded-lg min-w-[130px] text-sm font-semibold transition-all duration-300
              ${activeTab === tab.id 
                ? 'text-white shadow-lg hover-lift'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
              }
            `}
            style={{
              willChange: 'transform, opacity',
              backgroundColor: activeTab === tab.id 
                ? 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)' 
                : 'transparent',
              border: activeTab === tab.id ? '1px solid #e94560' : '1px solid transparent',
              boxShadow: activeTab === tab.id 
                ? '0 4px 15px rgba(233, 69, 96, 0.4), 0 0 20px rgba(233, 69, 96, 0.2)' 
                : 'none',
            }}
          >
            <span className="inline-flex items-center gap-2">
              {tab.label}
              {tab.badge > 0 && (
                <span 
                  className="inline-flex items-center justify-center text-white text-xs font-bold rounded-full w-5 h-5 flex-shrink-0 animate-bounce-in"
                  style={{ 
                    backgroundColor: '#e94560',
                    boxShadow: '0 2px 10px rgba(233, 69, 96, 0.5)'
                  }}
                >
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
