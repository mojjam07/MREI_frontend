import React, { useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';

const AlumniFinancialManagement = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('donations');
  
  const [donationsData] = useState([
    {
      id: 1,
      donor: 'Class of 2015',
      amount: 5000,
      date: '2024-03-10',
      purpose: 'Building Fund',
      status: 'completed'
    },
    {
      id: 2,
      donor: 'Sarah Johnson',
      amount: 1000,
      date: '2024-03-08',
      purpose: 'Scholarship Fund',
      status: 'completed'
    },
    {
      id: 3,
      donor: 'Anonymous',
      amount: 2500,
      date: '2024-03-05',
      purpose: 'General Fund',
      status: 'pending'
    }
  ]);

  const [financialRecords] = useState([
    {
      id: 1,
      category: 'Scholarships',
      budget: 50000,
      spent: 32500,
      remaining: 17500
    },
    {
      id: 2,
      category: 'Building Fund',
      budget: 100000,
      spent: 45000,
      remaining: 55000
    },
    {
      id: 3,
      category: 'Events',
      budget: 25000,
      spent: 12000,
      remaining: 13000
    },
    {
      id: 4,
      category: 'Administrative',
      budget: 15000,
      spent: 8000,
      remaining: 7000
    }
  ]);

  const renderDonationsManagement = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('admin.alumni.manageDonations', 'Manage Donations')}
        </h3>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            {t('admin.alumni.exportData', 'Export Data')}
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {t('admin.alumni.addDonation', 'Record Donation')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.donor', 'Donor')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.amount', 'Amount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.date', 'Date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.purpose', 'Purpose')}
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
              {donationsData.map((donation) => (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {donation.donor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${donation.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      donation.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      {t('admin.alumni.view', 'View')}
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      {t('admin.alumni.receipt', 'Receipt')}
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

  const renderFinancialRecords = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('admin.alumni.financialRecords', 'Financial Records')}
        </h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {t('admin.alumni.addRecord', 'Add Record')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">{record.category}</h4>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.alumni.budget', 'Budget')}</span>
                <span className="text-sm font-medium text-gray-900">
                  ${record.budget.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.alumni.spent', 'Spent')}</span>
                <span className="text-sm font-medium text-gray-900">
                  ${record.spent.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.alumni.remaining', 'Remaining')}</span>
                <span className="text-sm font-medium text-green-600">
                  ${record.remaining.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(record.spent / record.budget) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round((record.spent / record.budget) * 100)}% {t('admin.alumni.used', 'used')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Records Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.category', 'Category')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.budget', 'Budget')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.spent', 'Spent')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.remaining', 'Remaining')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.percentage', 'Percentage')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.alumni.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {financialRecords.map((record) => {
                const percentage = Math.round((record.spent / record.budget) * 100);
                return (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${record.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${record.spent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      ${record.remaining.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span>{percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        {t('admin.alumni.viewDetails', 'View Details')}
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        {t('admin.alumni.export', 'Export')}
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

  // Calculate total statistics
  const totalDonations = donationsData.reduce((sum, donation) => sum + donation.amount, 0);
  const totalBudget = financialRecords.reduce((sum, record) => sum + record.budget, 0);
  const totalSpent = financialRecords.reduce((sum, record) => sum + record.spent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('admin.alumni.financialManagement', 'Financial Management')}
        </h2>
        <p className="text-gray-600">
          {t('admin.alumni.manageFinancialDesc', 'Track donations, manage budgets, and monitor financial records')}
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('admin.alumni.totalDonations', 'Total Donations')}</p>
              <p className="text-2xl font-semibold text-gray-900">${totalDonations.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('admin.alumni.totalBudget', 'Total Budget')}</p>
              <p className="text-2xl font-semibold text-gray-900">${totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('admin.alumni.totalSpent', 'Total Spent')}</p>
              <p className="text-2xl font-semibold text-gray-900">${totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('donations')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'donations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('admin.alumni.donations', 'Donations')}
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'records'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('admin.alumni.financialRecords', 'Financial Records')}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'donations' && renderDonationsManagement()}
          {activeTab === 'records' && renderFinancialRecords()}
        </div>
      </div>
    </div>
  );
};

export default AlumniFinancialManagement;
