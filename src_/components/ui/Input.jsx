import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Input = ({ label, className = '', ...props }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'text-right' : ''}`}
        {...props}
      />
    </div>
  );
};

export default Input;
