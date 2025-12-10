import React from 'react';
import { useTranslation } from 'react-i18next';

const TutorDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard">
      <h1>{t('dashboard')}</h1>
      <p>{t('welcome_message')}</p>
    </div>
  );
};

export default TutorDashboard;
