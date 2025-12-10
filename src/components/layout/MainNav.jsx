import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const MainNav = ({ className = '' }) => {
  const { t, language } = useLanguage();
  const [activeDropdown, setActiveDropdown] = useState(null);

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
    // {
    //   title: t('nav.research') || 'Research',
    //   href: '#',
    //   submenu: [
    //     { title: t('nav.researchCenters') || 'Research Centers', href: '#' },
    //     { title: t('nav.facultyResearch') || 'Faculty Research', href: '#' },
    //     { title: t('nav.studentResearch') || 'Student Research', href: '#' },
    //     { title: t('nav.publications') || 'Publications', href: '#' },
    //     { title: t('nav.researchSupport') || 'Research Support', href: '#' }
    //   ]
    // },
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

  return (
    <nav className={`main-nav w-full ${className}`} aria-label="Main navigation">
      <div className="mx-0">
        <ul className={`flex ${language === 'ar' ? 'flex-row-reverse' : ''} justify-around`}>
          {menuItems.map((item, index) => (
            <li key={index} className="relative" onMouseEnter={() => setActiveDropdown(index)} onMouseLeave={() => setActiveDropdown(null)}>
              <a
                href={item.href}
                className="text-tertiary hover:text-link transition-colors py-1 px-2 block"
              >
                {item.title}
              </a>
              {activeDropdown === index && item.submenu && (
                <ul className={`absolute top-full ${language === 'ar' ? 'right-0' : 'left-0'} bg-tertiary shadow-lg border border-tertiary py-2 min-w-48 z-50`}>
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <a
                        href={subItem.href}
                        className="block px-4 py-2 text-text hover:bg-gray-50 hover:text-link transition-colors"
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
      </div>
    </nav>
  );
};

export default MainNav;
