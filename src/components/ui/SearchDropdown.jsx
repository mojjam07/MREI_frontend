import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, BookOpen, Calendar, Users, Bell, FileText, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../i18n/translations';
import searchService from '../../services/searchService';

const SearchDropdown = ({ 
  isOpen, 
  onClose, 
  placeholder, 
  className = "",
  onSearchResultClick 
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Get recent searches from localStorage
  const getRecentSearches = () => {
    try {
      const recent = localStorage.getItem('recentSearches');
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  };

  const saveRecentSearch = (searchTerm) => {
    try {
      const recent = getRecentSearches();
      const updated = [searchTerm, ...recent.filter(s => s !== searchTerm)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

  // Get type-specific icons
  const getTypeIcon = (type) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'assignment':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'news':
        return <Clock className="w-4 h-4 text-purple-500" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'user':
        return <Users className="w-4 h-4 text-indigo-500" />;
      case 'announcement':
        return <Bell className="w-4 h-4 text-red-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get type display name
  const getTypeDisplay = (type) => {
    const types = {
      course: t.header.courses,
      assignment: t.header.assignments,
      news: t.header.news,
      event: t.header.events,
      user: t.header.users,
      announcement: t.header.announcements
    };
    return types[type] || type;
  };

  // Debounced search suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await searchService.quickSearch(query);
        setSuggestions(response.suggestions || []);
      } catch (error) {
        console.error('Quick search failed:', error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Perform full search
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await searchService.globalSearch(searchQuery);
      setSearchResults(response);
      saveRecentSearch(searchQuery);
    } catch (error) {
      console.error('Global search failed:', error);
      setSearchResults({
        results: { courses: [], assignments: [], news: [], events: [], users: [], announcements: [] },
        total_results: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
      setActiveTab('all');
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    performSearch(suggestion.text);
    setActiveTab('all');
  };

  // Handle result click
  const handleResultClick = (result) => {
    if (onSearchResultClick) {
      onSearchResultClick(result);
    }
    onClose();
  };

  // Filter results by active tab
  const getFilteredResults = () => {
    if (!searchResults?.results) return { courses: [], assignments: [], news: [], events: [], users: [], announcements: [] };
    
    if (activeTab === 'all') return searchResults.results;
    
    return { [activeTab]: searchResults.results[activeTab] || [] };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredResults = getFilteredResults();
  const recentSearches = getRecentSearches();
  const hasResults = searchResults && searchResults.total_results > 0;
  const showSuggestions = suggestions.length > 0 && !searchResults;
  const showRecent = recentSearches.length > 0 && !query && !searchResults;

  return (
    <div 
      ref={dropdownRef}
      className={`absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden ${className}`}
    >
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="p-4 border-b border-gray-100">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Content Area */}
      <div className="max-h-64 overflow-y-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <div className="mt-2">Searching...</div>
          </div>
        )}

        {/* Search Results */}
        {hasResults && !isLoading && (
          <>
            {/* Result Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto">
              {Object.keys(filteredResults).map((type) => (
                filteredResults[type]?.length > 0 && (
                  <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 ${
                      activeTab === type
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {getTypeDisplay(type)} ({filteredResults[type].length})
                  </button>
                )
              ))}
            </div>

            {/* Results List */}
            <div className="p-2">
              {Object.entries(filteredResults).map(([type, results]) =>
                results?.map((result) => (
                  <div
                    key={`${type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                  >
                    {getTypeIcon(type)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {result.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {result.subtitle}
                      </div>
                      {result.description && (
                        <div className="text-xs text-gray-400 truncate mt-1">
                          {result.description}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Quick Suggestions */}
        {showSuggestions && !isLoading && (
          <div className="p-2">
            <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
              {t.header.suggestions}
            </div>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <div className="flex-1 text-sm text-gray-900">
                  {suggestion.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Searches */}
        {showRecent && !isLoading && (
          <div className="p-2">
            <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Recent
            </div>
            {recentSearches.map((search, index) => (
              <div
                key={index}
                onClick={() => {
                  setQuery(search);
                  performSearch(search);
                }}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
              >
                <Clock className="w-4 h-4 text-gray-400" />
                <div className="flex-1 text-sm text-gray-900">
                  {search}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {searchResults && !isLoading && searchResults.total_results === 0 && (
          <div className="p-4 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <div className="font-medium">{t.header.noResults}</div>
            <div className="text-sm mt-1">Try searching for courses, news, events, or users</div>
          </div>
        )}

        {/* No Content */}
        {!hasResults && !showSuggestions && !showRecent && !isLoading && (
          <div className="p-4 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <div className="font-medium">Start typing to search</div>
            <div className="text-sm mt-1">Search for courses, assignments, news, events, and more</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown;
