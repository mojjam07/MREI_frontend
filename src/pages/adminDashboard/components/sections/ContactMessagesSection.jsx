import React from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';

const ContactMessagesSection = ({ t, contactMessages = [], unreadMessages = [], contactMessagesLoading }) => {
  const safeContactMessages = safeArray(contactMessages);
  const safeUnreadMessages = safeArray(unreadMessages);

  if (contactMessagesLoading) {
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
            {t('dashboard.contactMessages') || 'Contact Messages'}
          </h2>
          <p className="text-light-text/80 animate-fade-in-up delay-100">
            {t('dashboard.contactMessagesDescription') || 'Review and respond to contact form submissions'}
          </p>
        </div>
        <div className="text-sm text-light-text/60 animate-fade-in-up delay-200">
          {safeUnreadMessages.length} {t('dashboard.unread') || 'unread'}
        </div>
      </div>

      {/* Messages Grid */}
      <div className="grid gap-6">
        {safeContactMessages.length > 0 ? (
          safeContactMessages.map((message, index) => (
            <div
              key={message.id || index}
              className={`bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border transition-all duration-300 hover-lift animate-fade-in-left ${
                message.is_read ? 'border-white/20 hover:bg-white/20' : 'border-warning-color/50 bg-warning-color/5'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-light-text">{safeString(message.name, 'Anonymous')}</h3>
                    {!message.is_read && (
                      <span className="px-2 py-1 rounded text-xs bg-warning-color/20 text-warning-color animate-bounce-in">
                        {t('dashboard.new') || 'NEW'}
                      </span>
                    )}
                  </div>
                  <p className="text-light-text/80 text-sm mb-3">{safeString(message.message, 'No message')}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-light-text/60">
                    <span>
                      {t('dashboard.email') || 'Email'}: {safeString(message.email, 'N/A')}
                    </span>
                    <span>
                      {t('dashboard.phone') || 'Phone'}: {safeString(message.phone, 'N/A')}
                    </span>
                    <span>
                      {t('dashboard.received') || 'Received'}: {safeFormatDate(message.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  <button className="px-3 py-1 bg-success-color/20 text-success-color rounded hover:bg-success-color/30 transition-colors">
                    {t('dashboard.reply') || 'Reply'}
                  </button>
                  <button className="px-3 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors">
                    {t('dashboard.markRead') || 'Mark Read'}
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
            <p className="text-light-text/60 text-lg">{t('dashboard.noMessages') || 'No contact messages'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessagesSection;
