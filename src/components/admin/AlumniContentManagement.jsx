import React, { useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';

const AlumniContentManagement = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('news');
  const [newsData] = useState([
    {
      id: 1,
      title: 'Annual Alumni Meet 2024',
      content: 'Join us for our annual alumni gathering...',
      date: '2024-03-15',
      status: 'published'
    },
    {
      id: 2,
      title: 'New Scholarship Program',
      content: 'Introducing the Merit-Based Alumni Scholarship...',
      date: '2024-03-10',
      status: 'draft'
    }
  ]);

  const [eventsData] = useState([
    {
      id: 1,
      title: 'Alumni Networking Event',
      date: '2024-04-20',
      location: 'University Main Hall',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Homecoming Celebration',
      date: '2024-05-15',
      location: 'Campus Grounds',
      status: 'upcoming'
    }
  ]);

  const [almaMataData] = useState([
    {
      id: 1,
      title: 'University Rankings Improvement',
      content: 'Our university has moved up 5 positions...',
      category: 'achievement'
    },
    {
      id: 2,
      title: 'New Research Facility Opening',
      content: 'State-of-the-art research center opens...',
      category: 'infrastructure'
    }
  ]);

  const renderNewsManagement = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('admin.alumni.manageNews', 'Manage News')}
        </h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {t('admin.alumni.addNews', 'Add News')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.title', 'Title')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.date', 'Date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.status', 'Status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newsData.map((news) => (
                <tr key={news.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {news.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {news.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      news.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {news.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      {t('admin.alumni.edit', 'Edit')}
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      {t('admin.alumni.delete', 'Delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEventsManagement = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('admin.alumni.manageEvents', 'Manage Events')}
        </h3>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          {t('admin.alumni.addEvent', 'Add Event')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.eventTitle', 'Event Title')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.date', 'Date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.location', 'Location')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.status', 'Status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventsData.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      {t('admin.alumni.edit', 'Edit')}
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      {t('admin.alumni.delete', 'Delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAlmaMataManagement = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('admin.alumni.manageAlmaMata', 'Manage Alma Mata Info')}
        </h3>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          {t('admin.alumni.addInfo', 'Add Info')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.title', 'Title')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.category', 'Category')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {almaMataData.map((info) => (
                <tr key={info.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {info.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {info.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      {t('admin.alumni.edit', 'Edit')}
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      {t('admin.alumni.delete', 'Delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('admin.alumni.contentManagement', 'Content Management')}
        </h2>
        <p className="text-gray-600">
          {t('admin.alumni.manageAlumniContentDesc', 'Manage news, events, and alma mata information for alumni')}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('news')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'news'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('admin.alumni.news', 'News')}
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('admin.alumni.events', 'Events')}
            </button>
            <button
              onClick={() => setActiveTab('alma-mata')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'alma-mata'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('admin.alumni.almaMataInfo', 'Alma Mata Info')}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'news' && renderNewsManagement()}
          {activeTab === 'events' && renderEventsManagement()}
          {activeTab === 'alma-mata' && renderAlmaMataManagement()}
        </div>
      </div>
    </div>
  );
};

export default AlumniContentManagement;
