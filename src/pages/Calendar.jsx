import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import PageHeader from '../components/layout/PageHeader';
import Footer from '../components/layout/Footer';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { 
  gregorianToHijri, 
  hijriToGregorian, 
  getHijriCalendarDays, 
  getCurrentHijriDate, 
  navigateHijriMonth
} from '../utils/hijriCalendar';

const Calendar = () => {
  const { t } = useLanguage();
  const { ref: heroRef, animationClasses: heroAnimation } = useScrollAnimation();
  const { ref: cardsRef, animationClasses: cardsAnimation } = useScrollAnimation();
  const { ref: calendarRef, animationClasses: calendarAnimation } = useScrollAnimation();

  const [activeTab, setActiveTab] = useState('hijri');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hijriDate, setHijriDate] = useState(getCurrentHijriDate());

  // Helper function to get Gregorian month key
  const getGregorianMonthKey = (monthIndex) => {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    return months[monthIndex];
  };

  // Helper function to get Hijri month key
  const getHijriMonthKey = (monthIndex) => {
    const months = [
      'muharram', 'safar', 'rabiAlAwwal', 'rabiAlThani', 'jumadaAlAwwala', 'jumadaAlThaniya',
      'rajab', 'shaaban', 'ramadan', 'shawwal', 'dhuAlQiidah', 'dhuAlHijjah'
    ];
    return months[monthIndex - 1];
  };

  const navigateMonth = (direction) => {
    if (activeTab === 'hijri') {
      // Navigate Hijri calendar
      const { year: newYear, month: newMonth } = navigateHijriMonth(
        hijriDate.year, 
        hijriDate.month, 
        direction
      );
      setHijriDate(prev => ({ ...prev, year: newYear, month: newMonth }));
      
      // Update Gregorian date to match
      const gregorianDate = hijriToGregorian(newYear, newMonth, 1);
      setCurrentDate(gregorianDate);
    } else {
      // Navigate Gregorian calendar
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + direction);
      setCurrentDate(newDate);
      
      // Update Hijri date to match
      const newHijriDate = gregorianToHijri(newDate);
      setHijriDate(newHijriDate);
    }
  };

  const getDaysInMonth = () => {
    if (activeTab === 'hijri') {
      // Get Hijri calendar days
      return getHijriCalendarDays(hijriDate.year, hijriDate.month);
    } else {
      // Get Gregorian calendar days
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const hijriDateForDay = gregorianToHijri(date);
        days.push({
          day,
          gregorianDate: date,
          hijriDate: hijriDateForDay,
          isToday: isToday(date),
          isIslamicHoliday: hijriDateForDay.isIslamicHoliday || false
        });
      }
      
      return days;
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const islamicSpecialDays = [
    { name: t('calendar.islamicEvents.ramadan'), date: 'varies', color: 'bg-green-100 text-green-800' },
    { name: t('calendar.islamicEvents.eidAlFitr'), date: 'varies', color: 'bg-blue-100 text-blue-800' },
    { name: t('calendar.islamicEvents.eidAlAdha'), date: 'varies', color: 'bg-purple-100 text-purple-800' },
    { name: t('calendar.islamicEvents.mawlid'), date: 'varies', color: 'bg-yellow-100 text-yellow-800' },
    { name: t('calendar.islamicEvents.hijriNewYear'), date: 'varies', color: 'bg-red-100 text-red-800' },
    { name: t('calendar.islamicEvents.ashura'), date: 'varies', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const instituteScheduleDays = [
    { name: t('calendar.academicEvents.semesterStart'), date: 'Sept 1', color: 'bg-primary text-white' },
    { name: t('calendar.academicEvents.finalExams'), date: 'Dec 15-22', color: 'bg-red-600 text-white' },
    { name: t('calendar.academicEvents.midtermExams'), date: 'Oct 25-27', color: 'bg-orange-500 text-white' },
    { name: t('calendar.academicEvents.registrationPeriod'), date: 'Aug 15-30', color: 'bg-blue-600 text-white' },
    { name: t('calendar.academicEvents.graduation'), date: 'May 20', color: 'bg-green-600 text-white' },
    { name: t('calendar.academicEvents.orientation'), date: 'Aug 20-25', color: 'bg-purple-600 text-white' }
  ];

  const renderCalendarDays = () => {
    const days = getDaysInMonth();
    const dayNames = [
      t('calendar.daysOfWeek.saturday'),
      t('calendar.daysOfWeek.sunday'),
      t('calendar.daysOfWeek.monday'),
      t('calendar.daysOfWeek.tuesday'),
      t('calendar.daysOfWeek.wednesday'),
      t('calendar.daysOfWeek.thursday'),
      t('calendar.daysOfWeek.friday')
    ];

    return (
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((dayName) => (
          <div key={dayName} className="p-2 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded">
            {dayName}
          </div>
        ))}
        {days.map((dayData, index) => (
          <div
            key={index}
            className={`p-2 text-center text-sm h-16 flex flex-col items-center justify-center rounded cursor-pointer hover:bg-primary hover:text-white transition-colors ${
              dayData ? 'text-gray-900' : ''
            } ${dayData && dayData.isToday ? 'bg-tertiary text-primary font-bold' : ''} ${
              dayData && dayData.isIslamicHoliday ? 'bg-red-100 text-red-800 font-semibold' : ''
            }`}
          >
            {dayData ? (
              <>
                <span className="text-lg">
                  {activeTab === 'hijri' ? dayData.day : dayData.day}
                </span>
                {activeTab === 'hijri' && dayData.hijriDate && (
                  <span className="text-xs text-gray-500">
                    {dayData.hijriDate.day}/{dayData.hijriDate.month}
                  </span>
                )}
                {activeTab === 'gregorian' && dayData.hijriDate && (
                  <span className="text-xs text-gray-500">
                    {dayData.hijriDate.day}/{dayData.hijriDate.month}
                  </span>
                )}
              </>
            ) : null}
          </div>
        ))}
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      
      {/* Hero Section */}
      <section ref={heroRef} className="bg-primary text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center ${heroAnimation}`}>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
              {t('calendar.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed">
              {t('calendar.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section ref={cardsRef} className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 ${cardsAnimation}`}>
            {/* Islamic Special Days Card */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover-lift hover-glow transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <CalendarIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary">
                  {t('calendar.islamicSpecialDays')}
                </h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                {t('calendar.islamicSpecialDaysDesc')}
              </p>
              <div className="space-y-3">
                {islamicSpecialDays.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-900">{event.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${event.color}`}>
                      {event.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Institute Schedule Days Card */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover-lift hover-glow transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary">
                  {t('calendar.instituteScheduleDays')}
                </h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                {t('calendar.instituteScheduleDaysDesc')}
              </p>
              <div className="space-y-3">
                {instituteScheduleDays.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-900">{event.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${event.color}`}>
                      {event.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section ref={calendarRef} className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-4xl mx-auto ${calendarAnimation}`}>
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('hijri')}
                  className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                    activeTab === 'hijri'
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {t('calendar.calendarTabs.hijri')}
                </button>
                <button
                  onClick={() => setActiveTab('gregorian')}
                  className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                    activeTab === 'gregorian'
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {t('calendar.calendarTabs.gregorian')}
                </button>
              </div>
            </div>

            {/* Calendar Display */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-primary mb-1">
                    {activeTab === 'hijri'
                      ? t(`calendar.months.hijri.${getHijriMonthKey(hijriDate.month)}`)
                      : t(`calendar.months.gregorian.${getGregorianMonthKey(currentDate.getMonth())}`)
                    }
                  </h2>
                  <p className="text-gray-600">
                    {activeTab === 'hijri' ? hijriDate.year : currentDate.getFullYear()}
                  </p>
                  {activeTab === 'hijri' && (
                    <p className="text-sm text-gray-500">
                      {currentDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>



              {/* Calendar Grid */}
              <div className="mb-4">
                {renderCalendarDays()}
              </div>

              {/* Today Highlight */}
              <div className="text-center p-4 bg-tertiary rounded-lg">
                <p className="text-sm text-primary">
                  {t('calendar.today')}: {currentDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Calendar;
