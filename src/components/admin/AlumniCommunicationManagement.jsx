import React, { useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';

const AlumniCommunicationManagement = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('group-chats');
  const [activeFilter, setActiveFilter] = useState('all');

  const [groupChatsData] = useState([
    {
      id: 1,
      name: 'Class of 2020',
      members: 45,
      messages: 128,
      lastActivity: '2024-03-12',
      status: 'active',
      category: 'Class Groups'
    },
    {
      id: 2,
      name: 'Engineering Alumni',
      members: 156,
      messages: 342,
      lastActivity: '2024-03-11',
      status: 'active',
      category: 'Department Groups'
    },
    {
      id: 3,
      name: 'Business Alumni Network',
      members: 203,
      messages: 89,
      lastActivity: '2024-03-10',
      status: 'active',
      category: 'Professional Networks'
    },
    {
      id: 4,
      name: 'International Alumni',
      members: 67,
      messages: 156,
      lastActivity: '2024-03-09',
      status: 'active',
      category: 'Regional Groups'
    },
    {
      id: 5,
      name: 'Alumni Executives',
      members: 12,
      messages: 45,
      lastActivity: '2024-03-08',
      status: 'private',
      category: 'Executive Groups'
    }
  ]);

  const [messagesData] = useState([
    {
      id: 1,
      sender: 'Sarah Johnson',
      content: 'Looking forward to the annual meet next month!',
      timestamp: '2024-03-12 14:30',
      groupId: 1,
      status: 'approved'
    },
    {
      id: 2,
      sender: 'Michael Chen',
      content: 'Great news about the new scholarship program.',
      timestamp: '2024-03-12 13:15',
      groupId: 2,
      status: 'approved'
    },
    {
      id: 3,
      sender: 'Anonymous User',
      content: 'Can someone help me with networking opportunities?',
      timestamp: '2024-03-12 12:45',
      groupId: 3,
      status: 'pending'
    },
    {
      id: 4,
      sender: 'Emily Rodriguez',
      content: 'Thank you for organizing the virtual event.',
      timestamp: '2024-03-12 11:20',
      groupId: 1,
      status: 'approved'
    }
  ]);

  const renderGroupChatsManagement = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('admin.alumni.manageGroupChats', 'Manage Group Chats')}
        </h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {t('admin.alumni.createGroup', 'Create Group')}
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {['all', 'active', 'private', 'class-groups', 'department-groups', 'professional-networks', 'regional-groups'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 rounded-full text-sm ${
              activeFilter === filter
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t(`admin.alumni.${filter}`, filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' '))}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.groupName', 'Group Name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.category', 'Category')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.members', 'Members')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.messages', 'Messages')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.lastActivity', 'Last Activity')}
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
              {groupChatsData
                .filter(group => activeFilter === 'all' || 
                  group.status === activeFilter || 
                  group.category.toLowerCase().replace(' ', '-') === activeFilter)
                .map((group) => (
                <tr key={group.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {group.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.members}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.messages}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.lastActivity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      group.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {group.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      {t('admin.alumni.view', 'View')}
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-3">
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

  const renderMessagesManagement = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('admin.alumni.manageMessages', 'Manage Messages')}
        </h3>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            {t('admin.alumni.approveAll', 'Approve All')}
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {t('admin.alumni.exportMessages', 'Export Messages')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.sender', 'Sender')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.message', 'Message')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.group', 'Group')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.timestamp', 'Timestamp')}
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
              {messagesData.map((message) => {
                const group = groupChatsData.find(g => g.id === message.groupId);
                return (
                  <tr key={message.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {message.sender}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {message.content}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group?.name || 'Unknown Group'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {message.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        message.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {message.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {message.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            {t('admin.alumni.approve', 'Approve')}
                          </button>
                          <button className="text-red-600 hover:text-red-900 mr-3">
                            {t('admin.alumni.reject', 'Reject')}
                          </button>
                        </>
                      )}
                      <button className="text-blue-600 hover:text-blue-900">
                        {t('admin.alumni.view', 'View')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Calculate statistics
  const totalGroups = groupChatsData.length;
  const totalMembers = groupChatsData.reduce((sum, group) => sum + group.members, 0);
  const totalMessages = groupChatsData.reduce((sum, group) => sum + group.messages, 0);
  const pendingMessages = messagesData.filter(msg => msg.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('admin.alumni.communicationManagement', 'Communication Management')}
        </h2>
        <p className="text-gray-600">
          {t('admin.alumni.manageCommunicationsDesc', 'Manage group chats, moderate messages, and oversee alumni communications')}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('admin.alumni.totalGroups', 'Total Groups')}</p>
              <p className="text-2xl font-semibold text-gray-900">{totalGroups}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('admin.alumni.totalMembers', 'Total Members')}</p>
              <p className="text-2xl font-semibold text-gray-900">{totalMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('admin.alumni.totalMessages', 'Total Messages')}</p>
              <p className="text-2xl font-semibold text-gray-900">{totalMessages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('admin.alumni.pendingMessages', 'Pending Messages')}</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingMessages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('group-chats')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'group-chats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('admin.alumni.groupChats', 'Group Chats')}
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('admin.alumni.messages', 'Messages')}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'group-chats' && renderGroupChatsManagement()}
          {activeTab === 'messages' && renderMessagesManagement()}
        </div>
      </div>
    </div>
  );
};

export default AlumniCommunicationManagement;
