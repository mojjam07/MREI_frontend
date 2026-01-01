import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const navRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const updateScrollButtons = () => {
      if (navRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    checkMobile();
    updateScrollButtons();
    
    window.addEventListener('resize', () => {
      checkMobile();
      updateScrollButtons();
    });
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleScroll = (direction) => {
    if (navRef.current) {
      const scrollAmount = navRef.current.clientWidth * 0.8;
      navRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleTabClick = (tabId) => {
    if (tabId !== activeTab) setActiveTab(tabId);
  };

  const scrollHandler = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  return (
    <div className="mb-4 sm:mb-6 lg:mb-8">
      {/* Navigation Container */}
      <div className="relative">
        {/* Scroll Buttons - Only show on mobile/tablet */}
        {isMobile && (canScrollLeft || canScrollRight) && (
          <>
            <button
              onClick={() => handleScroll('left')}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${
                canScrollLeft 
                  ? 'bg-gradient-to-r from-primary to-coral text-white shadow-lg hover-lift' 
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
              style={{
                boxShadow: canScrollLeft ? '0 4px 15px rgba(233, 69, 96, 0.4)' : 'none'
              }}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${
                canScrollRight 
                  ? 'bg-gradient-to-r from-primary to-coral text-white shadow-lg hover-lift' 
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
              style={{
                boxShadow: canScrollRight ? '0 4px 15px rgba(233, 69, 96, 0.4)' : 'none'
              }}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Navigation Tabs */}
        <nav 
          ref={navRef}
          onScroll={scrollHandler}
          className={`
            flex gap-1.5 sm:gap-2 p-2 sm:p-3 lg:p-4 rounded-xl border shadow-lg
            ${isMobile ? 'overflow-x-auto scrollbar-hide snap-x' : 'flex-wrap justify-center'}
          `}
          style={{ 
            background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            borderColor: '#e94560',
            boxShadow: '0 10px 40px rgba(233, 69, 96, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
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
                relative px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-2.5 rounded-lg 
                text-xs sm:text-sm font-semibold transition-all duration-300 
                whitespace-nowrap flex-shrink-0
                ${isMobile ? 'snap-center' : ''}
                ${activeTab === tab.id 
                  ? 'text-white shadow-lg hover-lift'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                }
              `}
              style={{
                willChange: 'transform, opacity',
                minWidth: isMobile ? 'auto' : '100px',
                backgroundColor: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)' 
                  : 'transparent',
                border: activeTab === tab.id ? '1px solid #e94560' : '1px solid transparent',
                boxShadow: activeTab === tab.id 
                  ? '0 4px 15px rgba(233, 69, 96, 0.4), 0 0 20px rgba(233, 69, 96, 0.2)' 
                  : 'none',
              }}
            >
              <span className="inline-flex items-center gap-1.5 sm:gap-2">
                <span className="hidden xs:inline">{tab.label}</span>
                <span className="xs:hidden text-xs">{tab.label.split(' ')[0]}</span>
                {tab.badge > 0 && (
                  <span 
                    className="inline-flex items-center justify-center text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 animate-bounce-in"
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

      {/* Mobile indicator dots */}
      {isMobile && (
        <div className="flex justify-center gap-1 mt-2">
          {Array.from({ length: Math.ceil(tabs.length / 4) }).map((_, i) => (
            <div 
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === 0 ? 'bg-primary w-2.5' : 'bg-gray-500/50'
              }`}
              style={{ 
                backgroundColor: i === 0 ? '#e94560' : undefined
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Add custom styles for hiding scrollbar
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 480px) {
    .xs\\:inline {
      display: none;
    }
    .xs\\:hidden {
      display: inline;
    }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}

export default AdminNavigation;
