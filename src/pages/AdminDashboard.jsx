

import React, { useState } from 'react';
import { LayoutDashboard, Users, GraduationCap, Award, BarChart3, Settings, Plus, Edit2, Trash2, Save, X, Newspaper, Calendar, MessageSquare, Camera } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import DataTable from '../components/ui/DataTable';
import DashboardFooter from '../components/layout/DashboardFooter';
import LoadingOverlay from '../components/ui/LoadingOverlay';

const AdminDashboard = () => {

  const [activeTab, setActiveTab] = useState('stats');
  const [editingStats, setEditingStats] = useState(false);
  const [tempStats, setTempStats] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState({});

  // Student management states
  const [editingStudent, setEditingStudent] = useState(null);
  const [addingStudent, setAddingStudent] = useState(false);
  const [studentForm, setStudentForm] = useState({
    user: '',
    student_number: '',
    course_of_study: '',
    admission_year: new Date().getFullYear(),
    status: 'active'
  });

  // Tutor management states
  const [editingTutor, setEditingTutor] = useState(null);
  const [addingTutor, setAddingTutor] = useState(false);
  const [tutorForm, setTutorForm] = useState({
    user: '',
    staff_number: '',
    department: '',
    bio: '',
    subjects: ''
  });

  const {
    stats,
    users,
    news,
    events,
    testimonials,
    campusLife,
    studentProfiles,
    tutorProfiles,
    statsLoading,
    usersLoading,
    newsLoading,
    eventsLoading,
    testimonialsLoading,
    campusLifeLoading,
    studentProfilesLoading,
    tutorProfilesLoading,
    updateStats,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    createStudent,
    updateStudent,
    deleteStudent,
    createTutor,
    updateTutor,
    deleteTutor,
    updatingStats,
    creatingAnnouncement,
    updatingAnnouncement,
    deletingAnnouncement,
    creatingStudent,
    updatingStudent,
    deletingStudent,
    creatingTutor,
    updatingTutor,
    deletingTutor
  } = useDashboard();

  // Handle stats update
  const handleStatsUpdate = async () => {
    try {
      await updateStats(tempStats);
      setEditingStats(false);
      setTempStats({});
      alert('Stats updated successfully!');
    } catch (error) {
      console.error('Error updating stats:', error);
      alert('Failed to update stats');
    }
  };

  const startEditingStats = () => {
    setTempStats(stats);
    setEditingStats(true);
  };

  const cancelEditingStats = () => {
    setEditingStats(false);
    setTempStats({});
  };

  // Handle announcement save
  const handleAnnouncementSave = async (type, item) => {
    try {
      if (item.id) {
        await updateAnnouncement({ type, id: item.id, data: item });
      } else {
        await createAnnouncement({ type, data: item });
      }
      setEditingItem(null);
      setIsAddingNew(false);
      setNewItem({});
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully!`);
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    }
  };


  // Handle announcement delete
  const handleAnnouncementDelete = async (type, item) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await deleteAnnouncement({ type, id: item.id });
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
      } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Failed to delete announcement');
      }
    }
  };

  // Student management functions
  const handleStudentSave = async (studentData) => {
    try {
      if (studentData.id) {
        await updateStudent({ id: studentData.id, data: studentData });
        alert('Student updated successfully!');
      } else {
        await createStudent(studentData);
        alert('Student created successfully!');
      }
      setEditingStudent(null);
      setAddingStudent(false);
      setStudentForm({
        user: '',
        student_number: '',
        course_of_study: '',
        admission_year: new Date().getFullYear(),
        status: 'active'
      });
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student');
    }
  };

  const handleStudentDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete student ${student.user?.username || student.student_number}?`)) {
      try {
        await deleteStudent(student.id);
        alert('Student deleted successfully!');
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student');
      }
    }
  };

  // Tutor management functions
  const handleTutorSave = async (tutorData) => {
    try {
      if (tutorData.id) {
        await updateTutor({ id: tutorData.id, data: tutorData });
        alert('Tutor updated successfully!');
      } else {
        await createTutor(tutorData);
        alert('Tutor created successfully!');
      }
      setEditingTutor(null);
      setAddingTutor(false);
      setTutorForm({
        user: '',
        staff_number: '',
        department: '',
        bio: '',
        subjects: ''
      });
    } catch (error) {
      console.error('Error saving tutor:', error);
      alert('Failed to save tutor');
    }
  };

  const handleTutorDelete = async (tutor) => {
    if (window.confirm(`Are you sure you want to delete tutor ${tutor.user?.username || tutor.staff_number}?`)) {
      try {
        await deleteTutor(tutor.id);
        alert('Tutor deleted successfully!');
      } catch (error) {
        console.error('Error deleting tutor:', error);
        alert('Failed to delete tutor');
      }
    }
  };


  // Stats Management Component
  const renderStatsManager = () => (
    <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--light-text)'}}>
      <h2 className="text-2xl font-bold mb-6 animate-scale-in" style={{color: 'var(--primary-color)'}}>Statistics Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>Active Students</label>
          <input
            type="number"
            value={editingStats ? tempStats?.active_students : stats?.active_students || 0}
            onChange={(e) => editingStats && setTempStats({...tempStats, active_students: parseInt(e.target.value)})}
            disabled={!editingStats}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:opacity-50 transition-all"
            style={{
              borderColor: 'var(--primary-color)',
              backgroundColor: editingStats ? 'var(--light-text)' : 'var(--accent-color)',
              color: 'var(--text-color)'
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>Courses</label>
          <input
            type="number"
            value={editingStats ? tempStats?.courses : stats?.courses || 0}
            onChange={(e) => editingStats && setTempStats({...tempStats, courses: parseInt(e.target.value)})}
            disabled={!editingStats}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:opacity-50 transition-all"
            style={{
              borderColor: 'var(--primary-color)',
              backgroundColor: editingStats ? 'var(--light-text)' : 'var(--accent-color)',
              color: 'var(--text-color)'
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>Success Rate (%)</label>
          <input
            type="number"
            value={editingStats ? tempStats?.success_rate : stats?.success_rate || 0}
            onChange={(e) => editingStats && setTempStats({...tempStats, success_rate: parseInt(e.target.value)})}
            disabled={!editingStats}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:opacity-50 transition-all"
            style={{
              borderColor: 'var(--primary-color)',
              backgroundColor: editingStats ? 'var(--light-text)' : 'var(--accent-color)',
              color: 'var(--text-color)'
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>Tutors</label>
          <input
            type="number"
            value={editingStats ? tempStats?.tutors : stats?.tutors || 0}
            onChange={(e) => editingStats && setTempStats({...tempStats, tutors: parseInt(e.target.value)})}
            disabled={!editingStats}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:opacity-50 transition-all"
            style={{
              borderColor: 'var(--primary-color)',
              backgroundColor: editingStats ? 'var(--light-text)' : 'var(--accent-color)',
              color: 'var(--text-color)'
            }}
          />
        </div>
      </div>
      <div className="mt-6 flex gap-2">

        {!editingStats ? (
          <button
            onClick={startEditingStats}
            className="px-6 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
            style={{backgroundColor: 'var(--primary-color)', color: 'var(--light-text)'}}
          >
            <Edit2 className="w-4 h-4" />
            Edit Statistics
          </button>
        ) : (
          <>
            <button
              onClick={handleStatsUpdate}
              disabled={updatingStats}
              className="px-6 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 hover-glow"
              style={{backgroundColor: 'var(--success-color)', color: 'var(--light-text)'}}
            >
              <Save className="w-4 h-4" />
              {updatingStats ? 'Saving...' : 'Save Statistics'}
            </button>
            <button
              onClick={cancelEditingStats}
              className="px-6 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
              style={{backgroundColor: 'var(--secondary-color)', color: 'var(--light-text)'}}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );

  // Common form component for all content types
  const renderContentForm = (type, item, isNew = false) => {
    const commonFields = (
      <>
        {type !== 'campus_life' && (
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
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
              <input
                type="datetime-local"
                value={item.event_date || ''}
                onChange={(e) => isNew ? setNewItem({...item, event_date: e.target.value}) : setEditingItem({...item, event_date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={item.location || ''}
                onChange={(e) => isNew ? setNewItem({...item, location: e.target.value}) : setEditingItem({...item, location: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
          </>
        )}
      </>
    );


    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-blue-200">
        <div className="grid grid-cols-1 gap-4">
          {commonFields}
          <div className="flex gap-2">
            <button
              onClick={() => handleAnnouncementSave(item.type || type, isNew ? newItem : item)}
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
  };



  // Student Form Component
  const renderStudentForm = (student = null, isNew = false) => {
    const currentForm = isNew ? studentForm : (student || {});
    const isEditing = !isNew && student;

    return (
      <div className="rounded-lg p-4 mb-4 border-2 hover-lift" style={{borderColor: 'var(--primary-color)', backgroundColor: 'var(--accent-color)'}}>
        <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--primary-color)'}}>
          {isEditing ? 'Edit Student' : 'Add New Student'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>User ID</label>
            <input
              type="number"
              value={currentForm.user || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (isNew) {
                  setStudentForm({...studentForm, user: value});
                } else {
                  setEditingStudent({...student, user: value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{borderColor: 'var(--primary-color)', color: 'var(--text-color)'}}
              placeholder="Enter user ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>Student Number</label>
            <input
              type="text"
              value={currentForm.student_number || ''}
              onChange={(e) => {
                if (isNew) {
                  setStudentForm({...studentForm, student_number: e.target.value});
                } else {
                  setEditingStudent({...student, student_number: e.target.value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{borderColor: 'var(--primary-color)', color: 'var(--text-color)'}}
              placeholder="STU000001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>Course of Study</label>
            <input
              type="text"
              value={currentForm.course_of_study || ''}
              onChange={(e) => {
                if (isNew) {
                  setStudentForm({...studentForm, course_of_study: e.target.value});
                } else {
                  setEditingStudent({...student, course_of_study: e.target.value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{borderColor: 'var(--primary-color)', color: 'var(--text-color)'}}
              placeholder="Computer Science"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>Admission Year</label>
            <input
              type="number"
              value={currentForm.admission_year || new Date().getFullYear()}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (isNew) {
                  setStudentForm({...studentForm, admission_year: value});
                } else {
                  setEditingStudent({...student, admission_year: value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{borderColor: 'var(--primary-color)', color: 'var(--text-color)'}}
              min="2000"
              max="2030"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>Status</label>
            <select
              value={currentForm.status || 'active'}
              onChange={(e) => {
                if (isNew) {
                  setStudentForm({...studentForm, status: e.target.value});
                } else {
                  setEditingStudent({...student, status: e.target.value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{borderColor: 'var(--primary-color)', color: 'var(--text-color)'}}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              const formData = isNew ? studentForm : student;
              handleStudentSave(formData);
            }}
            disabled={creatingStudent || updatingStudent}
            className="px-6 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
            style={{backgroundColor: 'var(--success-color)', color: 'var(--light-text)'}}
          >
            <Save className="w-4 h-4" />
            {(creatingStudent || updatingStudent) ? 'Saving...' : 'Save Student'}
          </button>
          <button
            onClick={() => {
              setEditingStudent(null);
              setAddingStudent(false);
              setStudentForm({
                user: '',
                student_number: '',
                course_of_study: '',
                admission_year: new Date().getFullYear(),
                status: 'active'
              });
            }}
            className="px-6 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
            style={{backgroundColor: 'var(--secondary-color)', color: 'var(--light-text)'}}
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Tutor Form Component
  const renderTutorForm = (tutor = null, isNew = false) => {
    const currentForm = isNew ? tutorForm : (tutor || {});
    const isEditing = !isNew && tutor;

    return (
      <div className="rounded-lg p-4 mb-4 border-2 hover-lift" style={{borderColor: 'var(--primary-color)', backgroundColor: 'var(--accent-color)'}}>
        <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--primary-color)'}}>
          {isEditing ? 'Edit Tutor' : 'Add New Tutor'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>User ID</label>
            <input
              type="number"
              value={currentForm.user || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (isNew) {
                  setTutorForm({...tutorForm, user: value});
                } else {
                  setEditingTutor({...tutor, user: value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{borderColor: 'var(--primary-color)', color: 'var(--text-color)'}}
              placeholder="Enter user ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>Staff Number</label>
            <input
              type="text"
              value={currentForm.staff_number || ''}
              onChange={(e) => {
                if (isNew) {
                  setTutorForm({...tutorForm, staff_number: e.target.value});
                } else {
                  setEditingTutor({...tutor, staff_number: e.target.value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{borderColor: 'var(--primary-color)', color: 'var(--text-color)'}}
              placeholder="TUT000001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>Department</label>
            <input
              type="text"
              value={currentForm.department || ''}
              onChange={(e) => {
                if (isNew) {
                  setTutorForm({...tutorForm, department: e.target.value});
                } else {
                  setEditingTutor({...tutor, department: e.target.value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{borderColor: 'var(--primary-color)', color: 'var(--text-color)'}}
              placeholder="Computer Science"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>Subjects (comma-separated)</label>
            <input
              type="text"
              value={currentForm.subjects || ''}
              onChange={(e) => {
                if (isNew) {
                  setTutorForm({...tutorForm, subjects: e.target.value});
                } else {
                  setEditingTutor({...tutor, subjects: e.target.value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{borderColor: 'var(--primary-color)', color: 'var(--text-color)'}}
              placeholder="Python, JavaScript, Data Structures"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>Bio</label>
            <textarea
              value={currentForm.bio || ''}
              onChange={(e) => {
                if (isNew) {
                  setTutorForm({...tutorForm, bio: e.target.value});
                } else {
                  setEditingTutor({...tutor, bio: e.target.value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{borderColor: 'var(--primary-color)', color: 'var(--text-color)'}}
              rows="3"
              placeholder="Brief description about the tutor..."
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              const formData = isNew ? tutorForm : tutor;
              handleTutorSave(formData);
            }}
            disabled={creatingTutor || updatingTutor}
            className="px-6 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
            style={{backgroundColor: 'var(--success-color)', color: 'var(--light-text)'}}
          >
            <Save className="w-4 h-4" />
            {(creatingTutor || updatingTutor) ? 'Saving...' : 'Save Tutor'}
          </button>
          <button
            onClick={() => {
              setEditingTutor(null);
              setAddingTutor(false);
              setTutorForm({
                user: '',
                staff_number: '',
                department: '',
                bio: '',
                subjects: ''
              });
            }}
            className="px-6 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
            style={{backgroundColor: 'var(--secondary-color)', color: 'var(--light-text)'}}
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Content manager for specific type
  const renderContentManager = (type, data, loading, icon, color) => {
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
    
    return (
      <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--light-text)'}}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-2xl font-bold animate-scale-in" style={{color: 'var(--primary-color)'}}>{typeLabel} Management</h2>
          </div>
          <button
            onClick={() => {
              setIsAddingNew(true);
              setNewItem({ type });
              setEditingItem(null);
            }}
            className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
            style={{backgroundColor: 'var(--primary-color)', color: 'var(--light-text)'}}
          >
            <Plus className="w-4 h-4" />
            Add New {typeLabel.slice(0, -1)}
          </button>
        </div>

        {isAddingNew && renderContentForm(type, newItem, true)}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading {typeLabel.toLowerCase()}...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data && data.map((item) => (
              <div key={item.id}>
                {editingItem?.id === item.id ? (
                  renderContentForm(type, editingItem)
                ) : (

                  <div className="border rounded-lg p-4 hover:shadow-md transition-all hover-lift" style={{borderColor: 'var(--primary-color)'}}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 text-xs font-semibold rounded" style={{backgroundColor: 'var(--tertiary-color)', color: 'var(--primary-color)'}}>
                            {typeLabel}
                          </span>
                          <span className="text-xs" style={{color: 'var(--text-color)'}}>
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {item.title && (
                          <h3 className="font-semibold mb-1" style={{color: 'var(--primary-color)'}}>{item.title}</h3>
                        )}
                        {item.content && (
                          <p className="text-sm mb-2" style={{color: 'var(--text-color)'}}>{item.content.substring(0, 100)}...</p>
                        )}
                        {item.author && (
                          <p className="text-sm" style={{color: 'var(--text-color)'}}>
                            <strong>{item.author}</strong> - {item.author_title}
                          </p>
                        )}
                        {item.event_date && (
                          <p className="text-sm" style={{color: 'var(--text-color)'}}>
                            <strong>Event Date:</strong> {new Date(item.event_date).toLocaleDateString()}
                          </p>
                        )}
                        {item.location && (
                          <p className="text-sm" style={{color: 'var(--text-color)'}}>
                            <strong>Location:</strong> {item.location}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 rounded-lg transition-all hover:scale-110 hover-glow"
                          style={{color: 'var(--primary-color)'}}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-color)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAnnouncementDelete(type, item)}
                          className="p-2 rounded-lg transition-all hover:scale-110 hover-glow"
                          style={{color: 'var(--error-color)'}}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-color)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {(!data || data.length === 0) && (
              <p className="text-gray-500 text-center py-8">No {typeLabel.toLowerCase()} found. Add your first {typeLabel.slice(0, -1).toLowerCase()}!</p>
            )}
          </div>
        )}
      </div>
    );
  };



  // Main loading state with dark masking
  const isMainLoading = statsLoading || usersLoading || newsLoading || eventsLoading || testimonialsLoading || campusLifeLoading || studentProfilesLoading || tutorProfilesLoading;

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--accent-color)'}}>
      {/* Header */}
      <header className="shadow-sm border-b" style={{backgroundColor: 'var(--primary-color)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8" style={{color: 'var(--tertiary-color)'}} />
              <h1 className="text-2xl font-bold" style={{color: 'var(--light-text)'}}>Admin Dashboard</h1>
            </div>
            <button className="p-2 rounded-lg transition-all hover:scale-105 hover-glow" style={{color: 'var(--tertiary-color)'}}>
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <LoadingOverlay 
        isLoading={isMainLoading}
        loadingText="Loading admin dashboard..."
        overlayColor="rgba(0, 0, 0, 0.8)"
        spinnerColor="var(--primary-color)"
        textColor="white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="rounded-lg shadow-sm mb-6 p-2 flex flex-wrap gap-2 hover-lift" style={{backgroundColor: 'var(--light-text)'}}>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'stats' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'stats' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'stats' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'stats') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'stats') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <BarChart3 className="w-4 h-4" />
            Statistics
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'news' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'news' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'news' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'news') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'news') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <Newspaper className="w-4 h-4" />
            News
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'events' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'events' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'events' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'events') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'events') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <Calendar className="w-4 h-4" />
            Events
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'testimonials' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'testimonials' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'testimonials' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'testimonials') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'testimonials') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <MessageSquare className="w-4 h-4" />
            Testimonials
          </button>
          <button
            onClick={() => setActiveTab('campus-life')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'campus-life' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'campus-life' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'campus-life' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'campus-life') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'campus-life') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <Camera className="w-4 h-4" />
            Campus Life
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'students' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'students' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'students' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'students') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'students') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <Users className="w-4 h-4" />
            Students
          </button>
          <button
            onClick={() => setActiveTab('tutors')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'tutors' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'tutors' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'tutors' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'tutors') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'tutors') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <GraduationCap className="w-4 h-4" />
            Tutors
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'stats' && renderStatsManager()}

        {activeTab === 'news' && renderContentManager('news', news, newsLoading, <Newspaper className="w-6 h-6" style={{color: 'var(--primary-color)'}} />, 'bg-blue-100 text-blue-800')}
        {activeTab === 'events' && renderContentManager('event', events, eventsLoading, <Calendar className="w-6 h-6" style={{color: 'var(--primary-color)'}} />, 'bg-green-100 text-green-800')}
        {activeTab === 'testimonials' && renderContentManager('testimonial', testimonials, testimonialsLoading, <MessageSquare className="w-6 h-6" style={{color: 'var(--primary-color)'}} />, 'bg-purple-100 text-purple-800')}
        {activeTab === 'campus-life' && renderContentManager('campus_life', campusLife, campusLifeLoading, <Camera className="w-6 h-6" style={{color: 'var(--primary-color)'}} />, 'bg-orange-100 text-orange-800')}


        {activeTab === 'students' && (
          <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--light-text)'}}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold animate-scale-in" style={{color: 'var(--primary-color)'}}>Students Management</h2>
              <button
                onClick={() => setAddingStudent(true)}
                className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
                style={{backgroundColor: 'var(--primary-color)', color: 'var(--light-text)'}}
              >
                <Plus className="w-4 h-4" />
                Add New Student
              </button>
            </div>

            {addingStudent && renderStudentForm(null, true)}
            {editingStudent && renderStudentForm(editingStudent)}

            {studentProfilesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto animate-bounce-in" style={{borderColor: 'var(--primary-color)'}}></div>
                <p className="mt-2 animate-fade-in-up" style={{color: 'var(--text-color)'}}>Loading students...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {studentProfiles && studentProfiles.map((student) => (
                  <div key={student.id} className="border rounded-lg p-4 hover:shadow-md transition-all hover-lift" style={{borderColor: 'var(--primary-color)'}}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 text-xs font-semibold rounded" style={{backgroundColor: 'var(--tertiary-color)', color: 'var(--primary-color)'}}>
                            Student
                          </span>
                          <span className="px-2 py-1 text-xs font-semibold rounded" style={{
                            backgroundColor: student.status === 'active' ? 'var(--success-color)' : 
                                           student.status === 'inactive' ? 'var(--secondary-color)' :
                                           student.status === 'graduated' ? 'var(--primary-color)' : 'var(--error-color)',
                            color: 'var(--light-text)'
                          }}>
                            {student.status}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-1" style={{color: 'var(--primary-color)'}}>
                          {student.user?.first_name} {student.user?.last_name} ({student.user?.username})
                        </h3>
                        <p className="text-sm mb-1" style={{color: 'var(--text-color)'}}>
                          <strong>Student Number:</strong> {student.student_number}
                        </p>
                        <p className="text-sm mb-1" style={{color: 'var(--text-color)'}}>
                          <strong>Course:</strong> {student.course_of_study}
                        </p>
                        <p className="text-sm mb-1" style={{color: 'var(--text-color)'}}>
                          <strong>Admission Year:</strong> {student.admission_year}
                        </p>
                        <p className="text-sm" style={{color: 'var(--text-color)'}}>
                          <strong>Email:</strong> {student.user?.email}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="p-2 rounded-lg transition-all hover:scale-110 hover-glow"
                          style={{color: 'var(--primary-color)'}}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-color)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStudentDelete(student)}
                          className="p-2 rounded-lg transition-all hover:scale-110 hover-glow"
                          style={{color: 'var(--error-color)'}}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-color)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!studentProfiles || studentProfiles.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No students found. Add your first student!</p>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === 'tutors' && (
          <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--light-text)'}}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold animate-scale-in" style={{color: 'var(--primary-color)'}}>Tutors Management</h2>
              <button
                onClick={() => setAddingTutor(true)}
                className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
                style={{backgroundColor: 'var(--primary-color)', color: 'var(--light-text)'}}
              >
                <Plus className="w-4 h-4" />
                Add New Tutor
              </button>
            </div>

            {addingTutor && renderTutorForm(null, true)}
            {editingTutor && renderTutorForm(editingTutor)}

            {tutorProfilesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto animate-bounce-in" style={{borderColor: 'var(--primary-color)'}}></div>
                <p className="mt-2 animate-fade-in-up" style={{color: 'var(--text-color)'}}>Loading tutors...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tutorProfiles && tutorProfiles.map((tutor) => (
                  <div key={tutor.id} className="border rounded-lg p-4 hover:shadow-md transition-all hover-lift" style={{borderColor: 'var(--primary-color)'}}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 text-xs font-semibold rounded" style={{backgroundColor: 'var(--tertiary-color)', color: 'var(--primary-color)'}}>
                            Tutor
                          </span>
                        </div>
                        <h3 className="font-semibold mb-1" style={{color: 'var(--primary-color)'}}>
                          {tutor.user?.first_name} {tutor.user?.last_name} ({tutor.user?.username})
                        </h3>
                        <p className="text-sm mb-1" style={{color: 'var(--text-color)'}}>
                          <strong>Staff Number:</strong> {tutor.staff_number}
                        </p>
                        <p className="text-sm mb-1" style={{color: 'var(--text-color)'}}>
                          <strong>Department:</strong> {tutor.department}
                        </p>
                        <p className="text-sm mb-1" style={{color: 'var(--text-color)'}}>
                          <strong>Subjects:</strong> {tutor.subjects}
                        </p>
                        {tutor.bio && (
                          <p className="text-sm mb-1" style={{color: 'var(--text-color)'}}>
                            <strong>Bio:</strong> {tutor.bio}
                          </p>
                        )}
                        <p className="text-sm" style={{color: 'var(--text-color)'}}>
                          <strong>Email:</strong> {tutor.user?.email}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingTutor(tutor)}
                          className="p-2 rounded-lg transition-all hover:scale-110 hover-glow"
                          style={{color: 'var(--primary-color)'}}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-color)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleTutorDelete(tutor)}
                          className="p-2 rounded-lg transition-all hover:scale-110 hover-glow"
                          style={{color: 'var(--error-color)'}}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-color)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!tutorProfiles || tutorProfiles.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No tutors found. Add your first tutor!</p>
                )}
              </div>
            )}
          </div>

        )}

        </div>
      </LoadingOverlay>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
};

export default AdminDashboard;
