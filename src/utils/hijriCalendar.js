import HijriDate from 'hijri-date';

// Arabic numerals mapping
const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

// Hijri month information with correct day counts
const hijriMonths = [
  { name: 'muharram', days: 30, arabicName: 'محرم' },
  { name: 'safar', days: 29, arabicName: 'صفر' },
  { name: 'rabiAlAwwal', days: 30, arabicName: 'ربيع الأول' },
  { name: 'rabiAlThani', days: 29, arabicName: 'ربيع الثاني' },
  { name: 'jumadaAlAwwala', days: 30, arabicName: 'جمادى الأولى' },
  { name: 'jumadaAlThaniya', days: 29, arabicName: 'جمادى الثانية' },
  { name: 'rajab', days: 30, arabicName: 'رجب' },
  { name: 'shaaban', days: 29, arabicName: 'شعبان' },
  { name: 'ramadan', days: 30, arabicName: 'رمضان' },
  { name: 'shawwal', days: 29, arabicName: 'شوال' },
  { name: 'dhuAlQiidah', days: 30, arabicName: 'ذو القعدة' },
  { name: 'dhuAlHijjah', days: 29, arabicName: 'ذو الحجة' }
];

/**
 * Convert Gregorian date to Hijri date
 * @param {Date} date - Gregorian date
 * @returns {Object} Hijri date object
 */
export const gregorianToHijri = (date) => {
  const hijriDate = new HijriDate(date);
  return {
    year: hijriDate.iYear,
    month: hijriDate.iMonth,
    day: hijriDate.iDate,
    monthName: hijriMonths[hijriDate.iMonth - 1]?.name || 'unknown',
    monthNameAr: hijriMonths[hijriDate.iMonth - 1]?.arabicName || 'غير محدد',
    daysInMonth: hijriMonths[hijriDate.iMonth - 1]?.days || 30
  };
};

/**
 * Convert Hijri date to Gregorian date
 * @param {number} hijriYear - Hijri year
 * @param {number} hijriMonth - Hijri month (1-12)
 * @param {number} hijriDay - Hijri day
 * @returns {Date} Gregorian date
 */
export const hijriToGregorian = (hijriYear, hijriMonth, hijriDay) => {
  const hijriDate = new HijriDate(true, hijriYear, hijriMonth, hijriDay);
  return new Date(hijriDate.toGregorian());
};

/**
 * Get Hijri month information
 * @param {number} monthIndex - Month index (1-12)
 * @returns {Object} Month information
 */
export const getHijriMonthInfo = (monthIndex) => {
  return hijriMonths[monthIndex - 1] || hijriMonths[0];
};

/**
 * Get number of days in Hijri month
 * @param {number} year - Hijri year
 * @param {number} month - Hijri month (1-12)
 * @returns {number} Number of days in month
 */
export const getHijriMonthDays = (year, month) => {
  const monthInfo = getHijriMonthInfo(month);
  
  // Check for leap year in 12th month (Dhu Al-Hijjah)
  if (month === 12) {
    // Hijri leap year calculation (years divisible by 30 in a 30-year cycle)
    // More complex calculation, but for simplicity we'll use basic pattern
    const isLeapYear = ((year * 11) % 30) < 11;
    return isLeapYear ? 30 : 29;
  }
  
  return monthInfo.days;
};

/**
 * Get Hijri calendar days for a specific month
 * @param {number} year - Hijri year
 * @param {number} month - Hijri month (1-12)
 * @returns {Array} Array of days with date information
 */
export const getHijriCalendarDays = (year, month) => {
  const daysInMonth = getHijriMonthDays(year, month);
  const days = [];
  
  // Get the first day of the month in Gregorian calendar
  const firstDayGregorian = hijriToGregorian(year, month, 1);
  const firstDayOfWeek = firstDayGregorian.getDay(); // 0 = Sunday
  
  // Calculate starting day (Saturday = 6 in Islamic calendar)
  const islamicStartDay = (firstDayOfWeek + 1) % 7; // Convert to Islamic week start
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < islamicStartDay; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const gregorianDate = hijriToGregorian(year, month, day);
    const hijriDate = gregorianToHijri(gregorianDate);
    
    days.push({
      day,
      hijriDate,
      gregorianDate,
      isToday: isToday(gregorianDate),
      isIslamicHoliday: isIslamicHoliday(hijriDate)
    });
  }
  
  return days;
};

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is today
 */
const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

/**
 * Check if a Hijri date is an Islamic holiday
 * @param {Object} hijriDate - Hijri date object
 * @returns {boolean} True if date is an Islamic holiday
 */
const isIslamicHoliday = (hijriDate) => {
  // Islamic holidays (fixed Hijri dates)
  const holidays = [
    // 1 Muharram - Hijri New Year
    { month: 1, day: 1, name: 'hijriNewYear' },
    // 9 Muharram - Ashura
    { month: 1, day: 9, name: 'ashura' },
    // 12 Rabi Al-Awwal - Mawlid an-Nabi
    { month: 3, day: 12, name: 'mawlid' },
    // 1 Shawwal - Eid Al-Fitr
    { month: 10, day: 1, name: 'eidAlFitr' },
    // 10 Dhu Al-Hijjah - Eid Al-Adha
    { month: 12, day: 10, name: 'eidAlAdha' }
  ];
  
  return holidays.some(holiday => 
    holiday.month === hijriDate.month && holiday.day === hijriDate.day
  );
};

/**
 * Calculate Islamic holidays for a given Gregorian year
 * @param {number} year - Gregorian year
 * @returns {Array} Array of holiday objects
 */
export const calculateIslamicHolidays = (year) => {
  const holidays = [];
  
  // Calculate holidays for the year
  const holidayDates = [
    { name: 'hijriNewYear', month: 1, day: 1 },
    { name: 'ashura', month: 1, day: 9 },
    { name: 'mawlid', month: 3, day: 12 },
    { name: 'eidAlFitr', month: 10, day: 1 },
    { name: 'eidAlAdha', month: 12, day: 10 }
  ];
  
  holidayDates.forEach(holiday => {
    try {
      // Get approximate Gregorian date for the holiday
      // This is a simplified calculation - in reality, Islamic calendar calculations
      // require complex astronomical calculations
      const baseDate = new Date(year, 0, 1);
      const hijriDate = gregorianToHijri(baseDate);
      
      // Estimate the Gregorian date (this is approximate)
      // In a real implementation, you'd use more precise calculations
      const estimatedDate = hijriToGregorian(
        hijriDate.year + Math.floor((holiday.month - 1) / 12),
        holiday.month,
        holiday.day
      );
      
      holidays.push({
        ...holiday,
        gregorianDate: estimatedDate,
        nameKey: holiday.name
      });
    } catch (e) {
      console.warn(`Could not calculate date for holiday: ${holiday.name}`);
    }
  });
  
  return holidays;
};

/**
 * Convert English numerals to Arabic numerals
 * @param {string|number} num - Number to convert
 * @returns {string} Arabic numerals string
 */
export const toArabicNumerals = (num) => {
  const numStr = num.toString();
  return numStr.split('').map(digit => {
    if (digit >= '0' && digit <= '9') {
      return arabicNumerals[parseInt(digit)];
    }
    return digit;
  }).join('');
};

/**
 * Format Hijri date for display
 * @param {Object} hijriDate - Hijri date object
 * @param {string} format - Format type ('short', 'long', 'withYear')
 * @returns {string} Formatted date string
 */
export const formatHijriDate = (hijriDate, format = 'short') => {
  const day = toArabicNumerals(hijriDate.day);
  const month = hijriDate.monthNameAr;
  const year = toArabicNumerals(hijriDate.year);
  
  switch (format) {
    case 'short':
      return `${day} ${month}`;
    case 'long':
      return `${day} ${month} ${year}`;
    case 'withYear':
      return `${month} ${year}`;
    default:
      return `${day} ${month}`;
  }
};

/**
 * Get current Hijri date
 * @returns {Object} Current Hijri date
 */
export const getCurrentHijriDate = () => {
  return gregorianToHijri(new Date());
};

/**
 * Navigate Hijri calendar by months
 * @param {number} currentYear - Current Hijri year
 * @param {number} currentMonth - Current Hijri month
 * @param {number} direction - Direction (-1 for previous, 1 for next)
 * @returns {Object} New Hijri year and month
 */
export const navigateHijriMonth = (currentYear, currentMonth, direction) => {
  let newMonth = currentMonth + direction;
  let newYear = currentYear;
  
  if (newMonth < 1) {
    newMonth = 12;
    newYear -= 1;
  } else if (newMonth > 12) {
    newMonth = 1;
    newYear += 1;
  }
  
  return { year: newYear, month: newMonth };
};
