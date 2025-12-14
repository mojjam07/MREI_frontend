
import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Filter, Search, Eye } from 'lucide-react';
import { useTutorDashboard } from '../../hooks/useTutorDashboard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import FormModal from '../ui/FormModal';
import ProgressBar from '../ui/ProgressBar';

const FinancialOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');


  const {
    financialLoading
  } = useTutorDashboard();

  // Mock financial data (would come from API)
  const mockFinancialData = {
    totalEarnings: 12500,
    monthlyEarnings: 3200,
    pendingPayments: 850,
    completedPayments: 11650,
    thisMonthEarnings: 3200,
    lastMonthEarnings: 2800,
    averageRating: 4.8,
    totalSessions: 156
  };

  const mockTransactions = [
    {
      id: 1,
      type: 'payment',
      description: 'Monthly tutoring session - Mathematics',
      amount: 200,
      date: '2024-01-15',
      status: 'completed',
      student: 'John Doe',
      course: 'Mathematics 101'
    },
    {
      id: 2,
      type: 'payment',
      description: 'Assignment grading - Science',
      amount: 150,
      date: '2024-01-12',
      status: 'pending',
      student: 'Jane Smith',
      course: 'Biology 201'
    },
    {
      id: 3,
      type: 'bonus',
      description: 'Performance bonus - Excellent ratings',
      amount: 100,
      date: '2024-01-10',
      status: 'completed',
      student: '',
      course: ''
    },
    {
      id: 4,
      type: 'payment',
      description: 'One-on-one tutoring - Physics',
      amount: 250,
      date: '2024-01-08',
      status: 'completed',
      student: 'Mike Johnson',
      course: 'Physics 301'
    },
    {
      id: 5,
      type: 'deduction',
      description: 'Platform fee deduction',
      amount: -50,
      date: '2024-01-05',
      status: 'completed',
      student: '',
      course: ''
    }
  ];

  // Filter transactions
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.student?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.course?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'payments' && transaction.type === 'payment') ||
                         (filterType === 'bonuses' && transaction.type === 'bonus') ||
                         (filterType === 'deductions' && transaction.type === 'deduction') ||
                         (filterType === 'pending' && transaction.status === 'pending') ||
                         (filterType === 'completed' && transaction.status === 'completed');
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate financial metrics
  const getFinancialMetrics = () => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const thisMonthTransactions = mockTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === thisMonth && 
             transactionDate.getFullYear() === thisYear;
    });
    
    const lastMonthTransactions = mockTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === thisMonth - 1 && 
             transactionDate.getFullYear() === thisYear;
    });
    
    const thisMonthEarnings = thisMonthTransactions
      .filter(t => t.type === 'payment' || t.type === 'bonus')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonthEarnings = lastMonthTransactions
      .filter(t => t.type === 'payment' || t.type === 'bonus')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyGrowth = lastMonthEarnings > 0 ? 
      ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100 : 0;
    
    const pendingAmount = mockTransactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalEarnings: mockTransactions
        .filter(t => (t.type === 'payment' || t.type === 'bonus') && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      thisMonthEarnings,
      lastMonthEarnings,
      monthlyGrowth,
      pendingAmount,
      completedAmount: mockTransactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0)
    };
  };

  const metrics = getFinancialMetrics();

  // Calculate earnings by course
  const getEarningsByCourse = () => {
    const courseEarnings = {};
    mockTransactions
      .filter(t => t.type === 'payment' && t.status === 'completed')
      .forEach(transaction => {
        const course = transaction.course || 'General';
        if (!courseEarnings[course]) {
          courseEarnings[course] = 0;
        }
        courseEarnings[course] += transaction.amount;
      });
    
    return Object.entries(courseEarnings)
      .map(([course, earnings]) => ({ course, earnings }))
      .sort((a, b) => b.earnings - a.earnings);
  };

  const courseEarnings = getEarningsByCourse();

  // Get transaction icon and color
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'payment': return '💰';
      case 'bonus': return '🎁';
      case 'deduction': return '💸';
      default: return '💵';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'payment': return 'text-green-600';
      case 'bonus': return 'text-blue-600';
      case 'deduction': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (financialLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_year">This Year</option>
            <option value="all_time">All Time</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">${metrics.totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                All time earnings
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-blue-600">${metrics.thisMonthEarnings.toLocaleString()}</p>
              <p className={`text-xs mt-1 flex items-center ${
                metrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.monthlyGrowth >= 0 ? 
                  <TrendingUp className="w-3 h-3 mr-1" /> : 
                  <TrendingDown className="w-3 h-3 mr-1" />
                }
                {Math.abs(metrics.monthlyGrowth).toFixed(1)}% from last month
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-orange-600">${metrics.pendingAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.completedAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Total processed</p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-900" />
          </div>
        </Card>
      </div>

      {/* Earnings Chart Placeholder */}
      <Card title="Earnings Trend">
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Earnings chart would be displayed here</p>
            <p className="text-sm text-gray-500">Integration with chart library needed</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings by Course */}
        <Card title="Top Earning Courses" className="lg:col-span-1">
          <div className="space-y-4">
            {courseEarnings.slice(0, 5).map((course, index) => (
              <div key={course.course} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{course.course}</p>
                    <p className="text-xs text-gray-500">Course earnings</p>
                  </div>
                </div>
                <span className="font-bold text-green-600">${course.earnings}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card title="Recent Transactions" className="lg:col-span-2">
          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="payments">Payments</option>
              <option value="bonuses">Bonuses</option>
              <option value="deductions">Deductions</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Transactions Table */}
          <DataTable
            data={filteredTransactions}
            columns={[
              { 
                key: 'type', 
                label: 'Type', 
                render: (value) => (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTransactionIcon(value)}</span>
                    <span className={`capitalize ${getTransactionColor(value)}`}>
                      {value}
                    </span>
                  </div>
                )
              },

              { 
                key: 'description', 
                label: 'Description', 
                render: (value, item) => (
                  <div>
                    <p className="font-medium text-gray-900">{value}</p>
                    {item.student && (
                      <p className="text-sm text-gray-500">
                        Student: {item.student}
                      </p>
                    )}
                    {item.course && (
                      <p className="text-sm text-gray-500">
                        Course: {item.course}
                      </p>
                    )}
                  </div>
                )
              },

              { 
                key: 'amount', 
                label: 'Amount', 
                render: (value) => (
                  <span className={`font-bold ${
                    value > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(value).toLocaleString()}
                  </span>
                )
              },
              { 
                key: 'date', 
                label: 'Date', 
                render: (value) => (
                  <span className="text-gray-900">
                    {new Date(value).toLocaleDateString()}
                  </span>
                )
              },
              { 
                key: 'status', 
                label: 'Status', 
                render: (value) => (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    value === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </span>
                )
              },

              { 
                key: 'actions', 
                label: 'Actions', 
                render: (_, item) => (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTransaction(item);
                      setShowDetailsModal(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )
              }
            ]}
          />
        </Card>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Payment Performance">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Rating</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-yellow-600">⭐ {mockFinancialData.averageRating}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Sessions</span>
              <span className="font-bold text-blue-600">{mockFinancialData.totalSessions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average per Session</span>
              <span className="font-bold text-green-600">
                ${(metrics.totalEarnings / mockFinancialData.totalSessions).toFixed(2)}
              </span>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-medium">95%</span>
              </div>
              <ProgressBar progress={95} color="green" />
            </div>
          </div>
        </Card>

        <Card title="Payment Schedule">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Next Payment</h4>
              <p className="text-2xl font-bold text-blue-600 mb-1">$850</p>
              <p className="text-sm text-blue-700">Expected: Jan 30, 2024</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">This Month</p>
                <p className="font-bold text-green-800">${metrics.thisMonthEarnings}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Last Month</p>
                <p className="font-bold text-gray-800">${metrics.lastMonthEarnings}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 text-center">
              Payments are processed on the last business day of each month
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <FormModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTransaction(null);
          }}
          title="Transaction Details"
          size="md"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                <p className="text-gray-900">#{selectedTransaction.id.toString().padStart(6, '0')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <p className="text-gray-900 capitalize">{selectedTransaction.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <p className={`font-bold ${selectedTransaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(selectedTransaction.amount).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedTransaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900">{selectedTransaction.description}</p>
            </div>
            
            {selectedTransaction.student && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <p className="text-gray-900">{selectedTransaction.student}</p>
              </div>
            )}
            
            {selectedTransaction.course && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <p className="text-gray-900">{selectedTransaction.course}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <p className="text-gray-900">{new Date(selectedTransaction.date).toLocaleDateString()}</p>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default FinancialOverview;
