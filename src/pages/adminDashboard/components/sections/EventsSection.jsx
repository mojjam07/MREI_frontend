import React from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';

const EventsSection = ({ t, events = [], eventsLoading }) => {
  const safeEvents = safeArray(events);

  if (eventsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border border-white/20 animate-pulse-gentle"
          >
            <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/20 rounded w-full mb-1"></div>
            <div className="h-3 bg-white/20 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-light-text mb-2 animate-fade-in-up">
            {t('dashboard.eventsManagement') || 'Events Management'}
          </h2>
          <p className="text-light-text/80 animate-fade-in-up delay-100">
            {t('dashboard.eventsDescription') || 'Manage university events and activities'}
          </p>
        </div>
        <button className="px-6 py-3 bg-primary text-light-text rounded-lg font-medium transition-all hover:scale-105 hover-lift animate-bounce-in">
          {t('dashboard.addEvent') || 'Add Event'}
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6">
        {safeEvents.length > 0 ? (
          safeEvents.map((event, index) => (
            <div
              key={event.id || index}
              className="bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-accent-color/30 transition-all duration-300 hover-lift animate-fade-in-left"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-light-text mb-2">{safeString(event.title, 'Untitled')}</h3>
                  <p className="text-light-text/80 text-sm mb-3">{safeString(event.description, 'No description')}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-light-text/60">
                    <span>
                      {t('dashboard.date') || 'Date'}: {safeFormatDate(event.date)}
                    </span>
                    <span>
                      {t('dashboard.location') || 'Location'}: {safeString(event.location, 'TBD')}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        event.status === 'upcoming' ? 'bg-primary/20 text-primary' : 'bg-success-color/20 text-success-color'
                      }`}
                    >
                      {safeString(event.status, 'upcoming')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  <button className="px-3 py-1 bg-secondary-color/20 text-secondary-color rounded hover:bg-secondary-color/30 transition-colors">
                    {t('dashboard.edit') || 'Edit'}
                  </button>
                  <button className="px-3 py-1 bg-error-color/20 text-error-color rounded hover:bg-error-color/30 transition-colors">
                    {t('dashboard.delete') || 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 animate-fade-in-up">
            <p className="text-light-text/60 text-lg">{t('dashboard.noEvents') || 'No events scheduled yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsSection;
