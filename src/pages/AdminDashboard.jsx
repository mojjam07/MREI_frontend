
import React, { useState } from 'react';
import { LayoutDashboard, Users, GraduationCap, Award, BarChart3, Settings, Plus, Edit2, Trash2, Save, X, Newspaper, Calendar, MessageSquare, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';
import DataTable from '../components/ui/DataTable';
import DashboardFooter from '../components/layout/DashboardFooter';
import DashboardSkeleton from '../components/ui/DashboardSkeleton';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';
import { Link } from 'react-router-dom';

const AlumniIcon = GraduationCap;

const AdminDashboard = () => {
  const language = useLanguage();
  const t = language?.t || ((k) => k);

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



  // Book management states
  const [editingBook, setEditingBook] = useState(null);
  const [addingBook, setAddingBook] = useState(false);

  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    cover_image: null,
    pdf_file: null,
    publication_year: ''
  });

  const [notification, setNotification] = useState(null);






  // Book management functions
  const handleBookSave = async (bookData, formFiles = null) => {
    try {
      // Check if we have files to upload
      if (formFiles && (formFiles.cover_image || formFiles.pdf_file)) {
        const formData = new FormData();
        
        // Append text fields
        formData.append('title', bookData.title || '');
        formData.append('author', bookData.author || '');
        formData.append('description', bookData.description || '');
        formData.append('genre', bookData.genre || '');
        formData.append('publication_year', bookData.publication_year || '');
        
        // Append files if they exist
        if (formFiles.cover_image) {
          formData.append('cover_image', formFiles.cover_image);
        }
        if (formFiles.pdf_file) {
          formData.append('pdf_file', formFiles.pdf_file);
        }
        
        if (bookData.id) {
          await updateBook({ id: bookData.id, data: formData });
          // Show success notification
          setNotification({ message: t('admin.messages.bookUpdated'), type: 'success' });
        } else {
          await createBook(formData);
          // Show success notification
          setNotification({ message: t('admin.messages.bookCreated'), type: 'success' });
        }
      } else {
        // Handle text-only updates (no file changes)
        if (bookData.id) {
          await updateBook({ id: bookData.id, data: bookData });
          // Show success notification
          setNotification({ message: t('admin.messages.bookUpdated'), type: 'success' });
        } else {
          await createBook(bookData);
          // Show success notification
          setNotification({ message: t('admin.messages.bookCreated'), type: 'success' });
        }
      }
      
      setEditingBook(null);
      setAddingBook(false);
      setBookForm({
        title: '',
        author: '',
        description: '',
        genre: '',
        cover_image: null,
        pdf_file: null,
        publication_year: ''
      });
    } catch (error) {
      console.error('Error saving book:', error);
      setNotification({ message: t('admin.messages.failedToSaveBook'), type: 'error' });
    }
  };


  const handleBookDelete = async (book) => {
    if (window.confirm(`${t('admin.messages.confirmDeleteBook')} "${book.title}"?`)) {
      try {
        await deleteBook(book.id);
        // Show success notification
        setNotification({ message: t('admin.messages.bookDeleted'), type: 'success' });
      } catch (error) {
        console.error('Error deleting book:', error);
        setNotification({ message: t('admin.messages.failedToDeleteBook'), type: 'error' });
      }
    }
  };



  // Book Form Component - Simplified to match DigitalBookshelf
  const renderBookForm = (book = null) => {
    const isEditing = !!book;
    const currentForm = isEditing ? book : {};
    
    return (
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">
          {isEditing ? t('admin.buttons.editBook') : t('admin.buttons.addNewBook')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.labels.title')}</label>
            <input
              type="text"
              value={(isEditing ? currentForm.title : bookForm.title) || ''}
              onChange={(e) => {
                if (isEditing) {
                  setEditingBook({...currentForm, title: e.target.value});
                } else {
                  setBookForm({...bookForm, title: e.target.value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              placeholder={t('form.placeholders.title')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.labels.author')}</label>
            <input
              type="text"
              value={(isEditing ? currentForm.author : bookForm.author) || ''}
              onChange={(e) => {
                if (isEditing) {
                  setEditingBook({...currentForm, author: e.target.value});
                } else {
                  setBookForm({...bookForm, author: e.target.value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              placeholder={t('form.placeholders.author')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.labels.genre')}</label>
            <input
              type="text"
              value={(isEditing ? currentForm.genre : bookForm.genre) || ''}
              onChange={(e) => {
                if (isEditing) {
                  setEditingBook({...currentForm, genre: e.target.value});
                } else {
                  setBookForm({...bookForm, genre: e.target.value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              placeholder={t('form.placeholders.genre')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.labels.publicationYear')}</label>
            <input
              type="number"
              value={(isEditing ? currentForm.publication_year : bookForm.publication_year) || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || '';
                if (isEditing) {
                  setEditingBook({...currentForm, publication_year: value});
                } else {
                  setBookForm({...bookForm, publication_year: value});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              placeholder={t('labels.year')}
              min="1000"
              max="2030"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.labels.coverImage')}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (isEditing) {
                  setEditingBook({...currentForm, cover_image: file});
                } else {
                  setBookForm({...bookForm, cover_image: file});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
            />
            {(isEditing ? currentForm.cover_image : bookForm.cover_image) &&
             typeof (isEditing ? currentForm.cover_image : bookForm.cover_image) === 'object' && (
              <p className="text-sm mt-1 text-gray-600">
                {t('admin.labels.selected')}: {(isEditing ? currentForm.cover_image : bookForm.cover_image).name}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.labels.pdfFile')}</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (isEditing) {
                  setEditingBook({...currentForm, pdf_file: file});
                } else {
                  setBookForm({...bookForm, pdf_file: file});
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
            />
            {(isEditing ? currentForm.pdf_file : bookForm.pdf_file) &&
             typeof (isEditing ? currentForm.pdf_file : bookForm.pdf_file) === 'object' && (
              <p className="text-sm mt-1 text-gray-600">
                {t('admin.labels.selected')}: {(isEditing ? currentForm.pdf_file : bookForm.pdf_file).name}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">{t('admin.labels.description')}</label>
            <textarea
              value={(isEditing ? currentForm.description : bookForm.description) || ''}
              onChange={(e) => {
                if (isEditing) {
                  setEditingBook({...currentForm, description: e.target.value});
                } else {
                  setBookForm({...bookForm, description: e.target.value});
                }
              }}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              placeholder={t('form.placeholders.description')}
            ></textarea>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              if (isEditing) {
                // For editing, separate book data from files
                const { cover_image, pdf_file, ...bookData } = currentForm;
                const files = { cover_image, pdf_file };
                handleBookSave(bookData, files);
              } else {
                // For new books, bookForm contains both data and files
                const { cover_image, pdf_file, ...bookData } = bookForm;
                const files = { cover_image, pdf_file };
                handleBookSave(bookData, files);
              }
            }}
            disabled={creatingBook || updatingBook}
            className="bg-success text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {(creatingBook || updatingBook) ? t('admin.buttons.saving') : t('admin.buttons.saveBook')}
          </button>
          <button
            onClick={() => {
              setEditingBook(null);
              setAddingBook(false);
              setBookForm({
                title: '',
                author: '',
                description: '',
                genre: '',
                cover_image: null,
                pdf_file: null,
                publication_year: ''
              });
            }}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            {t('admin.buttons.cancel')}
          </button>
        </div>
      </div>
    );
  };


  const {
    stats,
    users,
    news,
    events,
    testimonials,
    campusLife,
    studentProfiles,
    tutorProfiles,
    pendingTestimonials,
    contactMessages,
    unreadMessages,
    statsLoading,
    usersLoading,
    newsLoading,
    eventsLoading,
    testimonialsLoading,
    campusLifeLoading,
    studentProfilesLoading,
    tutorProfilesLoading,
    pendingTestimonialsLoading,
    contactMessagesLoading,
    unreadMessagesLoading,
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
    approveTestimonial,
    unapproveTestimonial,
    toggleTestimonialApproval,
    markMessageRead,
    markMessageReplied,
    deleteContactMessage,
    updatingStats,
    creatingAnnouncement,
    updatingAnnouncement,
    deletingAnnouncement,
    creatingStudent,
    updatingStudent,
    deletingStudent,
    creatingTutor,
    updatingTutor,
    deletingTutor,
    approvingTestimonial,
    unapprovingTestimonial,

    togglingTestimonialApproval,
    markingMessageRead,
    markingMessageReplied,

    deletingContactMessage,
    books,
    booksLoading,
    createBook,
    updateBook,
    deleteBook,
    creatingBook,
    updatingBook
  } = useDashboard() || {};

  // Handle stats update
  const handleStatsUpdate = async () => {
    try {
      await updateStats(tempStats);
      setEditingStats(false);
      setTempStats({});
      setNotification({ message: t('admin.messages.statsUpdated'), type: 'success' });
    } catch (error) {
      console.error('Error updating stats:', error);
      setNotification({ message: t('admin.messages.statsUpdateFailed'), type: 'error' });
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
      // Check if we have files to upload
      const hasImageFile = item.image && typeof item.image === 'object';

      if (hasImageFile) {
        const formData = new FormData();

        // Append text fields
        formData.append('title', item.title || '');
        formData.append('content', item.content || '');
        formData.append('author', item.author || '');
        formData.append('author_title', item.author_title || '');
        formData.append('event_date', item.event_date || '');
        formData.append('location', item.location || '');
        formData.append('video_id', item.video_id || '');

        // Append file if it exists
        if (item.image) {
          formData.append('image', item.image);
        }

        if (item.id) {
          await updateAnnouncement({ type, id: item.id, data: formData });
        } else {
          await createAnnouncement({ type, data: formData });
        }
      } else {
        // Handle text-only updates (no file changes)
        if (item.id) {
          await updateAnnouncement({ type, id: item.id, data: item });
        } else {
          await createAnnouncement({ type, data: item });
        }
      }

      setEditingItem(null);
      setIsAddingNew(false);
      setNewItem({});
      setNotification({ message: t('admin.messages.announcementSaved', { type }), type: 'success' });
    } catch (error) {
      console.error('Error saving announcement:', error);
      setNotification({ message: t('admin.messages.announcementSaveFailed', { type }), type: 'error' });
    }
  };


  // Handle announcement delete
  const handleAnnouncementDelete = async (type, item) => {
    if (window.confirm(t('admin.confirmation.deleteAnnouncement', { type }))) {
      try {
        await deleteAnnouncement({ type, id: item.id });
        setNotification({ message: t('admin.messages.announcementDeleted', { type }), type: 'success' });
      } catch (error) {
        console.error('Error deleting announcement:', error);
        setNotification({ message: t('admin.messages.announcementDeleteFailed', { type }), type: 'error' });
      }
    }
  };

  // Student management functions
  const handleStudentSave = async (studentData) => {
    try {
      if (studentData.id) {
        await updateStudent({ id: studentData.id, data: studentData });
        setNotification({ message: t('admin.messages.studentUpdated'), type: 'success' });
      } else {
        await createStudent(studentData);
        setNotification({ message: t('admin.messages.studentCreated'), type: 'success' });
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
      setNotification({ message: t('admin.messages.studentSaveFailed'), type: 'error' });
    }
  };

  const handleStudentDelete = async (student) => {
    if (window.confirm(t('admin.confirmation.deleteStudent', { 
      name: student.user?.username || student.student_number 
    }))) {
      try {
        await deleteStudent(student.id);
        setNotification({ message: t('admin.messages.studentDeleted'), type: 'success' });
      } catch (error) {
        console.error('Error deleting student:', error);
        setNotification({ message: t('admin.messages.studentDeleteFailed'), type: 'error' });
      }
    }
  };

  // Tutor management functions
  const handleTutorSave = async (tutorData) => {
    try {
      if (tutorData.id) {
        await updateTutor({ id: tutorData.id, data: tutorData });
        setNotification({ message: t('admin.messages.tutorUpdated'), type: 'success' });
      } else {
        await createTutor(tutorData);
        setNotification({ message: t('admin.messages.tutorCreated'), type: 'success' });
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
      setNotification({ message: t('admin.messages.tutorSaveFailed'), type: 'error' });
    }
  };

  const handleTutorDelete = async (tutor) => {
    if (window.confirm(t('admin.confirmation.deleteTutor', { 
      name: tutor.user?.username || tutor.staff_number 
    }))) {
      try {
        await deleteTutor(tutor.id);
        setNotification({ message: t('admin.messages.tutorDeleted'), type: 'success' });
      } catch (error) {
        console.error('Error deleting tutor:', error);
        setNotification({ message: t('admin.messages.tutorDeleteFailed'), type: 'error' });
      }
    }
  };


  // Stats Management Component
  const renderStatsManager = () => (
    <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--light-text)'}}>
      <h2 className="text-2xl font-bold mb-6 animate-scale-in" style={{color: 'var(--primary-color)'}}>{t('admin.statisticsManagement')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>{t('admin.labels.activeStudents')}</label>
          <input
            type="number"
            value={(editingStats ? tempStats?.active_students : stats?.active_students) || 0}
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
          <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>{t('admin.labels.courses')}</label>
          <input
            type="number"
            value={(editingStats ? tempStats?.courses : stats?.courses) || 0}
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
          <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>{t('admin.labels.successRate')}</label>
          <input
            type="number"
            value={(editingStats ? tempStats?.success_rate : stats?.success_rate) || 0}
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
          <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>{t('admin.labels.tutors')}</label>
          <input
            type="number"
            value={(editingStats ? tempStats?.tutors : stats?.tutors) || 0}
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
            {t('admin.editStatistics')}
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
              {t('admin.cancel')}
            </button>
          </>
        )}
      </div>
    </div>
  );



  // Separate form components for news and events (like landing page structure)
  const renderNewsForm = (item, isNew = false) => {
    const updateItem = (updates) => {
      if (isNew) {
        setNewItem({...item, ...updates});
      } else {
        setEditingItem({...item, ...updates});
      }
    };

    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('admin.form.labels.title')}
          </label>
          <input
            type="text"
            value={item.title || ''}
            onChange={(e) => updateItem({ title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('admin.form.labels.description')}
          </label>
          <textarea
            value={item.content || ''}
            onChange={(e) => updateItem({ content: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('admin.form.labels.imageFile')}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              updateItem({ image: file });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {item.image && typeof item.image === 'object' && (
            <p className="text-sm mt-1 text-gray-600">
              {t('common.selected')}: {item.image.name}
            </p>
          )}
        </div>
      </>
    );
  };

  const renderEventForm = (item, isNew = false) => {
    const updateItem = (updates) => {
      if (isNew) {
        setNewItem({...item, ...updates});
      } else {
        setEditingItem({...item, ...updates});
      }
    };

    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('admin.form.labels.title')}
          </label>
          <input
            type="text"
            value={item.title || ''}
            onChange={(e) => updateItem({ title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('admin.form.labels.details')}
          </label>
          <textarea
            value={item.content || ''}
            onChange={(e) => updateItem({ content: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('admin.form.labels.eventDate')}
          </label>
          <input
            type="datetime-local"
            value={item.event_date || ''}
            onChange={(e) => updateItem({ event_date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('admin.form.labels.location')}
          </label>
          <input
            type="text"
            value={item.location || ''}
            onChange={(e) => updateItem({ location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('admin.form.labels.youtubeVideoId')}
          </label>
          <input
            type="text"
            value={item.video_id || ''}
            onChange={(e) => updateItem({ video_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder={t('admin.form.placeholders.youtubeVideoId')}
          />
        </div>
      </>
    );
  };

  // Common form component for other content types (testimonials, campus_life)
  const renderContentForm = (type, item, isNew = false) => {
    const commonFields = (
      <div>
        {type !== 'campus_life' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.form.labels.title')}
              </label>
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) =>
                  isNew
                    ? setNewItem({ ...item, title: e.target.value })
                    : setEditingItem({ ...item, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.form.labels.content')}
              </label>
              <textarea
                value={item.content || ''}
                onChange={(e) =>
                  isNew
                    ? setNewItem({ ...item, content: e.target.value })
                    : setEditingItem({ ...item, content: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
          </>
        )}

        {(item.type === 'news' ||
          item.type === 'testimonial' ||
          item.type === 'campus_life') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.form.labels.imageFile')}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                isNew
                  ? setNewItem({ ...item, image: file })
                  : setEditingItem({ ...item, image: file });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {item.image && typeof item.image === 'object' && (
              <p className="text-sm mt-1 text-gray-600">
                {t('common.selected')}: {item.image.name}
              </p>
            )}
          </div>
        )}

        {item.type === 'testimonial' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.form.labels.authorName')}
              </label>
              <input
                type="text"
                value={item.author || ''}
                onChange={(e) =>
                  isNew
                    ? setNewItem({ ...item, author: e.target.value })
                    : setEditingItem({ ...item, author: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.form.labels.authorTitle')}
              </label>
              <input
                type="text"
                value={item.author_title || ''}
                onChange={(e) =>
                  isNew
                    ? setNewItem({ ...item, author_title: e.target.value })
                    : setEditingItem({ ...item, author_title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>
    );



    return commonFields;
  };



  // Student Form Component
  const renderStudentForm = (student = null, isNew = false) => {
    const currentForm = isNew ? studentForm : (student || {});
    const isEditing = !isNew && student;

    return (
      <div className="rounded-lg p-4 mb-4 border-2 hover-lift" style={{borderColor: 'var(--primary-color)', backgroundColor: 'var(--accent-color)'}}>
        <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--primary-color)'}}>
          {isEditing ? t('admin.buttons.editStudent') : t('admin.buttons.addNewStudent')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>{t('admin.form.labels.userId')}</label>
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
              placeholder={t('admin.form.placeholders.userId')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>{t('admin.form.labels.studentNumber')}</label>
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
              placeholder={t('admin.form.placeholders.studentNumber')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>{t('admin.form.labels.courseOfStudy')}</label>
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
              placeholder={t('admin.form.placeholders.courseOfStudy')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>{t('admin.form.labels.admissionYear')}</label>
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
            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>{t('admin.form.labels.status')}</label>
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
              <option value="active">{t('admin.status.options.active')}</option>
              <option value="inactive">{t('admin.status.options.inactive')}</option>
              <option value="graduated">{t('admin.status.options.graduated')}</option>
              <option value="suspended">{t('admin.status.options.suspended')}</option>
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
            {(creatingStudent || updatingStudent) ? t('home.saving') : t('home.saveStudent')}
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
            {t('common.cancel')}
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
      <div
        className="rounded-lg p-4 mb-4 border-2 hover-lift"
        style={{ borderColor: 'var(--primary-color)', backgroundColor: 'var(--accent-color)' }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--primary-color)' }}
        >
          {isEditing
            ? t('admin.tutor.editTutor')
            : t('admin.tutor.addNewTutor')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
              {t('admin.tutor.userId')}
            </label>
            <input
              type="number"
              value={currentForm.user || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (isNew) {
                  setTutorForm({ ...tutorForm, user: value });
                } else {
                  setEditingTutor({ ...tutor, user: value });
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: 'var(--primary-color)', color: 'var(--text-color)' }}
              placeholder={t('admin.tutor.placeholders.userId')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
              {t('admin.tutor.staffNumber')}
            </label>
            <input
              type="text"
              value={currentForm.staff_number || ''}
              onChange={(e) => {
                if (isNew) {
                  setTutorForm({ ...tutorForm, staff_number: e.target.value });
                } else {
                  setEditingTutor({ ...tutor, staff_number: e.target.value });
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: 'var(--primary-color)', color: 'var(--text-color)' }}
              placeholder={t('admin.tutor.placeholders.staffNumber')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
              {t('admin.tutor.department')}
            </label>
            <input
              type="text"
              value={currentForm.department || ''}
              onChange={(e) => {
                if (isNew) {
                  setTutorForm({ ...tutorForm, department: e.target.value });
                } else {
                  setEditingTutor({ ...tutor, department: e.target.value });
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: 'var(--primary-color)', color: 'var(--text-color)' }}
              placeholder={t('admin.tutor.placeholders.department')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
              {t('admin.tutor.subjects')}
            </label>
            <input
              type="text"
              value={currentForm.subjects || ''}
              onChange={(e) => {
                if (isNew) {
                  setTutorForm({ ...tutorForm, subjects: e.target.value });
                } else {
                  setEditingTutor({ ...tutor, subjects: e.target.value });
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: 'var(--primary-color)', color: 'var(--text-color)' }}
              placeholder={t('admin.tutor.placeholders.subjects')}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
              {t('admin.tutor.bio')}
            </label>
            <textarea
              value={currentForm.bio || ''}
              onChange={(e) => {
                if (isNew) {
                  setTutorForm({ ...tutorForm, bio: e.target.value });
                } else {
                  setEditingTutor({ ...tutor, bio: e.target.value });
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: 'var(--primary-color)', color: 'var(--text-color)' }}
              rows="3"
              placeholder={t('admin.tutor.placeholders.bio')}
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
            style={{ backgroundColor: 'var(--success-color)', color: 'var(--light-text)' }}
          >
            <Save className="w-4 h-4" />
            {(creatingTutor || updatingTutor)
              ? t('common.saving')
              : t('admin.tutor.saveTutor')}
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
            style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--light-text)' }}
          >
            <X className="w-4 h-4" />
            {t('common.cancel')}
          </button>
        </div>
      </div>
    );
  };

  // Content manager for specific type
  const renderContentManager = (type, data, loading, icon, color) => {
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
    
    return (
      <div
        className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up"
        style={{ backgroundColor: 'var(--light-text)' }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            {icon}
            <h2
              className="text-2xl font-bold animate-scale-in"
              style={{ color: 'var(--primary-color)' }}
            >
              {typeLabel} {t('common.management')}
            </h2>
          </div>

          <button
            onClick={() => {
              setIsAddingNew(true);
              setNewItem({ type });
              setEditingItem(null);
            }}
            className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
            style={{ backgroundColor: 'var(--primary-color)', color: 'var(--light-text)' }}
          >
            <Plus className="w-4 h-4" />
            {t('common.addNew')} {typeLabel.slice(0, -1)}
          </button>
        </div>

        {isAddingNew && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-blue-200">
            <div className="grid grid-cols-1 gap-4">
              {type === 'news' && renderNewsForm(newItem, true)}
              {type === 'event' && renderEventForm(newItem, true)}
              {type !== 'news' && type !== 'event' && renderContentForm(type, newItem, true)}

              <div className="flex gap-2">
                <button
                  onClick={() => handleAnnouncementSave(type, newItem)}
                  disabled={creatingAnnouncement || updatingAnnouncement}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {(creatingAnnouncement || updatingAnnouncement)
                    ? t('common.saving')
                    : t('common.save')}
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
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">
              {t('common.loading')} {typeLabel.toLowerCase()}...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data && data.map((item) => (
              <div key={item.id}>
                {editingItem?.id === item.id ? (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-blue-200">
                    <div className="grid grid-cols-1 gap-4">
                      {type === 'news' && renderNewsForm(editingItem)}
                      {type === 'event' && renderEventForm(editingItem)}
                      {type !== 'news' && type !== 'event' && renderContentForm(type, editingItem)}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAnnouncementSave(type, editingItem)}
                          disabled={creatingAnnouncement || updatingAnnouncement}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {(creatingAnnouncement || updatingAnnouncement)
                            ? t('common.saving')
                            : t('common.save')}
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
                          {t('common.cancel')}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="border rounded-lg p-4 hover:shadow-md transition-all hover-lift"
                    style={{ borderColor: 'var(--primary-color)' }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="px-2 py-1 text-xs font-semibold rounded"
                            style={{ backgroundColor: 'var(--tertiary-color)', color: 'var(--primary-color)' }}
                          >
                            {typeLabel}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-color)' }}>
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {item.title && (
                          <h3 className="font-semibold mb-1" style={{ color: 'var(--primary-color)' }}>
                            {item.title}
                          </h3>
                        )}

                        {item.content && (
                          <p className="text-sm mb-2" style={{ color: 'var(--text-color)' }}>
                            {item.content.substring(0, 100)}...
                          </p>
                        )}

                        {item.author && (
                          <p className="text-sm" style={{ color: 'var(--text-color)' }}>
                            <strong>{t('admin.labels.author')}:</strong> {item.author}
                          </p>
                        )}

                        {item.event_date && (
                          <p className="text-sm" style={{ color: 'var(--text-color)' }}>
                            <strong>{t('admin.labels.eventDate')}:</strong>{' '}
                            {new Date(item.event_date).toLocaleDateString()}
                          </p>
                        )}

                        {item.location && (
                          <p className="text-sm" style={{ color: 'var(--text-color)' }}>
                            <strong>{t('admin.labels.location')}:</strong> {item.location}
                          </p>
                        )}

                        {item.video_id && (
                          <p className="text-sm" style={{ color: 'var(--text-color)' }}>
                            <strong>{t('admin.labels.videoId')}:</strong> {item.video_id}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 rounded-lg transition-all hover:scale-110 hover-glow"
                          style={{ color: 'var(--primary-color)' }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleAnnouncementDelete(type, item)}
                          className="p-2 rounded-lg transition-all hover:scale-110 hover-glow"
                          style={{ color: 'var(--error-color)' }}
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
              <p className="text-gray-500 text-center py-8">
                {t('admin.empty.noItems', {
                  type: typeLabel.toLowerCase(),
                  singular: typeLabel.slice(0, -1).toLowerCase()
                })}
              </p>
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
              <h1 className="text-2xl font-bold" style={{color: 'var(--light-text)'}}>{t('admin.dashboard')}</h1>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button className="p-2 rounded-lg transition-all hover:scale-105 hover-glow" style={{color: 'var(--tertiary-color)'}}>
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isMainLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
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
            {t('admin.tabs.stats')}
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
            {t('admin.tabs.news')}
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
            {t('admin.tabs.events')}
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
            {t('admin.tabs.testimonials')}
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
            {t('admin.tabs.campusLife')}
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
            {t('admin.tabs.students')}
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
            {t('admin.tabs.tutors')}
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'books' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'books' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'books' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'books') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'books') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <Camera className="w-4 h-4" />
            {t('admin.tabs.books')}
          </button>
          <button
            onClick={() => setActiveTab('testimonial-approval')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 relative ${
              activeTab === 'testimonial-approval' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'testimonial-approval' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'testimonial-approval' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'testimonial-approval') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'testimonial-approval') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <Award className="w-4 h-4" />
            {t('admin.tabs.testimonialApproval')}
            {pendingTestimonials && pendingTestimonials.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingTestimonials.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('contact-messages')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 relative ${
              activeTab === 'contact-messages' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'contact-messages' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'contact-messages' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'contact-messages') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'contact-messages') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <MessageSquare className="w-4 h-4" />
            {t('admin.tabs.contactMessages')}
            {unreadMessages && unreadMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadMessages.length}
              </span>
            )}
          </button>
          <Link
            to="/admin/alumni-dashboard"
            className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105"
            style={{color: 'var(--primary-color)'}}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--accent-color)';
              e.target.style.color = 'var(--primary-color)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'var(--primary-color)';
            }}
          >
            <AlumniIcon className="w-4 h-4" />
            {t('admin.tabs.alumniManagement', 'Alumni Management')}
          </Link>
        </div>

        {/* Content Area */}
        {activeTab === 'stats' && renderStatsManager()}

        {activeTab === 'news' && renderContentManager('news', news, newsLoading, <Newspaper className="w-6 h-6" style={{color: 'var(--primary-color)'}} />, 'bg-blue-100 text-blue-800')}
        {activeTab === 'events' && renderContentManager('event', events, eventsLoading, <Calendar className="w-6 h-6" style={{color: 'var(--primary-color)'}} />, 'bg-green-100 text-green-800')}


        {activeTab === 'testimonials' && renderContentManager('testimonial', testimonials, testimonialsLoading, <MessageSquare className="w-6 h-6" style={{color: 'var(--primary-color)'}} />, 'bg-purple-100 text-purple-800')}
        {activeTab === 'campus-life' && renderContentManager('campus_life', campusLife, campusLifeLoading, <Camera className="w-6 h-6" style={{color: 'var(--primary-color)'}} />, 'bg-orange-100 text-orange-800')}

        {/* Testimonial Approval Tab */}
        {activeTab === 'testimonial-approval' && (
          <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--light-text)'}}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold animate-scale-in" style={{color: 'var(--primary-color)'}}>{t('admin.sections.testimonialApproval')}</h2>
              {pendingTestimonials && pendingTestimonials.length > 0 && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{backgroundColor: 'var(--error-color)', color: 'var(--light-text)'}}>
                  {pendingTestimonials.length} {t('home.pendingApproval')}{pendingTestimonials.length !== 1 ? t('home.plural') : ''}
                </span>
              )}
            </div>

            {pendingTestimonialsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto animate-bounce-in" style={{borderColor: 'var(--primary-color)'}}></div>
                <p className="mt-2 animate-fade-in-up" style={{color: 'var(--text-color)'}}>{t('home.loadingPendingTestimonials')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTestimonials && pendingTestimonials.length > 0 ? (
                  pendingTestimonials.map((testimonial) => (
                    <div key={testimonial.id} className="border rounded-lg p-6 hover:shadow-md transition-all hover-lift" style={{borderColor: 'var(--primary-color)'}}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 text-xs font-semibold rounded" style={{backgroundColor: 'var(--tertiary-color)', color: 'var(--primary-color)'}}>
                              Pending
                            </span>
                            <span className="text-xs" style={{color: 'var(--text-color)'}}>
                              {new Date(testimonial.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold mb-2" style={{color: 'var(--primary-color)'}}>{testimonial.title}</h3>
                          <p className="text-sm mb-3" style={{color: 'var(--text-color)'}}>{testimonial.content}</p>
                          {testimonial.author && (
                            <p className="text-sm mb-1" style={{color: 'var(--text-color)'}}>
                              <strong>{t('home.author')}</strong> {testimonial.author} - {testimonial.author_title}
                            </p>
                          )}
                          {testimonial.image && (
                            <p className="text-sm mb-1" style={{color: 'var(--text-color)'}}>
                              <strong>{t('home.image')}</strong> {testimonial.image}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={async () => {
                            try {
                              await approveTestimonial(testimonial.id);
                              setNotification({ message: t('admin.messages.testimonialApproved'), type: 'success' });
                            } catch (error) {
                              console.error('Error approving testimonial:', error);
                              setNotification({ message: t('admin.messages.testimonialApproveFailed'), type: 'error' });
                            }
                          }}
                          disabled={approvingTestimonial}
                          className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
                          style={{backgroundColor: 'var(--success-color)', color: 'var(--light-text)'}}
                        >
                          <Award className="w-4 h-4" />
                        {approvingTestimonial ? t('admin.buttons.approving') : t('admin.buttons.approve')}
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await unapproveTestimonial(testimonial.id);
                              setNotification({ message: t('admin.messages.testimonialUnapproved'), type: 'success' });
                            } catch (error) {
                              console.error('Error unapproving testimonial:', error);
                              setNotification({ message: t('admin.messages.testimonialUnapproveFailed'), type: 'error' });
                            }
                          }}
                          disabled={unapprovingTestimonial}
                          className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
                          style={{backgroundColor: 'var(--secondary-color)', color: 'var(--light-text)'}}
                        >
                          <X className="w-4 h-4" />
                          {unapprovingTestimonial ? t('admin.buttons.unapproving') : t('admin.buttons.unapprove')}
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await toggleTestimonialApproval(testimonial.id);
                              setNotification({ message: t('admin.messages.testimonialToggled'), type: 'success' });
                            } catch (error) {
                              console.error('Error toggling testimonial approval:', error);
                              setNotification({ message: t('admin.messages.testimonialToggleFailed'), type: 'error' });
                            }
                          }}
                          disabled={togglingTestimonialApproval}
                          className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
                          style={{backgroundColor: 'var(--primary-color)', color: 'var(--light-text)'}}
                        >
                          <Edit2 className="w-4 h-4" />
                          {togglingTestimonialApproval ? t('admin.buttons.toggling') : t('admin.buttons.toggle')}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-color)'}} />
                    <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--primary-color)'}}>{t('home.allCaughtUp')}</h3>
                    <p className="text-gray-500">{t('home.noPendingTestimonials')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Contact Messages Tab */}
        {activeTab === 'contact-messages' && (
          <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--light-text)'}}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold animate-scale-in" style={{color: 'var(--primary-color)'}}>{t('admin.sections.contactMessages')}</h2>
              {unreadMessages && unreadMessages.length > 0 && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{backgroundColor: 'var(--error-color)', color: 'var(--light-text)'}}>
                  {unreadMessages.length} unread message{unreadMessages.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {contactMessagesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto animate-bounce-in" style={{borderColor: 'var(--primary-color)'}}></div>
                <p className="mt-2 animate-fade-in-up" style={{color: 'var(--text-color)'}}>{t('home.loadingContactMessages')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contactMessages && contactMessages.length > 0 ? (
                  contactMessages.map((message) => (
                    <div key={message.id} className={`border rounded-lg p-6 hover:shadow-md transition-all hover-lift ${!message.read ? 'ring-2' : ''}`} style={{
                      borderColor: message.read ? 'var(--primary-color)' : 'var(--error-color)',
                      backgroundColor: message.read ? 'var(--light-text)' : 'var(--accent-color)'
                    }}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${!message.read ? 'text-white' : ''}`} style={{
                              backgroundColor: !message.read ? 'var(--error-color)' : 'var(--tertiary-color)',
                              color: !message.read ? 'var(--light-text)' : 'var(--primary-color)'
                            }}>
                              {!message.read ? t('admin.status.unread') : t('admin.status.read')}
                            </span>
                            <span className="text-xs" style={{color: 'var(--text-color)'}}>
                              {new Date(message.created_at).toLocaleDateString()}
                            </span>
                            {message.replied && (
                              <span className="px-2 py-1 text-xs font-semibold rounded" style={{backgroundColor: 'var(--success-color)', color: 'var(--light-text)'}}>
                                Replied
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold mb-2" style={{color: 'var(--primary-color)'}}>
                            {message.subject || 'No Subject'}
                          </h3>
                          <p className="text-sm mb-3" style={{color: 'var(--text-color)'}}>{message.message}</p>
                          <div className="text-sm" style={{color: 'var(--text-color)'}}>
                            <p><strong>{t('home.from')}</strong> {message.name} ({message.email})</p>
                            {message.phone && <p><strong>{t('home.phoneLabel')}</strong> {message.phone}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {!message.read && (
                          <button
                            onClick={async () => {
                              try {
                                await markMessageRead(message.id);
                                setNotification({ message: t('admin.messages.messageMarkedRead'), type: 'success' });
                              } catch (error) {
                                console.error('Error marking message as read:', error);
                                setNotification({ message: t('admin.messages.messageMarkReadFailed'), type: 'error' });
                              }
                            }}
                            disabled={markingMessageRead}
                            className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
                            style={{backgroundColor: 'var(--primary-color)', color: 'var(--light-text)'}}
                          >
                            <Edit2 className="w-4 h-4" />
                            {markingMessageRead ? t('home.marking') : t('home.markRead')}
                          </button>
                        )}
                        {!message.replied && (
                          <button
                            onClick={async () => {
                              try {
                                await markMessageReplied(message.id);
                                setNotification({ message: t('admin.messages.messageMarkedReplied'), type: 'success' });
                              } catch (error) {
                                console.error('Error marking message as replied:', error);
                                setNotification({ message: t('admin.messages.messageMarkRepliedFailed'), type: 'error' });
                              }
                            }}
                            disabled={markingMessageReplied}
                            className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
                            style={{backgroundColor: 'var(--success-color)', color: 'var(--light-text)'}}
                          >
                            <MessageSquare className="w-4 h-4" />
                            {markingMessageReplied ? t('home.marking') : t('home.markReplied')}
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (window.confirm(t('admin.confirmation.deleteMessage'))) {
                              try {
                                await deleteContactMessage(message.id);
                                setNotification({ message: t('admin.messages.messageDeleted'), type: 'success' });
                              } catch (error) {
                                console.error('Error deleting message:', error);
                                setNotification({ message: t('admin.messages.messageDeleteFailed'), type: 'error' });
                              }
                            }
                          }}
                          disabled={deletingContactMessage}
                          className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
                          style={{backgroundColor: 'var(--error-color)', color: 'var(--light-text)'}}
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingContactMessage ? t('home.deleting') : t('home.delete')}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-color)'}} />
                    <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--primary-color)'}}>No Messages</h3>
                    <p className="text-gray-500">No contact messages have been received yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}


        {activeTab === 'students' && (
          <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--light-text)'}}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold animate-scale-in" style={{color: 'var(--primary-color)'}}>{t('admin.studentsManagement')}</h2>
              <button
                onClick={() => setAddingStudent(true)}
                className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
                style={{backgroundColor: 'var(--primary-color)', color: 'var(--light-text)'}}
              >
                <Plus className="w-4 h-4" />
                {t('admin.buttons.addNewStudent')}
              </button>
            </div>

            {addingStudent && renderStudentForm(null, true)}
            {editingStudent && renderStudentForm(editingStudent)}

            {studentProfilesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto animate-bounce-in" style={{borderColor: 'var(--primary-color)'}}></div>
                <p className="mt-2 animate-fade-in-up" style={{color: 'var(--text-color)'}}>{t('home.loadingStudents')}</p>
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
                  <p className="text-gray-500 text-center py-8">{t('home.noStudentsFound')}</p>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === 'tutors' && (
          <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--light-text)'}}>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setAddingTutor(true)}
                className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
                style={{backgroundColor: 'var(--primary-color)', color: 'var(--light-text)'}}
              >
                <Plus className="w-4 h-4" />
                {t('admin.tutor.addNewTutor')}
              </button>
            </div>

            {addingTutor && renderTutorForm(null, true)}
            {editingTutor && renderTutorForm(editingTutor)}

            {tutorProfilesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto animate-bounce-in" style={{borderColor: 'var(--primary-color)'}}></div>
                <p className="mt-2 animate-fade-in-up" style={{color: 'var(--text-color)'}}>{t('home.loadingTutors')}</p>
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
                  <p className="text-gray-500 text-center py-8">{t('home.noTutorsFound')}</p>
                )}
              </div>
            )}
          </div>


        )}




        {/* Books Management Tab */}
        {activeTab === 'books' && (
          <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--light-text)'}}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold animate-scale-in" style={{color: 'var(--primary-color)'}}>{t('admin.sections.digitalBookshelfManagement')}</h2>


              {!addingBook && !editingBook && (
                <button
                  onClick={() => setAddingBook(true)}
                  className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow"
                  style={{backgroundColor: 'var(--primary-color)', color: 'var(--light-text)'}}
                >
                  <Plus className="w-4 h-4" />
                  Add New Book
                </button>
              )}
            </div>

            {/* Notification */}
            {notification && (
              <div className={`mb-4 p-4 rounded-lg flex items-center justify-between ${
                notification.type === 'success' 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                <span>{notification.message}</span>
                <button 
                  onClick={() => setNotification(null)}
                  className="ml-4 text-sm underline hover:no-underline"
                >
                {t('common.dismiss')}
                </button>
              </div>
            )}

            {/* Book Form - Only show when adding or editing */}
            {(addingBook || editingBook) && renderBookForm(editingBook)}

            {booksLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto animate-bounce-in" style={{borderColor: 'var(--primary-color)'}}></div>
                <p className="mt-2 animate-fade-in-up" style={{color: 'var(--text-color)'}}>{t('home.loadingBooks')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {books && books.length > 0 ? (
                  books.map((book) => (
                    <div key={book.id} className="border rounded-lg p-6 hover:shadow-md transition-all hover-lift" style={{borderColor: 'var(--primary-color)'}}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 text-xs font-semibold rounded" style={{backgroundColor: 'var(--tertiary-color)', color: 'var(--primary-color)'}}>
                              Book
                            </span>
                            {book.genre && (
                              <span className="px-2 py-1 text-xs font-semibold rounded" style={{backgroundColor: 'var(--accent-color)', color: 'var(--primary-color)'}}>
                                {book.genre}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--primary-color)'}}>
                            {book.title}
                          </h3>
                          <p className="mb-3" style={{color: 'var(--text-color)'}}>
                            <strong>Author:</strong> {book.author}
                          </p>
                          {book.description && (
                            <p className="mb-3 line-clamp-2" style={{color: 'var(--text-color)'}}>
                              {book.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm" style={{color: 'var(--text-color)'}}>
                            {book.publication_year && (
                              <span>
                                <strong>Published:</strong> {book.publication_year}
                              </span>
                            )}
                            {book.pdf_file && (
                              <a 
                                href={book.pdf_file} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline"
                                style={{color: 'var(--primary-color)'}}
                              >
                                {t('home.viewPDF')}
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => setEditingBook(book)}
                            className="p-2 rounded-lg transition-all hover:scale-110 hover-glow"
                            style={{color: 'var(--primary-color)'}}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-color)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleBookDelete(book)}
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
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--primary-color)'}}>No Books Yet</h3>
                    <p className="text-gray-500 mb-6">Start building your digital bookshelf by adding your first book!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
    </>
    )}
  </div>

  {/* Footer */}
  <DashboardFooter />
  </div>
  );
};

export default AdminDashboard;
