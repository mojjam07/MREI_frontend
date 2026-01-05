import React, { useState } from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';

const ContactMessagesSection = ({
  t,
  contactMessages = [],
  unreadMessages = [],
  contactMessagesLoading,
  markAsRead,
  replyContactMessage,
  deleteContactMessage
}) => {
  const safeContactMessages = safeArray(contactMessages);
  const safeUnreadMessages = safeArray(unreadMessages);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyData, setReplyData] = useState({ reply: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReplyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startReply = (message) => {
    setReplyingTo(message.id);
    setReplyData({ reply: '' });
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyData({ reply: '' });
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyData.reply.trim()) return;
    
    setIsSubmitting(true);
    try {
      await replyContactMessage({ 
        id: replyingTo, 
        reply: replyData.reply 
      });
      setReplyingTo(null);
      setReplyData({ reply: '' });
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await markAsRead(messageId);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteContactMessage(messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (contactMessagesLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card p-4 sm:p-6 animate-pulse-gentle"
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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 animate-fade-in-up">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
            <span className="truncate">{t('dashboard.contactMessages') || 'Contact Messages'}</span>
          </h2>
          <p className="text-sm sm:text-base text-light-text/80 hidden sm:block">
            {t('dashboard.contactMessagesDescription') || 'Review and respond to contact form submissions'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-light-text/60">
          <span className="glass-card px-2 sm:px-3 py-1 rounded-full">
            {safeUnreadMessages.length} {t('dashboard.unread') || 'unread'}
          </span>
        </div>
      </div>

      {/* Messages Grid */}
      <div className="grid gap-4 sm:gap-6">
        {safeContactMessages.length > 0 ? (
          safeContactMessages.map((message, index) => (
            <div
              key={message.id || index}
              className={`glass-card p-4 sm:p-6 transition-all duration-300 hover-lift animate-scale-in ${
                message.is_read ? 'glow-blue border-white/20 hover:border-white/40' : 'glow-coral border-coral/30'
              }`}
              style={{ animationDelay: `${index * 75}ms` }}
            >
              {/* Reply Form */}
              {replyingTo === message.id && (
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 glass-card border border-coral/30 animate-fade-in-up hover-glow-coral">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 pb-2 border-b border-white/10">
                    <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
                    <h4 className="text-xs sm:text-sm font-medium text-primary-text">
                      {t('dashboard.replyTo') || 'Replying to'} {message.name}
                    </h4>
                  </div>
                  <form onSubmit={handleReplySubmit}>
                    <textarea
                      name="reply"
                      value={replyData.reply}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary resize-vertical text-sm sm:text-base"
                      placeholder={t('dashboard.enterReply') || 'Enter your reply...'}
                      required
                    />
                    <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-success-color to-green-600 text-primary rounded-lg font-medium hover-lift hover-scale transition-all disabled:opacity-50 text-xs sm:text-sm"
                      >
                        {isSubmitting ? (t('dashboard.sending') || 'Sending...') : (t('dashboard.sendReply') || 'Send Reply')}
                      </button>
                      <button
                        type="button"
                        onClick={cancelReply}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 glass-card text-primary-text rounded-lg font-medium hover-lift hover-scale transition-all border border-white/20 hover:border-white/40 text-xs sm:text-sm"
                      >
                        {t('dashboard.cancel') || 'Cancel'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Existing Reply Display */}
              {message.reply && (
                <div className="mb-3 p-2 sm:p-3 bg-success-color/10 rounded-lg border border-success-color/30">
                  <p className="text-xs font-medium text-success-color mb-1">
                    {t('dashboard.yourReply') || 'Your Reply'} - {safeFormatDate(message.reply_date)}
                  </p>
                  <p className="text-xs sm:text-sm text-primary-text">{message.reply}</p>
                </div>
              )}

              <div className="flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2 sm:mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
                    <h3 className="text-base sm:text-lg font-semibold text-primary-text truncate">
                      {safeString(message.name, 'Anonymous')}
                    </h3>
                    {!message.is_read && (
                      <span className="px-1.5 sm:px-2 py-0.5 rounded text-xs bg-warning-color/20 text-warning-color animate-bounce-in flex-shrink-0">
                        {t('dashboard.new') || 'NEW'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <p className="text-xs sm:text-sm text-primary-text/80 mb-2 sm:mb-3 line-clamp-2">
                  {safeString(message.message, 'No message')}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-light-text/60 mb-2 sm:mb-3">
                  <span className="flex items-center gap-1">
                    <span className="hidden sm:inline">{t('dashboard.email') || 'Email'}:</span>
                    <span className="sm:hidden">✉:</span>
                    {safeString(message.email, 'N/A')}
                  </span>
                  {message.phone && (
                    <span className="flex items-center gap-1">
                      <span className="hidden sm:inline">{t('dashboard.phone') || 'Phone'}:</span>
                      <span className="sm:hidden">📱:</span>
                      {safeString(message.phone)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <span className="hidden sm:inline">{t('dashboard.received') || 'Received'}:</span>
                    <span className="sm:hidden">📅:</span>
                    {safeFormatDate(message.created_at)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full pt-2 border-t border-white/10">
                  {!message.reply && (
                    <button 
                      onClick={() => startReply(message)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-success-color/20 to-green-500/20 text-success-color rounded-lg hover-lift hover-scale transition-all duration-300 border border-success-color/30 hover:border-success-color/50 text-xs sm:text-sm flex items-center justify-center gap-1"
                    >
                      {t('dashboard.reply') || 'Reply'}
                    </button>
                  )}
                  {!message.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary/20 to-coral/20 text-primary rounded-lg hover-lift hover-scale transition-all duration-300 border border-primary/30 hover:border-primary/50 text-xs sm:text-sm flex items-center justify-center gap-1"
                    >
                      {t('dashboard.markRead') || 'Mark Read'}
                    </button>
                  )}
                  {message.is_read && (
                    <span className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-success-color/20 to-green-500/20 text-success-color rounded-lg border border-success-color/30 text-xs sm:text-sm flex items-center justify-center gap-1">
                      {t('dashboard.messageRead') || 'Message Read'}
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 glass-card text-error-color rounded-lg hover-lift hover-scale transition-all duration-300 border border-error-color/30 hover:border-error-color/50 hover:text-error-color/80 text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    {t('dashboard.delete') || 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-8 sm:p-12 text-center animate-fade-in-up">
            <p className="text-base sm:text-lg text-primary-text/60">
              {t('dashboard.noMessages') || 'No contact messages'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessagesSection;

