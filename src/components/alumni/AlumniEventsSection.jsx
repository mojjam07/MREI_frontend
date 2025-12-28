import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Filter,
  ChevronRight,
  ExternalLink,
  Plus,
  Star
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import apiClient from '../../services/apiClient';

import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingOverlay from '../ui/LoadingOverlay';

const AlumniEventsSection = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/content/events');
      const eventsData = response.data.data || [];
      
      // Sort events by date (most recent first)
      const sortedEvents = eventsData.sort((a, b) => 
        new Date(b.event_date) - new Date(a.event_date)
      );
      
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to sample data if API fails
      setEvents([
        {
          id: 1,
          title: 'Annual Alumni Reunion 2024',
          description: 'Join us for our biggest alumni gathering of the year! Connect with fellow graduates, share memories, and create new ones.',
          event_date: '2024-03-15',
          location: 'Grand Auditorium, Main Campus',
          category: 'Reunion',
          organizer: 'Alumni Association',
          registration_required: true,
          registration_deadline: '2024-03-10',
          max_attendees: 200,
          current_attendees: 156,
          featured: true,
          tags: ['networking', 'reunion', 'dinner'],
          contact_email: 'alumni@example.com',
          contact_phone: '+966501234567',
          image_url: '/api/placeholder/400/250'
        },
        {
          id: 2,
          title: 'Career Development Workshop',
          description: 'Learn about the latest trends in your industry and get expert advice on career advancement.',
          event_date: '2024-02-28',
          location: 'Virtual Event (Zoom)',
          category: 'Professional Development',
          organizer: 'Career Services Office',
          registration_required: true,
          registration_deadline: '2024-02-25',
          max_attendees: 100,
          current_attendees: 78,
          featured: false,
          tags: ['career', 'workshop', 'virtual'],
          contact_email: 'careers@example.com',
          contact_phone: '+966501234568',
          image_url: '/api/placeholder/400/250'
        },
        {
          id: 3,
          title: 'Campus Tour for Alumni',
          description: 'Explore the new campus facilities and see how the institution has evolved since your graduation.',
          event_date: '2024-04-10',
          location: 'Main Campus',
          category: 'Campus Tour',
          organizer: 'Alumni Relations',
          registration_required: false,
          max_attendees: 50,
          current_attendees: 23,
          featured: false,
          tags: ['campus', 'tour', 'facilities'],
          contact_email: 'alumni@example.com',
          contact_phone: '+966501234567',
          image_url: '/api/placeholder/400/250'
        },
        {
          id: 4,
          title: 'Technology Innovation Summit',
          description: 'Showcase of cutting-edge technology projects by current students and alumni entrepreneurs.',
          event_date: '2024-05-20',
          location: 'Innovation Center',
          category: 'Technology',
          organizer: 'Technology Department',
          registration_required: true,
          registration_deadline: '2024-05-15',
          max_attendees: 300,
          current_attendees: 89,
          featured: true,
          tags: ['technology', 'innovation', 'startup'],
          contact_email: 'tech@example.com',
          contact_phone: '+966501234569',
          image_url: '/api/placeholder/400/250'
        },
        {
          id: 5,
          title: 'Sports Day 2023',
          description: 'Alumni sports competition and friendly matches. Relive your competitive spirit!',
          event_date: '2023-11-12',
          location: 'Sports Complex',
          category: 'Sports',
          organizer: 'Sports Department',
          registration_required: true,
          registration_deadline: '2023-11-08',
          max_attendees: 150,
          current_attendees: 145,
          featured: false,
          tags: ['sports', 'competition', 'fitness'],
          contact_email: 'sports@example.com',
          contact_phone: '+966501234570',
          image_url: '/api/placeholder/400/250'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.event_date);
    const today = new Date();
    
    switch (filter) {
      case 'upcoming':
        return eventDate >= today;
      case 'past':
        return eventDate < today;
      default:
        return true;
    }
  });

  const getCategoryColor = (category) => {
    const colors = {
      'Reunion': 'bg-purple-100 text-purple-800 border-purple-200',
      'Professional Development': 'bg-blue-100 text-blue-800 border-blue-200',
      'Campus Tour': 'bg-green-100 text-green-800 border-green-200',
      'Technology': 'bg-orange-100 text-orange-800 border-orange-200',
      'Sports': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const isEventUpcoming = (eventDate) => {
    return new Date(eventDate) >= new Date();
  };

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
            {t('alumni.alumniEvents')}
          </h1>
          <p className="text-lg" style={{color: 'var(--text-secondary)'}}>
            Stay connected with alumni events and activities
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5" style={{color: 'var(--text-secondary)'}} />
          <span className="font-medium" style={{color: 'var(--text-color)'}}>
            {t('alumni.filters')}:
          </span>
          <div className="flex gap-2">
            {[
              { key: 'all', label: t('alumni.filters.allEvents') },
              { key: 'upcoming', label: t('alumni.filters.upcomingEvents') },
              { key: 'past', label: t('alumni.filters.pastEvents') }
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-all group">
            <div className="space-y-4">
              {/* Event Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors" style={{color: 'var(--text-color)'}}>
                      {event.title}
                    </h3>
                    {event.featured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                    {event.registration_required && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        {t('alumni.events.registrationRequired')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                {event.description}
              </p>

              {/* Event Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm" style={{color: 'var(--text-secondary)'}}>
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.event_date).toLocaleDateString()}</span>
                  {isEventUpcoming(event.event_date) && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {t('alumni.events.upcoming')}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm" style={{color: 'var(--text-secondary)'}}>
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                
                {event.max_attendees && (
                  <div className="flex items-center gap-2 text-sm" style={{color: 'var(--text-secondary)'}}>
                    <Users className="w-4 h-4" />
                    <span>
                      {event.current_attendees || 0} / {event.max_attendees} {t('alumni.events.attendees')}
                    </span>
                  </div>
                )}
              </div>

              {/* Registration Info */}
              {event.registration_required && event.registration_deadline && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-yellow-800">
                    <Clock className="w-4 h-4" />
                    <span>
                      {t('alumni.events.registrationDeadline')}: {new Date(event.registration_deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEvent(event)}
                >
                  {t('alumni.actions.viewDetails')}
                </Button>
                {event.registration_required && isEventUpcoming(event.event_date) && (
                  <Button
                    size="sm"
                    className="flex-1"
                  >
                    {t('alumni.events.registerNow')}
                  </Button>
                )}
                {event.contact_email && (
                  <Button
                    variant="outline"
                    size="sm"
                    href={`mailto:${event.contact_email}`}
                  >
                    {t('alumni.actions.contactOrganizer')}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
            <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-color)'}}>
              {t('alumni.placeholders.noEventsAvailable')}
            </h3>
            <p style={{color: 'var(--text-secondary)'}}>
              {filter === 'upcoming' 
                ? 'No upcoming events at the moment. Check back soon!' 
                : 'No events found for the selected filter.'
              }
            </p>
          </div>
        </Card>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{color: 'var(--text-color)'}}>
                    {selectedEvent.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(selectedEvent.category)}`}>
                      {selectedEvent.category}
                    </span>
                    {selectedEvent.featured && (
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                        {t('alumni.events.featured')}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Event Image */}
              {selectedEvent.image_url && (
                <img
                  src={selectedEvent.image_url}
                  alt={selectedEvent.title}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
              )}

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--text-color)'}}>
                    {t('alumni.events.eventDetails')}
                  </h3>
                  <p style={{color: 'var(--text-secondary)'}}>
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Event Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3" style={{color: 'var(--text-color)'}}>
                      {t('alumni.events.eventInformation')}
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)'}}>
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(selectedEvent.event_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)'}}>
                        <MapPin className="w-4 h-4" />
                        <span>{selectedEvent.location}</span>
                      </div>
                      {selectedEvent.max_attendees && (
                        <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)'}}>
                          <Users className="w-4 h-4" />
                          <span>
                            {selectedEvent.current_attendees || 0} / {selectedEvent.max_attendees} {t('alumni.events.attendees')}
                          </span>
                        </div>
                      )}
                      {selectedEvent.organizer && (
                        <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)'}}>
                          <span className="font-medium">{t('alumni.events.organizer')}:</span>
                          <span>{selectedEvent.organizer}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3" style={{color: 'var(--text-color)'}}>
                      {t('alumni.events.contactInformation')}
                    </h4>
                    <div className="space-y-3 text-sm">
                      {selectedEvent.contact_email && (
                        <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)'}}>
                          <span className="font-medium">Email:</span>
                          <a href={`mailto:${selectedEvent.contact_email}`} className="text-blue-600 hover:underline">
                            {selectedEvent.contact_email}
                          </a>
                        </div>
                      )}
                      {selectedEvent.contact_phone && (
                        <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)'}}>
                          <span className="font-medium">Phone:</span>
                          <a href={`tel:${selectedEvent.contact_phone}`} className="text-blue-600 hover:underline">
                            {selectedEvent.contact_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Registration Information */}
                {selectedEvent.registration_required && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-800">
                      {t('alumni.events.registrationRequired')}
                    </h4>
                    {selectedEvent.registration_deadline && (
                      <p className="text-sm text-blue-700">
                        {t('alumni.events.registrationDeadline')}: {new Date(selectedEvent.registration_deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {selectedEvent.registration_required && isEventUpcoming(selectedEvent.event_date) && (
                    <Button className="flex-1">
                      {t('alumni.events.registerNow')}
                    </Button>
                  )}
                  {selectedEvent.contact_email && (
                    <Button
                      variant="outline"
                      href={`mailto:${selectedEvent.contact_email}`}
                    >
                      {t('alumni.actions.contactOrganizer')}
                    </Button>
                  )}
                  {selectedEvent.contact_phone && (
                    <Button
                      variant="outline"
                      href={`tel:${selectedEvent.contact_phone}`}
                    >
                      {t('alumni.actions.callOrganizer')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniEventsSection;
