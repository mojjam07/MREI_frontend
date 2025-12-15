import apiClient from './apiClient';

const searchService = {
  /**
   * Perform global search across all content types
   * @param {string} query - Search query
   * @returns {Promise<Object>} Search results
   */
  async globalSearch(query) {
    try {
      const response = await apiClient.get(`/search/global/?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Global search failed:', error);
      throw error;
    }
  },

  /**
   * Get quick search suggestions for autocomplete
   * @param {string} query - Partial search query
   * @returns {Promise<Array>} Search suggestions
   */
  async quickSearch(query) {
    try {
      const response = await apiClient.get(`/search/quick/?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Quick search failed:', error);
      throw error;
    }
  },

  /**
   * Search courses specifically
   * @param {string} query - Search query
   * @returns {Promise<Array>} Course results
   */
  async searchCourses(query) {
    try {
      const response = await apiClient.get(`/courses/?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Course search failed:', error);
      throw error;
    }
  },

  /**
   * Search news articles
   * @param {string} query - Search query
   * @returns {Promise<Array>} News results
   */
  async searchNews(query) {
    try {
      const response = await apiClient.get(`/news/?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('News search failed:', error);
      throw error;
    }
  },

  /**
   * Search events
   * @param {string} query - Search query
   * @returns {Promise<Array>} Event results
   */
  async searchEvents(query) {
    try {
      const response = await apiClient.get(`/events/?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Event search failed:', error);
      throw error;
    }
  }
};

export default searchService;
