import React, { useState } from 'react';
import { safeFormatDate, safeArray, safeString } from '../../../../utils/dateUtils';
import { Edit2, X, Trash2, Calendar, MapPin, User, Video, Plus } from 'lucide-react';

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
      organizer: '',
      video_url: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30';
      case 'ongoing':
        return 'bg-blue-400/20 text-blue-400 border border-blue-400/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 16);
  };

  if (eventsLoading) {
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
            <span className="truncate">{t('dashboard.eventsManagement') || 'Events Management'}</span>
          </h2>
          <p className="text-sm sm:text-base text-light-text/80 hidden sm:block">
            {t('dashboard.eventsDescription') || 'Manage university events and activities'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover-lift hover-scale transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{t('dashboard.cancel') || 'Cancel'}</span>
              <span className="sm:hidden">Close</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('dashboard.addEvent') || 'Add Event'}
            </>
          )}
        </button>
      </div>

      {/* Add/Edit Event Form */}
      {showForm && (
        <div className="glass-card p-4 sm:p-6 animate-fade-in-up hover-lift hover-glow-rose">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
            <h3 className="text-lg sm:text-xl font-semibold text-primary-text">
              {editingId ? (t('dashboard.editEvent') || 'Edit Event') : (t('dashboard.addNewEvent') || 'Add New Event')}
            </h3>
            <button
              onClick={handleCancel}
              className="ml-auto p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              aria-label="Cancel"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.title') || 'Title'} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterTitle') || 'Enter event title'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.location') || 'Location'} *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterLocation') || 'Enter event location'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.date') || 'Date'} *
                </label>
                <input
                  type="datetime-local"
                  name="event_date"
                  value={formatDateForInput(formData.event_date)}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.organizer') || 'Organizer'}
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterOrganizer') || 'Enter organizer name'}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                {t('dashboard.description') || 'Description'} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary resize-vertical text-sm sm:text-base"
                placeholder={t('dashboard.enterDescription') || 'Enter event description'}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.videoUrl') || 'Video URL'}
                </label>
                <input
                  type="text"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterVideoUrl') || 'Enter YouTube video URL'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-primary-text mb-1">
                  {t('dashboard.status') || 'Status'}
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-primary-text focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                >
                  <option value="upcoming">{t('dashboard.upcoming') || 'Upcoming'}</option>
                  <option value="ongoing">{t('dashboard.ongoing') || 'Ongoing'}</option>
                  <option value="completed">{t('dashboard.completed') || 'Completed'}</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover-lift hover-scale transition-all disabled:opacity-50 shadow-lg hover:shadow-primary/30 text-sm sm:text-base"
              >
                {isSubmitting ? (t('dashboard.saving') || 'Saving...') : editingId ? (t('dashboard.update') || 'Update') : (t('dashboard.createEvent') || 'Create Event')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 glass-card text-primary-text rounded-lg font-medium hover-lift hover-scale transition-all border border-white/20 hover:border-white/40 text-sm sm:text-base"
              >
                {t('dashboard.cancel') || 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid gap-4 sm:gap-6">
        {safeEvents.length > 0 ? (
          safeEvents.map((event, index) => (
            <div
              key={event.id || index}
              className="glass-card p-4 sm:p-6 hover-lift hover-glow-rose animate-scale-in glow-rose border border-white/20 hover:border-white/40 transition-all duration-300"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
                      <h3 className="text-lg sm:text-xl font-semibold text-primary-text truncate">
                        {safeString(event.title, 'Untitled')}
                      </h3>
                    </div>
                    {/* Status Badge */}
                    <span
                      className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}
                    >
                      {safeString(event.status, 'upcoming')}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-light-text/80 mb-3 line-clamp-2">
                  {safeString(event.description, 'No description')}
                </p>

                {/* Event Details */}
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-light-text/60 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-coral flex-shrink-0" />
                    <span className="hidden sm:inline">{t('dashboard.date') || 'Date'}:</span>
                    <span className="sm:hidden">📅:</span>
                    {safeFormatDate(event.event_date || event.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span className="hidden sm:inline">{t('dashboard.location') || 'Location'}:</span>
                    <span className="sm:hidden">📍:</span>
                    {safeString(event.location, 'TBD')}
                  </span>
                  {event.organizer && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-color flex-shrink-0" />
                      <span className="hidden sm:inline">{t('dashboard.organizer') || 'Organizer'}:</span>
                      <span className="sm:hidden">👤:</span>
                      {safeString(event.organizer)}
                    </span>
                  )}
                  {event.video_url && (
                    <span className="flex items-center gap-1 text-blue-400">
                      <Video className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="hidden sm:inline">{t('dashboard.hasVideo') || 'Has Video'}</span>
                      <span className="sm:hidden">▶</span>
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary/20 to-coral/20 text-primary-text rounded-lg hover-lift hover-scale transition-all duration-300 border border-primary/30 hover:border-primary/50 text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{t('dashboard.edit') || 'Edit'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 glass-card text-rose-400 rounded-lg hover-lift hover-scale transition-all duration-300 border border-rose-400/30 hover:border-rose-400/50 hover:text-rose-300 text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{t('dashboard.delete') || 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-8 sm:p-12 text-center animate-fade-in-up">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-light-text/20 mb-4" />
            <p className="text-base sm:text-lg text-light-text/60">
              {t('dashboard.noEvents') || 'No events scheduled yet'}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover-lift transition-all shadow-lg hover:shadow-primary/30"
            >
              {t('dashboard.createFirstEvent') || 'Create your first event'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsSection;

