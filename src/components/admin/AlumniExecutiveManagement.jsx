import React, { useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';

const AlumniExecutiveManagement = () => {
  const { t } = useLanguage();
  const [executivesData] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Alumni Relations Director',
      email: 'sarah.johnson@university.edu',
      phone: '+1-555-0123',
      year: '2010',
      status: 'active'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Treasurer',
      email: 'michael.chen@university.edu',
      phone: '+1-555-0124',
      year: '2008',
      status: 'active'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Secretary',
      email: 'emily.rodriguez@university.edu',
      phone: '+1-555-0125',
      year: '2015',
      status: 'active'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Events Coordinator',
      email: 'david.kim@university.edu',
      phone: '+1-555-0126',
      year: '2012',
      status: 'inactive'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newExecutive, setNewExecutive] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    year: '',
    status: 'active'
  });

  const handleAddExecutive = () => {
    // Add logic to save new executive
    setShowAddModal(false);
    setNewExecutive({
      name: '',
      role: '',
      email: '',
      phone: '',
      year: '',
      status: 'active'
    });
  };

  const renderExecutiveTable = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.alumni.name', 'Name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.alumni.role', 'Role')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.alumni.email', 'Email')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.alumni.phone', 'Phone')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.alumni.graduationYear', 'Graduation Year')}
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
            {executivesData.map((executive) => (
              <tr key={executive.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {executive.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {executive.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {executive.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {executive.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {executive.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    executive.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {executive.status}
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
  );

  const renderAddModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('admin.alumni.addExecutive', 'Add New Executive')}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('admin.alumni.name', 'Name')}
              </label>
              <input
                type="text"
                value={newExecutive.name}
                onChange={(e) => setNewExecutive({...newExecutive, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('admin.alumni.role', 'Role')}
              </label>
              <select
                value={newExecutive.role}
                onChange={(e) => setNewExecutive({...newExecutive, role: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t('admin.alumni.selectRole', 'Select Role')}</option>
                <option value="Alumni Relations Director">{t('admin.alumni.alumniRelationsDirector', 'Alumni Relations Director')}</option>
                <option value="Treasurer">{t('admin.alumni.treasurer', 'Treasurer')}</option>
                <option value="Secretary">{t('admin.alumni.secretary', 'Secretary')}</option>
                <option value="Events Coordinator">{t('admin.alumni.eventsCoordinator', 'Events Coordinator')}</option>
                <option value="Communications Director">{t('admin.alumni.communicationsDirector', 'Communications Director')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('admin.alumni.email', 'Email')}
              </label>
              <input
                type="email"
                value={newExecutive.email}
                onChange={(e) => setNewExecutive({...newExecutive, email: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('admin.alumni.phone', 'Phone')}
              </label>
              <input
                type="tel"
                value={newExecutive.phone}
                onChange={(e) => setNewExecutive({...newExecutive, phone: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('admin.alumni.graduationYear', 'Graduation Year')}
              </label>
              <input
                type="text"
                value={newExecutive.year}
                onChange={(e) => setNewExecutive({...newExecutive, year: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              {t('admin.alumni.cancel', 'Cancel')}
            </button>
            <button
              onClick={handleAddExecutive}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('admin.alumni.add', 'Add')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('admin.alumni.executiveManagement', 'Executive Management')}
            </h2>
            <p className="text-gray-600">
              {t('admin.alumni.manageExecutivesDesc', 'Manage alumni executive members and their roles')}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('admin.alumni.addExecutive', 'Add Executive')}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('admin.alumni.totalExecutives', 'Total Executives')}</p>
              <p className="text-2xl font-semibold text-gray-900">{executivesData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('admin.alumni.activeExecutives', 'Active Executives')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {executivesData.filter(exec => exec.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('admin.alumni.uniqueRoles', 'Unique Roles')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(executivesData.map(exec => exec.role)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Table */}
      {renderExecutiveTable()}

      {/* Add Modal */}
      {showAddModal && renderAddModal()}
    </div>
  );
};

export default AlumniExecutiveManagement;
