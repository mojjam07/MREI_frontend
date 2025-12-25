import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import SideNavigationLayout from '../../components/layout/SideNavigationLayout';

const SchoolLife = () => {
  const { t } = useLanguage();
  const { ref: facilitiesRef, animationClasses: facilitiesAnimation } = useScrollAnimation();
  const { ref: activitiesRef, animationClasses: activitiesAnimation } = useScrollAnimation();
  const { ref: clubsRef, animationClasses: clubsAnimation } = useScrollAnimation();
  const { ref: sportsRef, animationClasses: sportsAnimation } = useScrollAnimation();

  const facilities = t('schoolLife.facilities');
  const activities = t('schoolLife.activities');
  const clubs = t('schoolLife.clubs');
  const sports = t('schoolLife.sports');

  return (
    <SideNavigationLayout>
        {/* Content Header */}
        <div className="bg-white border-b border-gray-200 p-6 lg:p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
              {t('schoolLife.title')}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {t('schoolLife.subtitle')}
            </p>
          </div>
        </div>

        {/* Campus Facilities Section */}
        <section ref={facilitiesRef} className="py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className={`text-center mb-8 lg:mb-12 ${facilitiesAnimation}`}>
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                {t('schoolLife.campusFacilitiesTitle')}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                {t('schoolLife.campusFacilitiesDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {facilities.map((facility, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg hover-lift overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                      src={facility.image} 
                      alt={facility.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg lg:text-xl font-bold text-primary mb-3">
                      {facility.name}
                    </h3>
                    <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                      {facility.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Student Activities Section */}
        <section ref={activitiesRef} className="py-8 lg:py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className={`text-center mb-8 lg:mb-12 ${activitiesAnimation}`}>
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                {t('schoolLife.studentActivitiesTitle')}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                {t('schoolLife.studentActivitiesDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {activities.map((activity, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg shadow-lg hover-lift">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl lg:text-3xl">
                      {index === 0 && '👥'}
                      {index === 1 && '🤝'}
                      {index === 2 && '🚀'}
                      {index === 3 && '🎭'}
                    </span>
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-primary mb-2">
                    {activity.name}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 mb-3">
                    {activity.description}
                  </p>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {activity.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clubs & Organizations Section */}
        <section ref={clubsRef} className="py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className={`text-center mb-8 lg:mb-12 ${clubsAnimation}`}>
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                {t('schoolLife.clubsOrganizationsTitle')}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                {t('schoolLife.clubsOrganizationsDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {clubs.map((club, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow hover-lift text-center border-l-4 border-accent">
                  <div className="text-lg lg:text-xl font-semibold text-primary">
                    {club}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sports & Recreation Section */}
        <section ref={sportsRef} className="py-8 lg:py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className={`text-center mb-8 lg:mb-12 ${sportsAnimation}`}>
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                {t('schoolLife.sportsRecreationTitle')}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-3xl mx-auto">
                {t('schoolLife.sportsRecreationDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {sports.map((sport, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg hover-lift">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-2xl">
                        {index === 0 && '⚽'}
                        {index === 1 && '🏀'}
                        {index === 2 && '🏓'}
                        {index === 3 && '🏃'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg lg:text-xl font-bold text-primary mb-2">
                        {sport.name}
                      </h3>
                      <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                        {sport.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Campus Life Highlights Section */}
        <section className="py-8 lg:py-12">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-primary to-accent text-white p-8 lg:p-12 rounded-lg shadow-xl">
              <h2 className="text-xl lg:text-2xl font-bold mb-6">
                Experience Campus Life at Mahdu Rahmah
              </h2>
              <p className="text-sm lg:text-base text-white/90 mb-8">
                Join a vibrant community where learning extends beyond the classroom. 
                Discover new friendships, develop leadership skills, and create memories that last a lifetime.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">25+</div>
                  <div className="text-sm text-white/80">Student Clubs</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">100+</div>
                  <div className="text-sm text-white/80">Annual Events</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">12</div>
                  <div className="text-sm text-white/80">Sports Teams</div>
                </div>
              </div>

              <button className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-semibold">
                Join Our Community
              </button>
            </div>
          </div>
        </section>
    </SideNavigationLayout>
  );
};

export default SchoolLife;
