



import React, { useState } from 'react';
import { MessageSquare, Send, Phone, Video, Calendar, User, Clock, CheckCircle, Search, Filter } from 'lucide-react';
import { useStudentDashboard } from '../../hooks/useStudentDashboard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import FormModal from '../ui/FormModal';
import Input from '../ui/Input';

const TutorCommunication = () => {
  const [activeTab, setActiveTab] = useState('messages'); // 'messages', 'tutors', 'meetings'
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [messageData, setMessageData] = useState({
    subject: '',
    content: '',
    priority: 'normal'
  });


  const {
    tutors,
    messages,
    enrolledCourses,
    sendMessage,
    markNotificationAsRead,
    loading,
    sendingMessage
  } = useStudentDashboard();

  // Filter messages
  const filteredMessages = messages?.filter(message => {
    const matchesSearch = message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.tutor_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = filterCourse === 'all' || message.course_id === parseInt(filterCourse);
    
    return matchesSearch && matchesCourse;
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || [];

  // Filter tutors
  const filteredTutors = tutors?.filter(tutor => {
    const matchesSearch = tutor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = filterCourse === 'all' || 
      tutor.courses?.some(course => course.id === parseInt(filterCourse));
    
    return matchesSearch && matchesCourse;
  }) || [];

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageData.subject.trim() || !messageData.content.trim()) {
      alert('Please fill in both subject and content');
      return;
    }

    const messagePayload = {
      ...messageData,
      tutor_id: selectedTutor?.id,
      course_id: selectedTutor?.courses?.[0]?.id
    };

    const success = await sendMessage(messagePayload);
    if (success) {
      setShowMessageModal(false);
      setMessageData({
        subject: '',
        content: '',
        priority: 'normal'
      });
      setSelectedTutor(null);
    }
  };

  // Get unread message count
  const getUnreadCount = () => {
    return messages?.filter(m => !m.is_read).length || 0;
  };

  // Get tutor course list
  const getTutorCourses = (tutor) => {
    return enrolledCourses?.filter(ec => 
      ec.course?.instructor === tutor.name
    ) || [];
  };

  // Format message time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'urgent':
        return 'text-red-800 bg-red-100';
      case 'low':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };



  // Mock upcoming meetings data
  const upcomingMeetings = [
    {
      id: 1,
      tutor_name: 'Dr. Sarah Johnson',
      course: 'Advanced Mathematics',
      type: 'office_hours',
      scheduled_time: '2024-02-15T14:00:00.000Z',
      status: 'confirmed',
      location: 'Room 301'
    },
    {
      id: 2,
      tutor_name: 'Prof. Mike Chen',
      course: 'Introduction to Programming',
      type: 'project_meeting',
      scheduled_time: '2024-02-17T16:00:00.000Z',
      status: 'pending',
      location: 'Virtual - Zoom'
    }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading communication data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Tutor Communication</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowMessageModal(true)}>
            <Send className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white">
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
            activeTab === 'messages' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Messages
          {getUnreadCount() > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {getUnreadCount()}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('tutors')}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
            activeTab === 'tutors' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <User className="w-4 h-4" />
          My Tutors ({tutors?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('meetings')}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
            activeTab === 'meetings' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Meetings
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Courses</option>
          {enrolledCourses?.map(course => (
            <option key={course.course?.id} value={course.course?.id}>
              {course.course?.title}
            </option>
          ))}
        </select>
      </div>

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <Card title="Messages">
          <DataTable
            data={filteredMessages}
            columns={[
              {
                key: 'subject',
                label: 'Subject',
                render: (value, message) => (
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${!message.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {value}
                        </p>
                        {!message.is_read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{message.tutor_name}</p>
                      <p className="text-xs text-gray-500">{message.course_title}</p>
                    </div>
                  </div>
                )
              },
              {
                key: 'priority',
                label: 'Priority',
                render: (value) => (
                  <span className={`px-2 py-1 text-xs rounded-full capitalize ${getPriorityColor(value)}`}>
                    {value}
                  </span>
                )
              },
              {
                key: 'created_at',
                label: 'Time',
                render: (value) => (
                  <div className="text-sm text-gray-600">
                    <p>{formatMessageTime(value)}</p>
                  </div>
                )
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (_, message) => (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Mark as read
                        if (!message.is_read) {
                          markNotificationAsRead(message.id);
                        }
                        // Show message details
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                )
              }
            ]}
          />
        </Card>
      )}

      {/* Tutors Tab */}
      {activeTab === 'tutors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map(tutor => {
            const tutorCourses = getTutorCourses(tutor);
            const unreadCount = messages?.filter(m => m.tutor_id === tutor.id && !m.is_read).length || 0;
            
            return (
              <Card key={tutor.id}>
                <div className="space-y-4">
                  {/* Tutor Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                      <p className="text-sm text-gray-600">{tutor.email}</p>
                      <p className="text-xs text-gray-500">{tutor.specialization}</p>
                    </div>
                  </div>

                  {/* Courses */}
                  {tutorCourses.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Courses:</p>
                      <div className="flex flex-wrap gap-1">
                        {tutorCourses.map(course => (
                          <span
                            key={course.course?.id}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {course.course?.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Office Hours */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Office Hours</p>
                    <p className="text-sm text-gray-600">
                      {tutor.office_hours || 'Mon, Wed 2:00 PM - 4:00 PM'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {tutor.office_location || 'Room 201'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Messages: {unreadCount > 0 ? (
                        <span className="font-medium text-blue-600">{unreadCount} unread</span>
                      ) : (
                        '0 unread'
                      )}
                    </span>
                    <span className="text-gray-600">
                      Rating: {tutor.rating || '4.5'} ⭐
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedTutor(tutor);
                        setShowMessageModal(true);
                      }}
                      className="flex-1"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Meetings Tab */}
      {activeTab === 'meetings' && (
        <Card title="Upcoming Meetings">
          <div className="space-y-4">
            {upcomingMeetings.map(meeting => (
              <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{meeting.tutor_name}</h4>
                    <p className="text-sm text-gray-600">{meeting.course}</p>
                    <p className="text-xs text-gray-500 capitalize">{meeting.type.replace('_', ' ')}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    meeting.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {meeting.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(meeting.scheduled_time).toLocaleDateString()} at {new Date(meeting.scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{meeting.location}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    Reschedule
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="w-4 h-4 mr-1" />
                    Join Meeting
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty States */}
      {activeTab === 'messages' && filteredMessages.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterCourse !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Start a conversation with your tutors!'}
          </p>
          <Button onClick={() => setShowMessageModal(true)}>
            <Send className="w-4 h-4 mr-2" />
            Send First Message
          </Button>
        </div>
      )}

      {activeTab === 'tutors' && filteredTutors.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterCourse !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Your tutors will appear here once you enroll in courses.'}
          </p>
          {(searchTerm || filterCourse !== 'all') && (
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterCourse('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <FormModal
          isOpen={showMessageModal}
          onClose={() => {
            setShowMessageModal(false);
            setSelectedTutor(null);
            setMessageData({
              subject: '',
              content: '',
              priority: 'normal'
            });
          }}
          title={`Send Message${selectedTutor ? ` to ${selectedTutor.name}` : ''}`}
          size="md"
          onSubmit={handleSendMessage}
        >
          <div className="space-y-4">
            {/* Tutor Selection */}
            {!selectedTutor && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tutor
                </label>
                <select
                  value={selectedTutor?.id || ''}
                  onChange={(e) => {
                    const tutor = tutors?.find(t => t.id === parseInt(e.target.value));
                    setSelectedTutor(tutor || null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a tutor...</option>
                  {tutors?.map(tutor => (
                    <option key={tutor.id} value={tutor.id}>
                      {tutor.name} - {tutor.specialization}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={messageData.subject}
                onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
                placeholder="Enter message subject..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
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

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={messageData.content}
                onChange={(e) => setMessageData({...messageData, content: e.target.value})}
                placeholder="Type your message here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="6"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedTutor(null);
                  setMessageData({
                    subject: '',
                    content: '',
                    priority: 'normal'
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={sendingMessage || !messageData.subject.trim() || !messageData.content.trim()}
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

export default TutorCommunication;
