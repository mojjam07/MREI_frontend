import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Mail,
  Clock,
  User,
  Star,
  Archive,
  Trash2,
  Send,
  Plus,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import apiClient from '../../services/apiClient';

import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingOverlay from '../ui/LoadingOverlay';

const AlumniMessages = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [composeMode, setComposeMode] = useState(false);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    priority: 'normal'
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/alumni-messages');
      const messagesData = response.data.data || [];
      
      // Sort messages by date (most recent first)
      const sortedMessages = messagesData.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to sample data if API fails
      setMessages([
        {
          id: 1,
          subject: 'Welcome to the Alumni Network',
          content: 'Dear Alumni, Welcome to our newly redesigned alumni dashboard! We are excited to bring you closer to your alma mater and fellow graduates. This platform will serve as your hub for staying connected, accessing resources, and participating in alumni activities.',
          sender: 'Alumni Administration',
          sender_type: 'admin',
          priority: 'high',
          is_read: false,
          created_at: '2024-01-15T10:00:00Z',
          category: 'announcement'
        },
        {
          id: 2,
          subject: 'Annual Alumni Reunion - Registration Open',
          content: 'We are pleased to announce that registration is now open for our Annual Alumni Reunion 2024. This year\'s event will feature keynote speakers, networking sessions, and campus tours. Don\'t miss this opportunity to reconnect with classmates and see how our institution has evolved.',
          sender: 'Dr. Ahmed Hassan - Alumni President',
          sender_type: 'executive',
          priority: 'high',
          is_read: false,
          created_at: '2024-01-10T14:30:00Z',
          category: 'event'
        },
        {
          id: 3,
          subject: 'Scholarship Opportunities for Alumni Children',
          content: 'We are pleased to inform you about new scholarship opportunities specifically designed for the children of our alumni. These scholarships are merit-based and renewable for up to four years. Application deadline is March 1st, 2024.',
          sender: 'Scholarship Committee',
          sender_type: 'admin',
          priority: 'medium',
          is_read: true,
          created_at: '2024-01-08T09:15:00Z',
          category: 'scholarship'
        },
        {
          id: 4,
          subject: 'Mentorship Program Launch',
          content: 'We are launching a mentorship program that connects recent graduates with experienced alumni in their respective fields. If you are interested in mentoring the next generation or seeking mentorship, please register through the alumni portal.',
          sender: 'Career Services Office',
          sender_type: 'admin',
          priority: 'medium',
          is_read: true,
          created_at: '2024-01-05T16:45:00Z',
          category: 'program'
        },
        {
          id: 5,
          subject: 'Alumni Directory Update Request',
          content: 'Please take a moment to update your profile information in our alumni directory. This helps us maintain accurate contact information and enables better networking opportunities among our alumni community.',
          sender: 'Alumni Relations Team',
          sender_type: 'admin',
          priority: 'low',
          is_read: true,
          created_at: '2024-01-02T11:20:00Z',
          category: 'administrative'
        },
        {
          id: 6,
          subject: 'New Alumni Website Features',
          content: 'We have recently launched several new features on our alumni website, including an enhanced events calendar, improved search functionality, and a mobile-responsive design. Explore these new features and let us know your feedback!',
          sender: 'IT Department',
          sender_type: 'admin',
          priority: 'low',
          is_read: true,
          created_at: '2023-12-28T13:00:00Z',
          category: 'update'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await apiClient.patch(`/admin/messages/${messageId}/read`);
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
      // Update locally even if API fails
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.subject || !newMessage.content) {
      alert('Please fill in both subject and content fields.');
      return;
    }

    try {
      const response = await apiClient.post('/admin/messages', {
        ...newMessage,
        recipient_type: 'admin'
      });
      
      setMessages([response.data.data, ...messages]);
      setNewMessage({ subject: '', content: '', priority: 'normal' });
      setComposeMode(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const filteredMessages = messages.filter(message => {
    switch (filter) {
      case 'unread':
        return !message.is_read;
      case 'read':
        return message.is_read;
      default:
        return true;
    }
  });

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-100 text-red-800 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'announcement': MessageCircle,
      'event': Calendar,
      'scholarship': Star,
      'program': User,
      'administrative': Archive,
      'update': Send
    };
    const IconComponent = icons[category] || MessageCircle;
    return <IconComponent className="w-4 h-4" />;
  };

  const unreadCount = messages.filter(msg => !msg.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingOverlay 
          isLoading={true} 
          loadingText={t('common.loading')} 
          overlayColor="transparent"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{color: 'var(--text-color)'}}>
            {t('alumni.alumniMessage')}
          </h1>
          <p className="text-lg" style={{color: 'var(--text-secondary)'}}>
            {t('alumni.messageFromAdmin')}
          </p>
          {unreadCount > 0 && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} {t('alumni.unreadMessages')}
              </span>
            </div>
          )}
        </div>
        <Button onClick={() => setComposeMode(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('alumni.composeMessage')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5" style={{color: 'var(--text-secondary)'}} />
          <span className="font-medium" style={{color: 'var(--text-color)'}}>
            Filter:
          </span>
          <div className="flex gap-2">
            {[
              { key: 'all', label: t('alumni.filters.allMessages') },
              { key: 'unread', label: t('alumni.filters.unreadMessages') },
              { key: 'read', label: t('alumni.filters.readMessages') }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === filterOption.key
                    ? 'text-white shadow-md'
                    : 'hover:shadow-sm'
                }`}
                style={{
                  backgroundColor: filter === filterOption.key ? 'var(--primary-color)' : 'var(--accent-color)',
                  color: filter === filterOption.key ? 'var(--light-text)' : 'var(--text-color)'
                }}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card 
            key={message.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              !message.is_read ? 'border-l-4 border-blue-500' : ''
            }`}
            onClick={() => {
              setSelectedMessage(message);
              if (!message.is_read) {
                markAsRead(message.id);
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`text-lg font-semibold ${!message.is_read ? 'font-bold' : ''}`} style={{color: 'var(--text-color)'}}>
                    {message.subject}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(message.priority)}`}>
                    {message.priority}
                  </span>
                  {!message.is_read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm mb-2">
                  <span style={{color: 'var(--text-secondary)'}}>
                    {t('alumni.from')}: {message.sender}
                  </span>
                  <span style={{color: 'var(--text-secondary)'}}>
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-sm line-clamp-2" style={{color: 'var(--text-secondary)'}}>
                  {message.content}
                </p>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                {getCategoryIcon(message.category)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMessages.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
            <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-color)'}}>
              {t('alumni.placeholders.noMessages')}
            </h3>
            <p style={{color: 'var(--text-secondary)'}}>
              {filter === 'unread' 
                ? 'No unread messages at the moment.' 
                : 'No messages found for the selected filter.'
              }
            </p>
          </div>
        </Card>
      )}

      {/* Compose Message Modal */}
      {composeMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{color: 'var(--text-color)'}}>
                  {t('alumni.composeMessage')}
                </h2>
                <button
                  onClick={() => setComposeMode(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>
                    {t('alumni.subject')}
                  </label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter message subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>
                    {t('alumni.priority')}
                  </label>
                  <select
                    value={newMessage.priority}
                    onChange={(e) => setNewMessage({...newMessage, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">{t('alumni.priority.low')}</option>
                    <option value="normal">{t('alumni.priority.normal')}</option>
                    <option value="high">{t('alumni.priority.high')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>
                    {t('alumni.content')}
                  </label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your message content"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleSendMessage} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  {t('alumni.actions.send')}
                </Button>
                <Button variant="outline" onClick={() => setComposeMode(false)}>
                  {t('alumni.actions.cancel')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && !composeMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2" style={{color: 'var(--text-color)'}}>
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority} Priority
                    </span>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                      {selectedMessage.category}
                    </span>
                  </div>
                  <div className="text-sm" style={{color: 'var(--text-secondary)'}}>
                    <p><strong>{t('alumni.from')}:</strong> {selectedMessage.sender}</p>
                    <p><strong>{t('alumni.date')}:</strong> {new Date(selectedMessage.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="prose max-w-none">
                <p style={{color: 'var(--text-secondary)', lineHeight: '1.6'}}>
                  {selectedMessage.content}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={() => setSelectedMessage(null)}>
                  {t('alumni.actions.close')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniMessages;
