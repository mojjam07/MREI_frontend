import moment from 'moment-hijri';

export const gregorianToHijri = (date) => {
  const m = moment(date);
  return {
    day: m.iDate(),
    month: m.iMonth() + 1, // moment months are 0-indexed
    year: m.iYear()
  };
};

export const hijriToGregorian = (hijriDate) => {
  const m = moment(`${hijriDate.year}/${hijriDate.month}/${hijriDate.day}`, 'iYYYY/iM/iD');
  return m.toDate();
};

export const getCurrentHijriDate = () => {
  return gregorianToHijri(new Date());
};

export const getHijriMonthLength = (year, month) => {
  return moment.iDaysInMonth(year, month - 1);
};

export const getHijriCalendarDays = (baseDate) => {
  const hijriDate = gregorianToHijri(baseDate);
  const daysInMonth = getHijriMonthLength(hijriDate.year, hijriDate.month);
  
  // Find the first day of the Hijri month
  const firstDayOfMonth = moment(`${hijriDate.year}/${hijriDate.month}/1`, 'iYYYY/iM/iD');
  const startDayOfWeek = firstDayOfMonth.day(); // 0 (Sunday) to 6 (Saturday)
  
  const days = [];
  
  // Previous month padding
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({ day: null, isCurrentMonth: false });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ 
      day: i, 
      isCurrentMonth: true,
      hijri: { day: i, month: hijriDate.month, year: hijriDate.year },
      date: moment(`${hijriDate.year}/${hijriDate.month}/${i}`, 'iYYYY/iM/iD').toDate()
    });
  }
  
  // Next month padding to fill grid (42 cells)
  while (days.length < 42) {
    days.push({ day: null, isCurrentMonth: false });
  }
  
  return days;
};

export const navigateHijriMonth = (date, direction) => {
  const m = moment(date);
  direction > 0 ? m.add(1, 'iMonth') : m.subtract(1, 'iMonth');
  return m.toDate();
};

export const calculateIslamicHolidays = () => {
  return [
    { 
      name: 'Ramadan', 
      month: 9, 
      day: 1, 
      description: 'Month 9 - Varies annually based on moon sighting',
      varies: true 
    },
    { 
      name: 'Eid al-Fitr', 
      month: 10, 
      day: 1, 
      description: '1st of Shawwal - Varies annually (3 days after Ramadan)',
      varies: true 
    },
    { 
      name: 'Eid al-Adha', 
      month: 12, 
      day: 10, 
      description: '10th of Dhu al-Hijjah - Fixed date',
      varies: false 
    },
    { 
      name: 'Mawlid an-Nabi', 
      month: 3, 
      day: 12, 
      description: '12th of Rabi al-Awwal - Fixed date',
      varies: false 
    },
    { 
      name: 'Hijri New Year', 
      month: 1, 
      day: 1, 
      description: '1st of Muharram - Fixed date',
      varies: false 
    },
    { 
      name: 'Ashura', 
      month: 1, 
      day: 10, 
      description: '10th of Muharram - Fixed date',
      varies: false 
    }
  ];
};

// Translation keys for Hijri months (1-12)
const hijriMonthKeys = [
  'muharram', 'safar', 'rabiAlAwwal', 'rabiAlThani',
  'jumadaAlAwwala', 'jumadaAlThaniya', 'rajab', 'shaaban',
  'ramadan', 'shawwal', 'dhuAlQiidah', 'dhuAlHijjah'
];

// Translation keys for Gregorian months (0-11)
const gregorianMonthKeys = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

/**
 * Get Hijri month translation key
 * @param {number} month - Hijri month number (1-12)
 * @returns {string} Translation key for the month
 */
export const getHijriMonthKey = (month) => {
  if (month >= 1 && month <= 12) {
    return hijriMonthKeys[month - 1];
  }
  return 'muharram'; // Default fallback
};

/**
 * Get Gregorian month translation key
 * @param {number} month - Gregorian month number (0-11)
 * @returns {string} Translation key for the month
 */
export const getGregorianMonthKey = (month) => {
  if (month >= 0 && month <= 11) {
    return gregorianMonthKeys[month];
  }
  return 'january'; // Default fallback
};
