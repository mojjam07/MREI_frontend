import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const MainNav = ({ className = '' }) => {
  const { t, language } = useLanguage();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);

  const menuItems = [
    {
      title: t('home.whyUs'),
      href: '/why-us',
      submenu: [
        { title: t('navDropdowns.whyUs.expertTutors'), href: '/why-us' },
        { title: t('navDropdowns.whyUs.flexibleLearning'), href: '/why-us' },
        { title: t('navDropdowns.whyUs.provenSuccess'), href: '/why-us' }
      ]
    },
    {
      title: t('home.ourImpact'),
      href: '/our-impact',
      submenu: [
        { title: t('navDropdowns.ourImpact.studentStats'), href: '/our-impact' },
        { title: t('navDropdowns.ourImpact.courseOfferings'), href: '/our-impact' },
        { title: t('navDropdowns.ourImpact.successMetrics'), href: '/our-impact' },
        { title: t('navDropdowns.ourImpact.tutorNetwork'), href: '/our-impact' }
      ]
    },
    {
      title: t('home.testimonials'),
      href: '/testimonials',
      submenu: [
        { title: t('navDropdowns.testimonials.studentTestimonials'), href: '/testimonials' },
        { title: t('navDropdowns.testimonials.alumniStories'), href: '/testimonials' },
        { title: t('navDropdowns.testimonials.successCases'), href: '/testimonials' }
      ]
    },
    {
      title: t('home.newsEvents'),
      href: '/news-events',
      submenu: [
        { title: t('navDropdowns.newsEvents.latestNews'), href: '/news-events' },
        { title: t('navDropdowns.newsEvents.upcomingEvents'), href: '/news-events' },
        { title: t('navDropdowns.newsEvents.academicAnnouncements'), href: '/news-events' }
      ]
    },
    {
      title: t('nav.academicCalendar'),
      href: '/calendar',
      submenu: [
        { title: t('calendar.hijriCalendar'), href: '/calendar' },
        { title: t('calendar.gregorianCalendar'), href: '/calendar' },
        { title: t('calendar.islamicSpecialDays'), href: '/calendar' },
        { title: t('calendar.instituteScheduleDays'), href: '/calendar' }
      ]
    },
    {
      title: t('home.schoolLife'),
      href: '/school-life',
      submenu: [
        { title: t('navDropdowns.schoolLife.campusFacilities'), href: '/school-life' },
        { title: t('navDropdowns.schoolLife.studentActivities'), href: '/school-life' },
        { title: t('navDropdowns.schoolLife.clubsOrganizations'), href: '/school-life' },
        { title: t('navDropdowns.schoolLife.sportsRecreation'), href: '/school-life' }
      ]
    },
    {
      title: t('home.ourContact'),
      href: '/contact-us',
      submenu: [
        { title: t('navDropdowns.ourContact.contactDetails'), href: '/contact-us' },
        { title: t('navDropdowns.ourContact.locationDirections'), href: '/contact-us' },
        { title: t('navDropdowns.ourContact.supportServices'), href: '/contact-us' },
        { title: t('navDropdowns.ourContact.sendInquiry'), href: '/contact-us' }
      ]
    }
  ];

  const toggleMobileDropdown = (index) => {
    setMobileActiveDropdown(mobileActiveDropdown === index ? null : index);
  };

  return (
    <nav className={`main-nav w-full ${className}`} aria-label="Main navigation">
      <div className="mx-0">
        {/* Desktop Navigation */}
        <ul className={`hidden md:flex ${language === 'ar' ? 'flex-row-reverse' : ''} justify-around flex-wrap`}>
          {menuItems.map((item, index) => (
            <li 
              key={index} 
              className="relative" 
              onMouseEnter={() => setActiveDropdown(index)} 
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={item.href}
                className="text-tertiary hover:text-link transition-colors py-2 px-2 lg:px-3 block text-sm lg:text-base whitespace-nowrap"
              >
                {item.title}
              </Link>
              {activeDropdown === index && item.submenu && (
                <ul className={`absolute top-full ${language === 'ar' ? 'right-0' : 'left-0'} bg-tertiary shadow-lg border rounded border-tertiary py-2 min-w-[12rem] z-50`}>
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={subItem.href}
                        className="block px-4 py-2 text-sm text-text hover:bg-gray-50 hover:text-link transition-colors"
                      >
                        {subItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Navigation */}
        <ul className="md:hidden space-y-1">
          {menuItems.map((item, index) => (
            <li key={index} className="border-b border-accent/20 last:border-0">
              <div>
                <button
                  onClick={() => toggleMobileDropdown(index)}
                  className="w-full text-left text-tertiary hover:text-link transition-colors py-2 px-2 flex justify-between items-center text-sm"
                >
                  <span>{item.title}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${mobileActiveDropdown === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileActiveDropdown === index && item.submenu && (
                  <ul className="bg-tertiary/50 py-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={subItem.href}
                          className="block px-6 py-2 text-xs text-warning hover:bg-white/10 hover:text-link transition-colors"
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MainNav;