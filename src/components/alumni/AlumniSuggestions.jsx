import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Send,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import apiClient from '../../services/apiClient';

import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingOverlay from '../ui/LoadingOverlay';

const AlumniSuggestions = () => {
  const { t } = useLanguage();
  const [data, setData] = useState({
    suggestions: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'mySuggestions', 'submitted'
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'implemented', 'underReview'
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
    tags: []
  });

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const [suggestionsRes, categoriesRes] = await Promise.all([
        apiClient.get('/content/suggestions'),
        apiClient.get('/admin/suggestion-categories')
      ]);

      setData({
        suggestions: suggestionsRes.data.data || [],
        categories: categoriesRes.data.data || []
      });
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Fallback to sample data if API fails
      setData({
        suggestions: [
          {
            id: 1,
            title: 'Improve Alumni Mobile App',
            description: 'The mobile app could benefit from better notification settings and offline access to alumni directory.',
            category: 'Technology',
            priority: 'high',
            status: 'underReview',
            created_at: '2024-01-20T10:00:00Z',
            updated_at: '2024-01-20T10:00:00Z',
            submitted_by: 'You',
            votes_up: 15,
            votes_down: 2,
            tags: ['mobile', 'app', 'notifications']
          },
          {
            id: 2,
            title: 'Alumni Mentorship Program Expansion',
            description: 'Expand the mentorship program to include industry-specific mentors and more structured matching.',
            category: 'Programs',
            priority: 'medium',
            status: 'implemented',
            created_at: '2024-01-15T14:30:00Z',
            updated_at: '2024-01-25T09:15:00Z',
            submitted_by: 'You',
            votes_up: 32,
            votes_down: 1,
            tags: ['mentorship', 'career', 'networking'],
            admin_response: 'This suggestion has been implemented! We have launched an enhanced mentorship program with industry-specific matching.',
          },
          {
            id: 3,
            title: 'Virtual Alumni Networking Events',
            description: 'Organize monthly virtual networking events to connect alumni across different geographic locations.',
            category: 'Events',
            priority: 'medium',
            status: 'pending',
            created_at: '2024-01-10T16:45:00Z',
            updated_at: '2024-01-10T16:45:00Z',
            submitted_by: 'Ahmed Al-Mansouri',
            votes_up: 28,
            votes_down: 3,
            tags: ['virtual', 'networking', 'events']
          },
          {
            id: 4,
            title: 'Alumni Success Story Showcase',
            description: 'Create a dedicated section on the website to showcase alumni success stories and achievements.',
            category: 'Content',
            priority: 'low',
            status: 'implemented',
            created_at: '2024-01-05T11:20:00Z',
            updated_at: '2024-01-18T14:00:00Z',
            submitted_by: 'Sarah Al-Rashid',
            votes_up: 22,
            votes_down: 0,
            tags: ['success stories', 'content', 'website']
          },
          {
            id: 5,
            title: 'Alumni Discount Program',
            description: 'Establish partnerships with local businesses to provide exclusive discounts for alumni.',
            category: 'Benefits',
            priority: 'medium',
            status: 'pending',
            created_at: '2024-01-02T09:10:00Z',
            updated_at: '2024-01-02T09:10:00Z',
            submitted_by: 'Mohammed Al-Zahra',
            votes_up: 19,
            votes_down: 4,
            tags: ['discounts', 'benefits', 'partnerships']
          }
        ],
        categories: [
          { id: 'general', name: 'General', color: 'bg-gray-100 text-gray-800' },
          { id: 'technology', name: 'Technology', color: 'bg-blue-100 text-blue-800' },
          { id: 'programs', name: 'Programs', color: 'bg-green-100 text-green-800' },
          { id: 'events', name: 'Events', color: 'bg-purple-100 text-purple-800' },
          { id: 'content', name: 'Content', color: 'bg-orange-100 text-orange-800' },
          { id: 'benefits', name: 'Benefits', color: 'bg-pink-100 text-pink-800' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSuggestion = async () => {
    if (!newSuggestion.title || !newSuggestion.description) {
      alert('Please fill in both title and description fields.');
      return;
    }

    try {
      const response = await apiClient.post('/admin/suggestions', newSuggestion);
      setData(prev => ({
        ...prev,
        suggestions: [response.data.data, ...prev.suggestions]
      }));
      setNewSuggestion({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
        tags: []
      });
      setShowCompose(false);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      alert('Failed to submit suggestion. Please try again.');
    }
  };

  const handleVote = async (suggestionId, voteType) => {
    try {
      await apiClient.post(`/admin/suggestions/${suggestionId}/vote`, { voteType });
      setData(prev => ({
        ...prev,
        suggestions: prev.suggestions.map(suggestion => 
          suggestion.id === suggestionId 
            ? {
                ...suggestion,
                votes_up: voteType === 'up' ? suggestion.votes_up + 1 : suggestion.votes_up,
                votes_down: voteType === 'down' ? suggestion.votes_down + 1 : suggestion.votes_down
              }
            : suggestion
        )
      }));
    } catch (error) {
      console.error('Error voting on suggestion:', error);
    }
  };

  const filteredSuggestions = data.suggestions.filter(suggestion => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'mySuggestions' && suggestion.submitted_by === 'You') ||
      (activeTab === 'submitted');
    
    const matchesFilter = filter === 'all' || suggestion.status === filter;
    
    const matchesSearch = !searchTerm || 
      suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesTab && matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'underReview': 'bg-blue-100 text-blue-800 border-blue-200',
      'implemented': 'bg-green-100 text-green-800 border-green-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': Clock,
      'underReview': AlertCircle,
      'implemented': CheckCircle,
      'rejected': AlertCircle
    };
    const IconComponent = icons[status] || Clock;
    return <IconComponent className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const categoryData = data.categories.find(cat => cat.id === category);
    return categoryData?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-100 text-red-800 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
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
            {t('alumni.suggestions')}
          </h1>
          <p className="text-lg" style={{color: 'var(--text-secondary)'}}>
            Share your ideas to improve the alumni community
          </p>
        </div>
        <Button onClick={() => setShowCompose(true)}>
          <Send className="w-4 h-4 mr-2" />
          {t('alumni.submitSuggestion')}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search suggestions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'underReview', label: 'Under Review' },
              { key: 'implemented', label: 'Implemented' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
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

      {/* Tabs */}
      <Card>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'All Suggestions' },
            { key: 'mySuggestions', label: 'My Suggestions' },
            { key: 'submitted', label: 'Recently Submitted' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'text-white shadow-md'
                  : 'hover:shadow-sm'
              }`}
              style={{
                backgroundColor: activeTab === tab.key ? 'var(--primary-color)' : 'var(--accent-color)',
                color: activeTab === tab.key ? 'var(--light-text)' : 'var(--text-color)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => (
            <Card key={suggestion.id} className="hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold" style={{color: 'var(--text-color)'}}>
                      {suggestion.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(suggestion.status)}`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(suggestion.status)}
                        {suggestion.status}
                      </span>
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(suggestion.category)}`}>
                      {suggestion.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-3" style={{color: 'var(--text-secondary)'}}>
                    {suggestion.description}
                  </p>

                  {/* Tags */}
                  {suggestion.tags && suggestion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {suggestion.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs" style={{color: 'var(--text-secondary)'}}>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {suggestion.submitted_by}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(suggestion.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Admin Response */}
                  {suggestion.admin_response && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Admin Response:</span>
                      </div>
                      <p className="text-sm text-blue-700">{suggestion.admin_response}</p>
                    </div>
                  )}
                </div>

                {/* Voting */}
                <div className="flex flex-col items-center gap-2 ml-4">
                  <button
                    onClick={() => handleVote(suggestion.id, 'up')}
                    className="p-2 rounded-full hover:bg-green-50 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                  </button>
                  <span className="text-sm font-medium text-green-600">
                    {suggestion.votes_up}
                  </span>
                  <button
                    onClick={() => handleVote(suggestion.id, 'down')}
                    className="p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <ThumbsDown className="w-4 h-4 text-red-600" />
                  </button>
                  <span className="text-sm font-medium text-red-600">
                    {suggestion.votes_down}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Empty State */}
      {filteredSuggestions.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Lightbulb className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
            <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-color)'}}>
              {t('alumni.placeholders.noSuggestions')}
            </h3>
            <p style={{color: 'var(--text-secondary)'}}>
              {searchTerm ? 'Try adjusting your search criteria.' : 'Be the first to share your suggestion!'}
            </p>
          </div>
        </Card>
      )}

      {/* Compose Suggestion Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{color: 'var(--text-color)'}}>
                  {t('alumni.submitSuggestion')}
                </h2>
                <button
                  onClick={() => setShowCompose(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={newSuggestion.title}
                    onChange={(e) => setNewSuggestion({...newSuggestion, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief title for your suggestion"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>
                    Description
                  </label>
                  <textarea
                    value={newSuggestion.description}
                    onChange={(e) => setNewSuggestion({...newSuggestion, description: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your suggestion in detail"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>
                      Category
                    </label>
                    <select
                      value={newSuggestion.category}
                      onChange={(e) => setNewSuggestion({...newSuggestion, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {data.categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-color)'}}>
                      Priority
                    </label>
                    <select
                      value={newSuggestion.priority}
                      onChange={(e) => setNewSuggestion({...newSuggestion, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleSubmitSuggestion} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Suggestion
                </Button>
                <Button variant="outline" onClick={() => setShowCompose(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniSuggestions;
