import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Search,
  Calendar,
  CreditCard,
  Receipt,
  PieChart,
  BarChart3,
  FileText,
  ExternalLink,
  Clock
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingOverlay from '../ui/LoadingOverlay';

const AlumniFinance = () => {
  const { t } = useLanguage();
  const [data, setData] = useState({
    records: [],
    contributions: [],
    payments: [],
    statements: [],
    summary: {}
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contributions'); // 'contributions', 'payments', 'statements'
  const [filter, setFilter] = useState('all'); // 'all', 'thisYear', 'lastYear'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      // Using sample data directly for alumni finance component
      // Admin API calls removed - this component shows alumni financial information
      setData({
        contributions: [
          {
            id: 1,
            date: '2024-01-15',
            amount: 500.00,
            currency: 'SAR',
            purpose: 'Annual Alumni Fund',
            status: 'completed',
            transaction_id: 'TXN001234',
            receipt_url: '/api/receipts/receipt_001.pdf'
          },
          {
            id: 2,
            date: '2024-02-10',
            amount: 250.00,
            currency: 'SAR',
            purpose: 'Student Scholarship Fund',
            status: 'completed',
            transaction_id: 'TXN001235',
            receipt_url: '/api/receipts/receipt_002.pdf'
          },
          {
            id: 3,
            date: '2024-03-05',
            amount: 1000.00,
            currency: 'SAR',
            purpose: 'Building Fund',
            status: 'pending',
            transaction_id: 'TXN001236',
            receipt_url: null
          }
        ],
        payments: [
          {
            id: 1,
            date: '2024-01-20',
            amount: 150.00,
            currency: 'SAR',
            type: 'Alumni Directory Listing',
            status: 'completed',
            invoice_id: 'INV001',
            payment_method: 'Credit Card'
          },
          {
            id: 2,
            date: '2024-02-15',
            amount: 75.00,
            currency: 'SAR',
            type: 'Event Registration',
            status: 'completed',
            invoice_id: 'INV002',
            payment_method: 'Bank Transfer'
          },
          {
            id: 3,
            date: '2024-03-01',
            amount: 200.00,
            currency: 'SAR',
            type: 'Alumni Magazine Subscription',
            status: 'failed',
            invoice_id: 'INV003',
            payment_method: 'Credit Card'
          }
        ],
        statements: [
          {
            id: 1,
            period: '2024-Q1',
            type: 'Annual Statement',
            generated_date: '2024-04-01',
            total_contributions: 1750.00,
            total_payments: 225.00,
            net_balance: 1525.00,
            statement_url: '/api/statements/statement_2024_q1.pdf'
          },
          {
            id: 2,
            period: '2023-Q4',
            type: 'Quarterly Statement',
            generated_date: '2024-01-01',
            total_contributions: 1200.00,
            total_payments: 180.00,
            net_balance: 1020.00,
            statement_url: '/api/statements/statement_2023_q4.pdf'
          }
        ],
        summary: {
          total_contributions: 1750.00,
          total_payments: 225.00,
          pending_contributions: 1000.00,
          this_year_contributions: 1750.00,
          last_year_contributions: 1200.00,
          membership_dues_paid: 150.00,
          outstanding_balance: 1000.00
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredData = {
    contributions: data.contributions.filter(item => {
      const matchesFilter = filter === 'all' || 
        (filter === 'thisYear' && new Date(item.date).getFullYear() === new Date().getFullYear()) ||
        (filter === 'lastYear' && new Date(item.date).getFullYear() === new Date().getFullYear() - 1);
      
      const matchesSearch = !searchTerm || 
        item.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    }),
    payments: data.payments.filter(item => {
      const matchesFilter = filter === 'all' || 
        (filter === 'thisYear' && new Date(item.date).getFullYear() === new Date().getFullYear()) ||
        (filter === 'lastYear' && new Date(item.date).getFullYear() === new Date().getFullYear() - 1);
      
      const matchesSearch = !searchTerm || 
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.invoice_id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    }),
    statements: data.statements.filter(item => {
      const matchesSearch = !searchTerm || 
        item.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    })
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'failed': 'bg-red-100 text-red-800 border-red-200',
      'cancelled': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatCurrency = (amount, currency = 'SAR') => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const renderContributionsTab = () => (
    <div className="space-y-4">
      {filteredData.contributions.map((contribution) => (
        <Card key={contribution.id}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold" style={{color: 'var(--text-color)'}}>
                  {contribution.purpose}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(contribution.status)}`}>
                  {contribution.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium" style={{color: 'var(--text-secondary)'}}>Amount:</span>
                  <div className="font-bold text-green-600">
                    {formatCurrency(contribution.amount, contribution.currency)}
                  </div>
                </div>
                <div>
                  <span className="font-medium" style={{color: 'var(--text-secondary)'}}>Date:</span>
                  <div style={{color: 'var(--text-color)'}}>
                    {new Date(contribution.date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="font-medium" style={{color: 'var(--text-secondary)'}}>Transaction ID:</span>
                  <div style={{color: 'var(--text-color)'}}>
                    {contribution.transaction_id}
                  </div>
                </div>
                <div>
                  <span className="font-medium" style={{color: 'var(--text-secondary)'}}>Receipt:</span>
                  <div>
                    {contribution.receipt_url ? (
                      <Button variant="outline" size="sm" href={contribution.receipt_url}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    ) : (
                      <span style={{color: 'var(--text-secondary)'}}>Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="space-y-4">
      {filteredData.payments.map((payment) => (
        <Card key={payment.id}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold" style={{color: 'var(--text-color)'}}>
                  {payment.type}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="font-medium" style={{color: 'var(--text-secondary)'}}>Amount:</span>
                  <div className="font-bold text-red-600">
                    {formatCurrency(payment.amount, payment.currency)}
                  </div>
                </div>
                <div>
                  <span className="font-medium" style={{color: 'var(--text-secondary)'}}>Date:</span>
                  <div style={{color: 'var(--text-color)'}}>
                    {new Date(payment.date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="font-medium" style={{color: 'var(--text-secondary)'}}>Invoice:</span>
                  <div style={{color: 'var(--text-color)'}}>
                    {payment.invoice_id}
                  </div>
                </div>
                <div>
                  <span className="font-medium" style={{color: 'var(--text-secondary)'}}>Method:</span>
                  <div style={{color: 'var(--text-color)'}}>
                    {payment.payment_method}
                  </div>
                </div>
                <div>
                  <span className="font-medium" style={{color: 'var(--text-secondary)'}}>Actions:</span>
                  <div>
                    {payment.status === 'failed' && (
                      <Button size="sm" variant="outline">
                        Retry Payment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderStatementsTab = () => (
    <div className="space-y-4">
      {filteredData.statements.map((statement) => (
        <Card key={statement.id}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold" style={{color: 'var(--text-color)'}}>
                  {statement.period} - {statement.type}
                </h3>
                <span className="text-sm" style={{color: 'var(--text-secondary)'}}>
                  Generated: {new Date(statement.generated_date).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium" style={{color: 'var(--text-secondary)'}}>Total Contributions:</span>
                  <div className="font-bold text-green-600">
                    {formatCurrency(statement.total_contributions)}
                  </div>
                </div>
                <div>
                  <span className="font-medium" style={{color: 'var(--text-secondary)'}}>Total Payments:</span>
                  <div className="font-bold text-red-600">
                    {formatCurrency(statement.total_payments)}
                  </div>
                </div>
                <div>
                  <span className="font-medium" style={{color: 'var(--text-secondary)'}}>Net Balance:</span>
                  <div className={`font-bold ${statement.net_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(statement.net_balance)}
                  </div>
                </div>
                <div>
                  <span className="font-medium" style={{color: 'var(--text-secondary)'}}>Statement:</span>
                  <div>
                    <Button variant="outline" size="sm" href={statement.statement_url}>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
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
          {t('alumni.finance')}
        </h1>
        <p className="text-lg mb-6" style={{color: 'var(--text-secondary)'}}>
          Track your contributions, payments, and financial statements
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{color: 'var(--text-secondary)'}}>
                Total Contributions
              </p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.summary.total_contributions)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{color: 'var(--text-secondary)'}}>
                Total Payments
              </p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(data.summary.total_payments)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{color: 'var(--text-secondary)'}}>
                Pending Contributions
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(data.summary.pending_contributions)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <PieChart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{color: 'var(--text-secondary)'}}>
                Outstanding Balance
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.summary.outstanding_balance)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Time' },
              { key: 'thisYear', label: 'This Year' },
              { key: 'lastYear', label: 'Last Year' }
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

      {/* Tabs */}
      <Card>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'contributions', label: t('alumni.contributions'), icon: TrendingUp },
            { key: 'payments', label: t('alumni.payments'), icon: CreditCard },
            { key: 'statements', label: t('alumni.statements'), icon: FileText }
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
          {activeTab === 'contributions' && renderContributionsTab()}
          {activeTab === 'payments' && renderPaymentsTab()}
          {activeTab === 'statements' && renderStatementsTab()}
        </div>
      </Card>

      {/* Empty States */}
      {(activeTab === 'contributions' && filteredData.contributions.length === 0) && (
        <Card>
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
            <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-color)'}}>
              No contributions found
            </h3>
            <p style={{color: 'var(--text-secondary)'}}>
              {searchTerm ? 'Try adjusting your search criteria.' : 'Start contributing to support your alma mater.'}
            </p>
          </div>
        </Card>
      )}

      {(activeTab === 'payments' && filteredData.payments.length === 0) && (
        <Card>
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
            <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-color)'}}>
              No payments found
            </h3>
            <p style={{color: 'var(--text-secondary)'}}>
              {searchTerm ? 'Try adjusting your search criteria.' : 'Your payment history will appear here.'}
            </p>
          </div>
        </Card>
      )}

      {(activeTab === 'statements' && filteredData.statements.length === 0) && (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
            <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-color)'}}>
              No statements available
            </h3>
            <p style={{color: 'var(--text-secondary)'}}>
              Financial statements will be generated and available for download.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AlumniFinance;
