import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  Users,
  Hash,
  Lock,
  Star,
  MoreHorizontal,
  Phone,
  Video,
  Settings,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Smile as SmileIcon,
  ThumbsUp,
  Heart,
  Laugh,
  ThumbsDown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/apiClient';

import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingOverlay from '../ui/LoadingOverlay';

const AlumniGroupChat = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [data, setData] = useState({
    groups: [],
    messages: [],
    activeGroup: null
  });
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatData();
  }, []);

  useEffect(() => {
    if (data.activeGroup) {
      fetchMessages(data.activeGroup.id);
    }
  }, [data.activeGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [data.messages]);

  const fetchChatData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/chat-groups');
      const groupsData = response.data.data || [];
      
      setData(prev => ({
        ...prev,
        groups: groupsData
      }));
      
      // Auto-select first group if none selected
      if (groupsData.length > 0 && !data.activeGroup) {
        setData(prev => ({
          ...prev,
          activeGroup: groupsData[0]
        }));
      }
    } catch (error) {
      console.error('Error fetching chat groups:', error);
      // Fallback to sample data if API fails
      setData({
        groups: [
          {
            id: 1,
            name: 'Class of 2020 Alumni',
            description: 'Connect with fellow graduates from the class of 2020',
            type: 'class',
            isPrivate: false,
            memberCount: 156,
            unreadCount: 3,
            lastActivity: '2024-01-20T15:30:00Z',
            avatar: '/api/placeholder/50/50',
            isAdmin: true,
            isJoined: true
          },
          {
            id: 2,
            name: 'Computer Science Alumni',
            description: 'Alumni from Computer Science and IT programs',
            type: 'program',
            isPrivate: false,
            memberCount: 89,
            unreadCount: 0,
            lastActivity: '2024-01-20T14:15:00Z',
            avatar: '/api/placeholder/50/50',
            isAdmin: false,
            isJoined: true
          },
          {
            id: 3,
            name: 'Business Professionals',
            description: 'Alumni working in business and entrepreneurship',
            type: 'professional',
            isPrivate: true,
            memberCount: 234,
            unreadCount: 7,
            lastActivity: '2024-01-20T16:45:00Z',
            avatar: '/api/placeholder/50/50',
            isAdmin: false,
            isJoined: true
          },
          {
            id: 4,
            name: 'Riyadh Region Alumni',
            description: 'Alumni living and working in Riyadh region',
            type: 'location',
            isPrivate: false,
            memberCount: 78,
            unreadCount: 0,
            lastActivity: '2024-01-19T20:00:00Z',
            avatar: '/api/placeholder/50/50',
            isAdmin: false,
            isJoined: false
          }
        ],
        messages: [],
        activeGroup: null
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (groupId) => {
    try {
      const response = await apiClient.get(`/admin/chat-groups/${groupId}/messages`);
      const messagesData = response.data.data || [];
      
      setData(prev => ({
        ...prev,
        messages: messagesData
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to sample messages
      setData(prev => ({
        ...prev,
        messages: [
          {
            id: 1,
            content: 'Hello everyone! Great to see this group active again.',
            sender: {
              id: 1,
              name: 'Ahmed Al-Mansouri',
              avatar: '/api/placeholder/40/40',
              isAdmin: true
            },
            timestamp: '2024-01-20T14:30:00Z',
            type: 'text'
          },
          {
            id: 2,
            content: 'Thanks for creating this group! Looking forward to connecting with everyone.',
            sender: {
              id: 2,
              name: 'Sarah Al-Rashid',
              avatar: '/api/placeholder/40/40',
              isAdmin: false
            },
            timestamp: '2024-01-20T14:32:00Z',
            type: 'text'
          },
          {
            id: 3,
            content: 'Anyone interested in organizing a reunion this spring?',
            sender: {
              id: 3,
              name: 'Mohammed Al-Zahra',
              avatar: '/api/placeholder/40/40',
              isAdmin: false
            },
            timestamp: '2024-01-20T14:35:00Z',
            type: 'text'
          },
          {
            id: 4,
            content: 'Great idea! I would definitely attend.',
            sender: {
              id: 4,
              name: 'Fatima Al-Hassan',
              avatar: '/api/placeholder/40/40',
              isAdmin: false
            },
            timestamp: '2024-01-20T14:37:00Z',
            type: 'text'
          }
        ]
      }));
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !data.activeGroup) return;

    try {
      const response = await apiClient.post(`/admin/chat-groups/${data.activeGroup.id}/messages`, {
        content: messageText.trim(),
        type: 'text'
      });

      setData(prev => ({
        ...prev,
        messages: [...prev.messages, response.data.data]
      }));

      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add message locally for immediate feedback
      const newMessage = {
        id: Date.now(),
        content: messageText.trim(),
        sender: {
          id: user?.id || 0,
          name: user?.first_name + ' ' + user?.last_name || 'You',
          avatar: '/api/placeholder/40/40',
          isAdmin: false
        },
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      setData(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));

      setMessageText('');
    }
  };

  const joinGroup = async (groupId) => {
    try {
      await apiClient.post(`/admin/chat-groups/${groupId}/join`);
      
      setData(prev => ({
        ...prev,
        groups: prev.groups.map(group => 
          group.id === groupId 
            ? { ...group, isJoined: true, memberCount: group.memberCount + 1 }
            : group
        )
      }));
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      await apiClient.post(`/admin/chat-groups/${groupId}/leave`);
      
      setData(prev => ({
        ...prev,
        groups: prev.groups.map(group => 
          group.id === groupId 
            ? { ...group, isJoined: false, memberCount: group.memberCount - 1 }
            : group
        )
      }));
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGroupIcon = (type) => {
    switch (type) {
      case 'class':
        return '👥';
      case 'program':
        return '💻';
      case 'professional':
        return '💼';
      case 'location':
        return '📍';
      default:
        return '💬';
    }
  };

  const filteredGroups = data.groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {t('alumni.groupChat')}
          </h1>
          <p className="text-lg" style={{color: 'var(--text-secondary)'}}>
            Connect and chat with fellow alumni
          </p>
        </div>
        <Button onClick={() => alert('Group creation feature coming soon!')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
        {/* Groups List */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => data.activeGroup?.id === group.id ? null : setData(prev => ({ ...prev, activeGroup: group }))}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    data.activeGroup?.id === group.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {getGroupIcon(group.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate" style={{color: 'var(--text-color)'}}>
                            {group.name}
                          </h3>
                          {group.isPrivate && <Lock className="w-4 h-4 text-gray-500" />}
                          {group.isAdmin && <Star className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {group.description}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {group.memberCount}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(group.lastActivity)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {group.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {group.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  {!group.isJoined && (
                    <div className="mt-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          joinGroup(group.id);
                        }}
                        className="w-full"
                      >
                        Join Group
                      </Button>
                    </div>
                  )}
                  
                  {group.isJoined && (
                    <div className="mt-2 flex gap-2">
                      {group.isAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Group management features coming soon!');
                          }}
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Manage
                        </Button>
                      )}
                      {!group.isAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            leaveGroup(group.id);
                          }}
                        >
                          Leave
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            {data.activeGroup ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {getGroupIcon(data.activeGroup.type)}
                      </div>
                      <div>
                        <h2 className="font-semibold" style={{color: 'var(--text-color)'}}>
                          {data.activeGroup.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {data.activeGroup.memberCount} members
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => alert('Group details feature coming soon!')}>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {data.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender.name === user?.first_name + ' ' + user?.last_name ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                        message.sender.name === user?.first_name + ' ' + user?.last_name ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <img
                          src={message.sender.avatar}
                          alt={message.sender.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className={`rounded-lg px-3 py-2 ${
                          message.sender.name === user?.first_name + ' ' + user?.last_name
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100'
                        }`}>
                          <p className="text-sm font-medium mb-1">
                            {message.sender.name}
                            {message.sender.isAdmin && <Star className="inline w-3 h-3 ml-1" />}
                          </p>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender.name === user?.first_name + ' ' + user?.last_name ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                {data.activeGroup.isJoined && (
                  <div className="p-4 border-t">
                    <div className="flex items-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <div className="flex-1">
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          placeholder="Type your message..."
                          rows={1}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <SmileIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={sendMessage}
                        disabled={!messageText.trim()}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {!data.activeGroup.isJoined && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-color)'}}>
                        Join the conversation
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Join this group to start chatting with other alumni.
                      </p>
                      <Button onClick={() => joinGroup(data.activeGroup.id)}>
                        Join Group
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-color)'}}>
                    Select a group to start chatting
                  </h3>
                  <p className="text-gray-600">
                    Choose a group from the left to begin your conversation.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Empty State */}
      {data.groups.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
            <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-color)'}}>
              No chat groups available
            </h3>
            <p style={{color: 'var(--text-secondary)'}}>
              Create your first group to start connecting with alumni.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AlumniGroupChat;
