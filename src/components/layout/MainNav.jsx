import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const MainNav = ({ className = '' }) => {
  const { t, language } = useLanguage();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);

  const menuItems = [
    {
      title: t('nav.about') || 'About',
      href: '#',
      submenu: [
        { title: t('nav.missionVision') || 'Mission & Vision', href: '#' },
        { title: t('nav.history') || 'History', href: '#' },
        { title: t('nav.leadership') || 'Leadership', href: '#' },
        { title: t('nav.campusMap') || 'Campus Map', href: '#' },
        { title: t('nav.diversity') || 'Diversity & Inclusion', href: '#' }
      ]
    },
    {
      title: t('nav.academics') || 'Academics',
      href: '#',
      submenu: [
        { title: t('nav.undergraduate') || 'Undergraduate Programs', href: '#' },
        { title: t('nav.graduate') || 'Graduate Programs', href: '#' },
        { title: t('nav.colleges') || 'Colleges & Schools', href: '#' },
        { title: t('nav.academicCalendar') || 'Academic Calendar', href: '#' },
        { title: t('nav.library') || 'Library', href: '#' }
      ]
    },
    {
      title: t('nav.admissions') || 'Admissions',
      href: '#',
      submenu: [
        { title: t('nav.undergraduateAdmission') || 'Undergraduate Admission', href: '#' },
        { title: t('nav.graduateAdmission') || 'Graduate Admission', href: '#' },
        { title: t('nav.tuition') || 'Tuition & Aid', href: '#' },
        { title: t('nav.visitCampus') || 'Visit Campus', href: '#' },
        { title: t('nav.applyNow') || 'Apply Now', href: '#' }
      ]
    },
    {
      title: t('nav.studentLife') || 'Student Life',
      href: '#',
      submenu: [
        { title: t('nav.housing') || 'Housing', href: '#' },
        { title: t('nav.dining') || 'Dining', href: '#' },
        { title: t('nav.organizations') || 'Student Organizations', href: '#' },
        { title: t('nav.athletics') || 'Athletics', href: '#' },
        { title: t('nav.health') || 'Health & Wellness', href: '#' }
      ]
    },
    {
      title: t('nav.alumni') || 'Alumni',
      href: '#',
      submenu: [
        { title: t('nav.alumniAssociation') || 'Alumni Association', href: '#' },
        { title: t('nav.alumniEvents') || 'Events', href: '#' },
        { title: t('nav.giveBack') || 'Give Back', href: '#' },
        { title: t('nav.alumniResources') || 'Alumni Resources', href: '#' },
        { title: t('nav.alumniStories') || 'Alumni Stories', href: '#' }
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
              <a
                href={item.href}
                className="text-tertiary hover:text-link transition-colors py-2 px-2 lg:px-3 block text-sm lg:text-base whitespace-nowrap"
              >
                {item.title}
              </a>
              {activeDropdown === index && item.submenu && (
                <ul className={`absolute top-full ${language === 'ar' ? 'right-0' : 'left-0'} bg-tertiary shadow-lg border border-tertiary py-2 min-w-[12rem] z-50`}>
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <a
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-text hover:bg-gray-50 hover:text-link transition-colors"
                      >
                        {subItem.title}
                      </a>
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
                        <a
                          href={subItem.href}
                          className="block px-6 py-2 text-xs text-warning hover:bg-white/10 hover:text-link transition-colors"
                        >
                          {subItem.title}
                        </a>
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