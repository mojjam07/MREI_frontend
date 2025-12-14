
import React, { useState } from 'react';
import { MessageSquare, Send, Users, Search, Filter, Phone, Video, MoreVertical, Star, Archive } from 'lucide-react';
import { useTutorDashboard } from '../../hooks/useTutorDashboard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import FormModal from '../ui/FormModal';

const MessageCenter = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [messageData, setMessageData] = useState({
    recipient: '',
    subject: '',
    content: '',
    priority: 'normal',
    type: 'individual' // 'individual', 'group', 'broadcast'
  });
  const [newMessage, setNewMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox', 'sent', 'drafts', 'archived'

  const {
    messages,
    students,
    messagesLoading,
    studentsLoading,
    sendMessage,
    sendingMessage
  } = useTutorDashboard();

  // Group messages by conversation
  const getConversations = () => {
    const conversations = {};
    
    messages?.forEach(message => {
      const key = message.sender === 'current_user' ? message.recipient : message.sender;
      if (!conversations[key]) {
        conversations[key] = {
          id: key,
          participant: students?.find(s => s.id === key) || 
                       { first_name: 'Unknown', last_name: '', email: message.sender_email },
          messages: [],
          unreadCount: 0,
          lastMessage: null,
          lastActivity: null
        };
      }
      
      conversations[key].messages.push(message);
      if (!message.is_read) {
        conversations[key].unreadCount++;
      }
      
      if (!conversations[key].lastMessage || 
          new Date(message.created_at) > new Date(conversations[key].lastMessage.created_at)) {
        conversations[key].lastMessage = message;
        conversations[key].lastActivity = message.created_at;
      }
    });

    return Object.values(conversations).sort((a, b) => 
      new Date(b.lastActivity) - new Date(a.lastActivity)
    );
  };

  const conversations = getConversations();

  // Filter conversations
  const filteredConversations = conversations.filter(conversation => {
    const participantName = `${conversation.participant.first_name} ${conversation.participant.last_name}`.toLowerCase();
    const matchesSearch = participantName.includes(searchTerm.toLowerCase()) ||
                         conversation.participant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.lastMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'unread' && conversation.unreadCount > 0) ||
                         (filterStatus === 'read' && conversation.unreadCount === 0) ||
                         (filterStatus === 'favorited' && conversation.is_favorited);
    
    return matchesSearch && matchesFilter;
  });

  // Get message statistics
  const getMessageStats = () => {
    const total = messages?.length || 0;
    const unread = messages?.filter(m => !m.is_read).length || 0;
    const sent = messages?.filter(m => m.sender === 'current_user').length || 0;
    const drafts = 0; // Would need separate API endpoint
    
    return { total, unread, sent, drafts };
  };

  const stats = getMessageStats();

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageData.recipient || !messageData.content.trim()) {
      alert('Please select a recipient and write a message');
      return;
    }

    try {
      await sendMessage(messageData);
      setShowComposeModal(false);
      setMessageData({
        recipient: '',
        subject: '',
        content: '',
        priority: 'normal',
        type: 'individual'
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle replying to conversation
  const handleReply = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await sendMessage({
        recipient: selectedConversation.participant.id,
        subject: `Re: ${selectedConversation.lastMessage?.subject || 'Message'}`,
        content: newMessage,
        priority: 'normal',
        type: 'individual'
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  // Get participant initials
  const getInitials = (participant) => {
    const firstName = participant.first_name || '';
    const lastName = participant.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (messagesLoading || studentsLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Message Center</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="favorited">Favorited</option>
          </select>
          <Button onClick={() => setShowComposeModal(true)}>
            <Send className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
            </div>
            <Send className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversations</p>
              <p className="text-2xl font-bold text-purple-600">{conversations.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Message Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1" title="Conversations">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            {['inbox', 'sent', 'drafts'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'inbox' && stats.unread > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {stats.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Conversations */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {getInitials(conversation.participant)}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {conversation.participant.first_name} {conversation.participant.last_name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {conversation.unreadCount > 0 && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(conversation.lastActivity)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage?.subject || 'No subject'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.lastMessage?.content || 'No content'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredConversations.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No conversations found</p>
            </div>
          )}
        </Card>

        {/* Message Detail */}
        <Card className="lg:col-span-2" title={selectedConversation ? 
          `Conversation with ${selectedConversation.participant.first_name} ${selectedConversation.participant.last_name}` :
          'Select a conversation'}>
          {selectedConversation ? (
            <div className="space-y-4">
              {/* Messages */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {selectedConversation.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === 'current_user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'current_user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}>
                      {message.subject && (
                        <p className="text-sm font-medium mb-1">{message.subject}</p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'current_user' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {formatTimestamp(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <div className="border-t pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                  />
                  <Button
                    onClick={handleReply}
                    disabled={sendingMessage || !newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>

      {/* Compose Message Modal */}
      {showComposeModal && (
        <FormModal
          isOpen={showComposeModal}
          onClose={() => {
            setShowComposeModal(false);
            setMessageData({
              recipient: '',
              subject: '',
              content: '',
              priority: 'normal',
              type: 'individual'
            });
          }}
          title="Compose New Message"
          size="lg"
          onSubmit={handleSendMessage}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient *</label>
                <select
                  value={messageData.recipient}
                  onChange={(e) => setMessageData({...messageData, recipient: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a student</option>
                  {students?.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.first_name} {student.last_name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                <select
                  value={messageData.type}
                  onChange={(e) => setMessageData({...messageData, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="broadcast">Broadcast</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={messageData.subject}
                onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
                placeholder="Message subject..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea
                value={messageData.content}
                onChange={(e) => setMessageData({...messageData, content: e.target.value})}
                placeholder="Type your message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="6"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={messageData.priority}
                onChange={(e) => setMessageData({...messageData, priority: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowComposeModal(false);
                  setMessageData({
                    recipient: '',
                    subject: '',
                    content: '',
                    priority: 'normal',
                    type: 'individual'
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={sendingMessage}
              >
                {sendingMessage ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default MessageCenter;
