import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  Eye,
  ExternalLink,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { TransactionCard } from '../payment/TransactionCard';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';
import { mockTransactions } from '../../services/mockData';
import { Transaction } from '../../types';
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import toast from 'react-hot-toast';

export function PaymentHistory() {
  const [transactions] = useState<Transaction[]>([
    ...mockTransactions,
    {
      id: 'tx_002',
      studentId: 'STU2024001',
      studentName: 'Alice Smith',
      amount: 1.2,
      currency: {
        symbol: 'ETH',
        name: 'Ethereum',
        icon: '⟐',
        usdPrice: 2400,
        gasPrice: 25,
        confirmationTime: 5
      },
      usdValue: 2880,
      txHash: '0x7f3e8c1d9a2b4f6e8c1a3d5f7e9c2b4a6d8f1c3e5a7c9e1f3a5c7e9b1d3f5c7',
      status: 'confirmed',
      type: 'fees',
      description: 'Lab Equipment Fee',
      gasUsed: 21000,
      gasPrice: 25,
      blockNumber: 18954320,
      confirmations: 12,
      requiredConfirmations: 6,
      createdAt: '2024-01-18T14:20:00Z',
      confirmedAt: '2024-01-18T14:25:00Z'
    },
    {
      id: 'tx_003',
      studentId: 'STU2024001',
      studentName: 'Alice Smith',
      amount: 500,
      currency: {
        symbol: 'USDC',
        name: 'USD Coin',
        icon: '🔵',
        usdPrice: 1.00,
        gasPrice: 15,
        confirmationTime: 2
      },
      usdValue: 500,
      status: 'failed',
      type: 'books',
      description: 'Textbook Purchase - Insufficient Gas',
      gasUsed: 0,
      gasPrice: 15,
      blockNumber: 0,
      confirmations: 0,
      requiredConfirmations: 6,
      createdAt: '2024-01-15T09:15:00Z'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = searchTerm === '' || 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.txHash?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      
      let matchesDate = true;
      if (dateRange !== 'all') {
        const txDate = parseISO(tx.createdAt);
        const now = new Date();
        
        switch (dateRange) {
          case 'thisMonth':
            const startMonth = startOfMonth(now);
            const endMonth = endOfMonth(now);
            matchesDate = txDate >= startMonth && txDate <= endMonth;
            break;
          case 'lastMonth':
            const lastMonthStart = startOfMonth(subMonths(now, 1));
            const lastMonthEnd = endOfMonth(subMonths(now, 1));
            matchesDate = txDate >= lastMonthStart && txDate <= lastMonthEnd;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [transactions, searchTerm, statusFilter, typeFilter, dateRange]);

  const totalSpent = filteredTransactions
    .filter(tx => tx.status === 'confirmed')
    .reduce((sum, tx) => sum + tx.usdValue, 0);

  const exportHistory = (format: 'csv' | 'pdf') => {
    const exportData = filteredTransactions.map(tx => ({
      Date: format(parseISO(tx.createdAt), 'yyyy-MM-dd HH:mm'),
      Description: tx.description,
      Amount: `${tx.amount} ${tx.currency.symbol}`,
      'USD Value': `$${tx.usdValue}`,
      Status: tx.status,
      'TX Hash': tx.txHash || 'N/A',
      Type: tx.type
    }));
    
    if (format === 'csv') {
      exportToCSV(exportData, 'payment_history');
    } else {
      exportToPDF(exportData, 'payment_history', 'Payment History Report');
    }
    
    toast.success(`Exported ${exportData.length} transactions as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Payment History</h1>
        <p className="text-green-100">
          Track all your cryptocurrency payments and their blockchain confirmations
        </p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredTransactions.length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalSpent.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((filteredTransactions.filter(tx => tx.status === 'confirmed').length / filteredTransactions.length) * 100)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="tuition">Tuition</option>
                <option value="fees">Fees</option>
                <option value="housing">Housing</option>
                <option value="books">Books</option>
              </select>
              
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
              </select>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => exportHistory('csv')}
                icon={<Download className="h-4 w-4" />}
              >
                Export CSV
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => exportHistory('pdf')}
                icon={<Download className="h-4 w-4" />}
              >
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">
              Transactions ({filteredTransactions.length})
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                >
                  <TransactionCard transaction={transaction} />
                </motion.div>
              ))}
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No transactions found</h3>
                  <p className="text-gray-400">
                    {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                      ? 'Try adjusting your filters'
                      : 'Your payment history will appear here'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}