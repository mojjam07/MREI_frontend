import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, GraduationCap, Award, BarChart3, Settings, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import DataTable from '../components/ui/DataTable';
import ContentCard from '../components/ui/ContentCard';
import FormModal from '../components/ui/FormModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    stats,
    announcements,
    users,
    statsLoading,
    announcementsLoading,
    usersLoading,
    updateStats,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    updatingStats,
    creatingAnnouncement,
    updatingAnnouncement,
    deletingAnnouncement
  } = useDashboard();

  // Handle stats update
  const handleStatsUpdate = async (newStats) => {
    try {
      await updateStats(newStats);
      alert('Stats updated successfully!');
    } catch (error) {
      console.error('Error updating stats:', error);
      alert('Failed to update stats');
    }
  };

  // Handle announcement save
  const handleAnnouncementSave = async (announcement) => {
    try {
      if (announcement.id) {
        await updateAnnouncement({ type: announcement.type, id: announcement.id, data: announcement });
      } else {
        await createAnnouncement({ type: announcement.type, data: announcement });
      }
      setEditingItem(null);
      setIsAddingNew(false);
      setNewItem({});
      alert('Announcement saved successfully!');
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    }
  };

  // Handle announcement delete
  const handleAnnouncementDelete = async (announcement) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteAnnouncement({ type: announcement.type, id: announcement.id });
        alert('Item deleted successfully!');
      } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Failed to delete announcement');
      }
    }
  };


  const renderStatsManager = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistics Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Active Students</label>
          <input
            type="number"
            value={stats?.active_students}
            onChange={(e) => setStats({...stats, active_students: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Courses</label>
          <input
            type="number"
            value={stats?.courses}
            onChange={(e) => setStats({...stats, courses: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Success Rate (%)</label>
          <input
            type="number"
            value={stats?.success_rate}
            onChange={(e) => setStats({...stats, success_rate: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tutors</label>
          <input
            type="number"
            value={stats?.tutors}
            onChange={(e) => setStats({...stats, tutors: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <button
        onClick={() => handleStatsUpdate(stats)}
        disabled={updatingStats}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {updatingStats ? 'Saving...' : 'Save Statistics'}
      </button>
    </div>
  );

  const renderAnnouncementForm = (item, isNew = false) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-blue-200">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            value={item.type || 'news'}
            onChange={(e) => isNew ? setNewItem({...item, type: e.target.value}) : setEditingItem({...item, type: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="news">News</option>
            <option value="event">Event</option>
            <option value="testimonial">Testimonial</option>
            <option value="campus_life">Campus Life</option>
          </select>
        </div>

        {item.type !== 'campus_life' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => isNew ? setNewItem({...item, title: e.target.value}) : setEditingItem({...item, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={item.content || ''}
                onChange={(e) => isNew ? setNewItem({...item, content: e.target.value}) : setEditingItem({...item, content: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
          </>
        )}

        {item.type === 'testimonial' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
              <input
                type="text"
                value={item.author || ''}
                onChange={(e) => isNew ? setNewItem({...item, author: e.target.value}) : setEditingItem({...item, author: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author Title</label>
              <input
                type="text"
                value={item.author_title || ''}
                onChange={(e) => isNew ? setNewItem({...item, author_title: e.target.value}) : setEditingItem({...item, author_title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {item.type === 'event' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video ID</label>
            <input
              type="text"
              value={item.video_id || ''}
              onChange={(e) => isNew ? setNewItem({...item, video_id: e.target.value}) : setEditingItem({...item, video_id: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="dQw4w9WgXcQ"
            />
          </div>
        )}

        {(item.type === 'news' || item.type === 'testimonial' || item.type === 'campus_life') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={item.image || ''}
              onChange={(e) => isNew ? setNewItem({...item, image: e.target.value}) : setEditingItem({...item, image: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="/api/placeholder/400/250"
            />
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              handleAnnouncementSave(isNew ? newItem : item);
            }}
            disabled={creatingAnnouncement || updatingAnnouncement}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {(creatingAnnouncement || updatingAnnouncement) ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsAddingNew(false);
              setNewItem({});
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnnouncementsManager = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Content Management</h2>
        <button
          onClick={() => {
            setIsAddingNew(true);
            setNewItem({ type: 'news' });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {isAddingNew && renderAnnouncementForm(newItem, true)}


      <div className="space-y-4">
        {announcements && announcements.map((announcement) => (
          <div key={announcement.id}>
            {editingItem?.id === announcement.id ? (
              renderAnnouncementForm(editingItem)
            ) : (
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                        {announcement.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {announcement.title && (
                      <h3 className="font-semibold text-gray-800 mb-1">{announcement.title}</h3>
                    )}
                    {announcement.content && (
                      <p className="text-sm text-gray-600 mb-2">{announcement.content.substring(0, 100)}...</p>
                    )}
                    {announcement.author && (
                      <p className="text-sm text-gray-600">
                        <strong>{announcement.author}</strong> - {announcement.author_title}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setEditingItem(announcement)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(announcement.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-2 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'stats' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'content' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Award className="w-4 h-4" />
            Content
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'students' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Students
          </button>
          <button
            onClick={() => setActiveTab('tutors')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'tutors' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Tutors
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'stats' && renderStatsManager()}
        {activeTab === 'content' && renderAnnouncementsManager()}
        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Students Management</h2>
            <p className="text-gray-600">Students management interface coming soon...</p>
          </div>
        )}
        {activeTab === 'tutors' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tutors Management</h2>
            {usersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading tutors...</p>
              </div>
            ) : (
              <DataTable
                data={users?.filter(user => user.role === 'tutor') || []}
                columns={[
                  { key: 'username', label: 'Username' },
                  { key: 'email', label: 'Email' },
                  { key: 'first_name', label: 'First Name' },
                  { key: 'last_name', label: 'Last Name' },
                  { key: 'date_joined', label: 'Joined', type: 'date' }
                ]}
                onEdit={(user) => {
                  setSelectedUser(user);
                  setShowUserModal(true);
                }}
                onDelete={(user) => {
                  if (window.confirm(`Are you sure you want to delete tutor ${user.username}?`)) {
                    // Handle delete
                  }
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;