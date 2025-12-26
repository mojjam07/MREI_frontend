import React, { useState, useEffect } from 'react';
import {
  Building,
  Newspaper,
  Calendar,
  Users,
  Award,
  TrendingUp,
  ExternalLink,
  Clock,
  MapPin,
  Star,
  BookOpen,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import apiClient from '../../services/apiClient';

import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingOverlay from '../ui/LoadingOverlay';

const AlmaMataInfo = () => {
  const { t } = useLanguage();
  const [data, setData] = useState({
    news: [],
    events: [],
    achievements: [],
    statistics: {}
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('news'); // 'news', 'events', 'achievements'
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchAlmaMataData();
  }, []);

  const fetchAlmaMataData = async () => {
    try {
      setLoading(true);
      const [newsRes, eventsRes, achievementsRes, statsRes] = await Promise.all([
        apiClient.get('/admin/institute-news'),
        apiClient.get('/admin/institute-events'),
        apiClient.get('/admin/achievements'),
        apiClient.get('/admin/institute-statistics')
      ]);

      setData({
        news: newsRes.data.data || [],
        events: eventsRes.data.data || [],
        achievements: achievementsRes.data.data || [],
        statistics: statsRes.data.data || {}
      });
    } catch (error) {
      console.error('Error fetching alma mata data:', error);
      // Fallback to sample data if API fails
      setData({
        news: [
          {
            id: 1,
            title: 'New State-of-the-Art Laboratory Opens',
            content: 'We are proud to announce the opening of our new advanced technology laboratory, featuring cutting-edge equipment for research and hands-on learning experiences.',
            category: 'Facilities',
            image_url: '/api/placeholder/400/250',
            created_at: '2024-01-15T10:00:00Z',
            author: 'Administration Office'
          },
          {
            id: 2,
            title: 'Accreditation Renewal Success',
            content: 'Our institution has successfully renewed its accreditation for another five years, maintaining our commitment to educational excellence and quality standards.',
            category: 'Accreditation',
            image_url: '/api/placeholder/400/250',
            created_at: '2024-01-10T14:30:00Z',
            author: 'Quality Assurance'
          },
          {
            id: 3,
            title: 'Partnership with Industry Leaders',
            content: 'We have established new partnerships with leading companies in the technology sector to provide better internship and job placement opportunities for our students.',
            category: 'Partnerships',
            image_url: '/api/placeholder/400/250',
            created_at: '2024-01-05T09:15:00Z',
            author: 'Industry Relations'
          },
          {
            id: 4,
            title: 'Student Research Publication Success',
            content: 'Our students have published 15 research papers in international journals this year, showcasing the quality of research conducted at our institution.',
            category: 'Research',
            image_url: '/api/placeholder/400/250',
            created_at: '2024-01-02T16:45:00Z',
            author: 'Research Department'
          }
        ],
        events: [
          {
            id: 1,
            title: 'Open House for Prospective Students',
            description: 'Visit our campus and learn about our programs, meet faculty members, and explore our facilities.',
            event_date: '2024-02-15',
            location: 'Main Campus Auditorium',
            registration_required: true,
            max_attendees: 500,
            current_attendees: 325,
            category: 'Admissions',
            image_url: '/api/placeholder/400/250',
            organizer: 'Admissions Office'
          },
          {
            id: 2,
            title: 'Annual Academic Conference 2024',
            description: 'Join leading academics and researchers for discussions on the latest developments in education and technology.',
            event_date: '2024-03-20',
            location: 'Conference Center',
            registration_required: true,
            max_attendees: 1000,
            current_attendees: 750,
            category: 'Academic',
            image_url: '/api/placeholder/400/250',
            organizer: 'Academic Affairs'
          },
          {
            id: 3,
            title: 'Innovation and Technology Expo',
            description: 'Showcase of student projects, startup ideas, and innovative solutions developed by our community.',
            event_date: '2024-04-10',
            location: 'Innovation Hub',
            registration_required: false,
            max_attendees: 800,
            current_attendees: 600,
            category: 'Innovation',
            image_url: '/api/placeholder/400/250',
            organizer: 'Innovation Center'
          }
        ],
        achievements: [
          {
            id: 1,
            title: 'National Excellence Award',
            description: 'Received the National Excellence in Education Award for outstanding contributions to quality education.',
            category: 'Awards',
            date_achieved: '2024-01-12',
            image_url: '/api/placeholder/200/150',
            significance: 'High'
          },
          {
            id: 2,
            title: 'Research Funding Milestone',
            description: 'Secured $2M in research funding for innovative projects in artificial intelligence and sustainable technology.',
            category: 'Funding',
            date_achieved: '2024-01-08',
            image_url: '/api/placeholder/200/150',
            significance: 'Medium'
          },
          {
            id: 3,
            title: 'Alumni Success Stories',
            description: '95% of our graduates are employed within 6 months of graduation, exceeding national averages.',
            category: 'Success',
            date_achieved: '2024-01-05',
            image_url: '/api/placeholder/200/150',
            significance: 'High'
          }
        ],
        statistics: {
          total_students: 8500,
          total_faculty: 450,
          graduation_rate: 92,
          employment_rate: 95,
          research_publications: 125,
          partnerships: 85
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Facilities': 'bg-blue-100 text-blue-800 border-blue-200',
      'Accreditation': 'bg-green-100 text-green-800 border-green-200',
      'Partnerships': 'bg-purple-100 text-purple-800 border-purple-200',
      'Research': 'bg-orange-100 text-orange-800 border-orange-200',
      'Admissions': 'bg-pink-100 text-pink-800 border-pink-200',
      'Academic': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Innovation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Awards': 'bg-red-100 text-red-800 border-red-200',
      'Funding': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Success': 'bg-cyan-100 text-cyan-800 border-cyan-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSignificanceColor = (significance) => {
    const colors = {
      'High': 'bg-red-100 text-red-800 border-red-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Low': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[significance] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderNewsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.news.map((news) => (
        <Card key={news.id} className="hover:shadow-lg transition-all">
          {news.image_url && (
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(news.category)}`}>
                {news.category}
              </span>
              <span className="text-sm" style={{color: 'var(--text-secondary)'}}>
                {new Date(news.created_at).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--text-color)'}}>
              {news.title}
            </h3>
            <p className="text-sm mb-4" style={{color: 'var(--text-secondary)'}}>
              {news.content}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{color: 'var(--text-secondary)'}}>
                {t('alumni.by')}: {news.author}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(news)}
              >
                {t('alumni.actions.readMore')}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderEventsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {data.events.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-all">
          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
              <span className="text-sm" style={{color: 'var(--text-secondary)'}}>
                {new Date(event.event_date).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--text-color)'}}>
              {event.title}
            </h3>
            <p className="text-sm mb-4" style={{color: 'var(--text-secondary)'}}>
              {event.description}
            </p>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)'}}>
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)'}}>
                <Users className="w-4 h-4" />
                <span>{event.current_attendees || 0} / {event.max_attendees} attendees</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{color: 'var(--text-secondary)'}}>
                {t('alumni.by')}: {event.organizer}
              </span>
              {event.registration_required && (
                <Button size="sm">
                  {t('alumni.events.registerNow')}
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.achievements.map((achievement) => (
        <Card key={achievement.id} className="hover:shadow-lg transition-all">
          {achievement.image_url && (
            <img
              src={achievement.image_url}
              alt={achievement.title}
              className="w-full h-32 object-cover rounded-t-lg"
            />
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(achievement.category)}`}>
                {achievement.category}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSignificanceColor(achievement.significance)}`}>
                {achievement.significance}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--text-color)'}}>
              {achievement.title}
            </h3>
            <p className="text-sm mb-3" style={{color: 'var(--text-secondary)'}}>
              {achievement.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{color: 'var(--text-secondary)'}}>
                {new Date(achievement.date_achieved).toLocaleDateString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(achievement)}
              >
                {t('alumni.actions.viewDetails')}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
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
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4" style={{color: 'var(--text-color)'}}>
          {t('alumni.almaMataInfo')}
        </h1>
        <p className="text-lg mb-6" style={{color: 'var(--text-secondary)'}}>
          Stay updated with news, events, and achievements from your alma mater
        </p>
      </div>

      {/* Statistics Overview */}
      <Card>
        <h2 className="text-xl font-semibold mb-4" style={{color: 'var(--text-color)'}}>
          Institute Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.statistics.total_students?.toLocaleString()}</div>
            <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.statistics.total_faculty}</div>
            <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Faculty</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{data.statistics.graduation_rate}%</div>
            <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Graduation Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{data.statistics.employment_rate}%</div>
            <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Employment Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{data.statistics.research_publications}</div>
            <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Publications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{data.statistics.partnerships}</div>
            <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Partnerships</div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'news', label: t('alumni.instituteNews'), icon: Newspaper },
            { key: 'events', label: t('alumni.instituteEvents'), icon: Calendar },
            { key: 'achievements', label: t('alumni.achievements'), icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.key
                    ? 'text-white shadow-md'
                    : 'hover:shadow-sm'
                }`}
                style={{
                  backgroundColor: activeTab === tab.key ? 'var(--primary-color)' : 'var(--accent-color)',
                  color: activeTab === tab.key ? 'var(--light-text)' : 'var(--text-color)'
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'news' && renderNewsTab()}
          {activeTab === 'events' && renderEventsTab()}
          {activeTab === 'achievements' && renderAchievementsTab()}
        </div>
      </Card>

      {/* Empty States */}
      {(activeTab === 'news' && data.news.length === 0) && (
        <Card>
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
            <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-color)'}}>
              No news available
            </h3>
            <p style={{color: 'var(--text-secondary)'}}>
              Check back later for updates from your alma mater.
            </p>
          </div>
        </Card>
      )}

      {(activeTab === 'events' && data.events.length === 0) && (
        <Card>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
            <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-color)'}}>
              No events available
            </h3>
            <p style={{color: 'var(--text-secondary)'}}>
              No upcoming events at the moment.
            </p>
          </div>
        </Card>
      )}

      {(activeTab === 'achievements' && data.achievements.length === 0) && (
        <Card>
          <div className="text-center py-12">
            <Award className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
            <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-color)'}}>
              No achievements available
            </h3>
            <p style={{color: 'var(--text-secondary)'}}>
              Check back later for updates on institutional achievements.
            </p>
          </div>
        </Card>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{color: 'var(--text-color)'}}>
                    {selectedItem.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(selectedItem.category)}`}>
                      {selectedItem.category}
                    </span>
                    {selectedItem.significance && (
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getSignificanceColor(selectedItem.significance)}`}>
                        {selectedItem.significance} Priority
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {selectedItem.image_url && (
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              <div className="prose max-w-none">
                <p style={{color: 'var(--text-secondary)', lineHeight: '1.6'}}>
                  {selectedItem.content || selectedItem.description}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={() => setSelectedItem(null)}>
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

export default AlmaMataInfo;
