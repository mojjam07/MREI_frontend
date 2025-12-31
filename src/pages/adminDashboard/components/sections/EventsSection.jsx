import React, { useState } from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';

const EventsSection = ({ t, events = [], eventsLoading, createEvent, updateEvent, deleteEvent }) => {
  const safeEvents = safeArray(events);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    status: 'upcoming',
    organizer: '',
    video_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateEvent({ id: editingId, data: formData });
      } else {
        await createEvent(formData);
      }
      setFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
        status: 'upcoming',
        organizer: '',
        video_url: ''
      });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || '',
      description: item.description || '',
      event_date: item.event_date || item.date || '',
      location: item.location || '',
      status: item.status || 'upcoming',
      organizer: item.organizer || '',
      video_url: item.video_url || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('dashboard.confirmDelete') || 'Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      location: '',
      status: 'upcoming',
      organizer: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-primary/20 text-primary';
      case 'ongoing':
        return 'bg-success-color/20 text-success-color';
      case 'completed':
        return 'bg-gray-500/20 text-gray-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // Handle ISO format from backend
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 16);
  };

  if (eventsLoading) {
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
          <h2 className="text-3xl font-bold text-light-text mb-2 animate-fade-in-up flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-primary to-coral rounded-full"></span>
            {t('dashboard.eventsManagement') || 'Events Management'}
          </h2>
          <p className="text-light-text/80 animate-fade-in-up delay-100">
            {t('dashboard.eventsDescription') || 'Manage university events and activities'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium transition-all hover:scale-105 hover-lift animate-bounce-in shadow-lg shadow-primary/30 w-full md:w-auto"
        >
          {showForm ? (t('dashboard.cancel') || 'Cancel') : (t('dashboard.addEvent') || 'Add Event')}
        </button>
      </div>

      {/* Add/Edit Event Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg p-6 border border-white/10 shadow-xl shadow-primary/10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-6 bg-gradient-to-b from-primary to-coral rounded-full"></span>
            <h3 className="text-xl font-semibold text-light-text">
              {editingId ? (t('dashboard.editEvent') || 'Edit Event') : (t('dashboard.addNewEvent') || 'Add New Event')}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.title') || 'Title'} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterTitle') || 'Enter event title'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.location') || 'Location'} *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterLocation') || 'Enter event location'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.date') || 'Date'} *
                </label>
                <input
                  type="datetime-local"
                  name="event_date"
                  value={formatDateForInput(formData.event_date)}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.organizer') || 'Organizer'}
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterOrganizer') || 'Enter organizer name'}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-light-text mb-1">
                {t('dashboard.description') || 'Description'} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
                placeholder={t('dashboard.enterDescription') || 'Enter event description'}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.videoUrl') || 'Video URL'}
                </label>
                <input
                  type="text"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterVideoUrl') || 'Enter YouTube video URL'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.status') || 'Status'}
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="upcoming">{t('dashboard.upcoming') || 'Upcoming'}</option>
                  <option value="ongoing">{t('dashboard.ongoing') || 'Ongoing'}</option>
                  <option value="completed">{t('dashboard.completed') || 'Completed'}</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (t('dashboard.saving') || 'Saving...') : editingId ? (t('dashboard.update') || 'Update') : (t('dashboard.createEvent') || 'Create Event')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-white/10 text-light-text rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                {t('dashboard.cancel') || 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid gap-6">
        {safeEvents.length > 0 ? (
          safeEvents.map((event, index) => (
            <div
              key={event.id || index}
              className="bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg p-6 border border-white/10 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 hover-lift group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary to-coral rounded-full group-hover:scale-y-110 transition-transform"></div>
                    <h3 className="text-xl font-semibold text-light-text">{safeString(event.title, 'Untitled')}</h3>
                  </div>
                  <p className="text-light-text/80 text-sm mb-3">{safeString(event.description, 'No description')}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-light-text/60">
                    <span className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-coral/20 flex items-center justify-center text-coral text-xs">📅</span>
                      {t('dashboard.date') || 'Date'}: {safeFormatDate(event.event_date || event.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">📍</span>
                      {t('dashboard.location') || 'Location'}: {safeString(event.location, 'TBD')}
                    </span>
                    {event.organizer && (
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-secondary-color/20 flex items-center justify-center text-secondary-color text-xs">👤</span>
                        {t('dashboard.organizer') || 'Organizer'}: {safeString(event.organizer)}
                      </span>
                    )}
                    {event.video_url && (
                      <span className="flex items-center gap-1 text-blue-400">
                        <span className="w-4 h-4 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-400 text-xs">▶</span>
                        {t('dashboard.hasVideo') || 'Has Video'}
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}
                    >
                      {safeString(event.status, 'upcoming')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  <button
                    onClick={() => handleEdit(event)}
                    className="px-3 py-1 bg-gradient-to-r from-primary/20 to-coral/20 text-light-text rounded hover:from-primary/30 hover:to-coral/30 transition-all border border-primary/20 group-hover:border-primary/40"
                  >
                    {t('dashboard.edit') || 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-3 py-1 bg-error-color/20 text-error-color rounded hover:bg-error-color/30 transition-colors border border-error-color/20"
                  >
                    {t('dashboard.delete') || 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 animate-fade-in-up">
            <p className="text-light-text/60 text-lg">{t('dashboard.noEvents') || 'No events scheduled yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsSection;

