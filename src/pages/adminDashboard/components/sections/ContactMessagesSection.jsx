import React, { useState } from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';

const ContactMessagesSection = ({ 
  t, 
  contactMessages = [], 
  unreadMessages = [], 
  contactMessagesLoading,
  updateContactMessage,
  markAsRead
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
      await updateContactMessage(replyingTo, { 
        reply: replyData.reply,
        reply_date: new Date().toISOString()
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
              className={`bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg p-6 border transition-all duration-300 hover-lift animate-fade-in-left shadow-xl shadow-primary/10 ${
                message.is_read ? 'border-white/10 hover:bg-gradient-to-br hover:from-dark-gradient-start/80 hover:to-dark-gradient-end/80' : 'border-coral/30 bg-gradient-to-br from-warning-color/10 to-coral/5'
              }`}
            >
              {/* Reply Form */}
              {replyingTo === message.id && (
                <div className="mb-4 p-4 bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg border border-coral/30 shadow-xl shadow-primary/10 animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-2 pb-2 border-b border-white/10">
                    <span className="w-1 h-4 bg-gradient-to-b from-primary to-coral rounded-full"></span>
                    <h4 className="text-sm font-medium text-light-text">
                      {t('dashboard.replyTo') || 'Replying to'} {message.name}
                    </h4>
                  </div>
                  <form onSubmit={handleReplySubmit}>
                    <textarea
                      name="reply"
                      value={replyData.reply}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
                      placeholder={t('dashboard.enterReply') || 'Enter your reply...'}
                      required
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-success-color text-white rounded-lg font-medium hover:bg-success-color/80 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? (t('dashboard.sending') || 'Sending...') : (t('dashboard.sendReply') || 'Send Reply')}
                      </button>
                      <button
                        type="button"
                        onClick={cancelReply}
                        className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg font-medium hover:bg-gray-500/30 transition-colors"
                      >
                        {t('dashboard.cancel') || 'Cancel'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Existing Reply Display */}
              {message.reply && (
                <div className="mb-4 p-3 bg-success-color/10 rounded-lg border border-success-color/30">
                  <p className="text-xs font-medium text-success-color mb-1">
                    {t('dashboard.yourReply') || 'Your Reply'} - {safeFormatDate(message.reply_date)}
                  </p>
                  <p className="text-sm text-light-text">{message.reply}</p>
                </div>
              )}

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
                  {!message.reply && (
                    <button 
                      onClick={() => startReply(message)}
                      className="px-3 py-1 bg-success-color/20 text-success-color rounded hover:bg-success-color/30 transition-colors"
                    >
                      {t('dashboard.reply') || 'Reply'}
                    </button>
                  )}
                  {!message.is_read && (
                    <button 
                      onClick={() => handleMarkAsRead(message.id)}
                      className="px-3 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
                    >
                      {t('dashboard.markRead') || 'Mark Read'}
                    </button>
                  )}
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

