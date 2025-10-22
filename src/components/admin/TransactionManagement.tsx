import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  CheckCircle,
  XCircle,
  Flag,
  ExternalLink,
  FileText,
  Calendar
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';
import { Transaction } from '../../types';
import { mockTransactions } from '../../services/mockData';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

export function TransactionManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    ...mockTransactions,
    {
      id: 'tx_pending_001',
      studentId: 'STU2024002',
      studentName: 'John Doe',
      amount: 1.8,
      currency: {
        symbol: 'ETH',
        name: 'Ethereum',
        icon: '⟐',
        usdPrice: 2400,
        gasPrice: 25,
        confirmationTime: 5
      },
      usdValue: 4320,
      txHash: '0x9e8f7d6c5b4a3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8',
      status: 'confirmed',
      type: 'housing',
      description: 'Dormitory Fee - Fall 2024',
      gasUsed: 21000,
      gasPrice: 25,
      blockNumber: 18954322,
      confirmations: 6,
      requiredConfirmations: 6,
      createdAt: '2024-01-21T16:45:00Z',
      confirmedAt: '2024-01-21T16:50:00Z'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'flag' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = searchTerm === '' || 
      tx.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.txHash?.includes(searchTerm) ||
      tx.studentId.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAction = (transaction: Transaction, action: 'approve' | 'reject' | 'flag') => {
    setSelectedTx(transaction);
    setActionType(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (!selectedTx || !actionType) return;

    const newStatus = actionType === 'approve' ? 'approved' : 
                     actionType === 'reject' ? 'rejected' : 'flagged';

    setTransactions(transactions.map(tx => 
      tx.id === selectedTx.id 
        ? { ...tx, status: newStatus as any, adminNotes }
        : tx
    ));

    toast.success(`Transaction ${actionType}d successfully`);
    setShowModal(false);
    setSelectedTx(null);
    setActionType(null);
    setAdminNotes('');
  };

  const exportReport = (format: 'csv' | 'pdf') => {
    const exportData = filteredTransactions.map(tx => ({
      Date: format(parseISO(tx.createdAt), 'yyyy-MM-dd HH:mm'),
      Student: tx.studentName,
      'Student ID': tx.studentId,
      Description: tx.description,
      Amount: `${tx.amount} ${tx.currency.symbol}`,
      'USD Value': `$${tx.usdValue}`,
      Status: tx.status,
      'TX Hash': tx.txHash || 'N/A',
      'Block Number': tx.blockNumber || 'N/A',
      Confirmations: tx.confirmations
    }));
    
    if (format === 'csv') {
      exportToCSV(exportData, 'transactions');
    } else {
      exportToPDF(exportData, 'transactions', 'Transaction Management Report');
    }
    
    toast.success(`Exported ${exportData.length} transactions as ${format.toUpperCase()}`);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      approved: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      flagged: 'bg-orange-100 text-orange-800 border-orange-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status as keyof typeof styles] || styles.pending
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-600 to-blue-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Transaction Management</h1>
        <p className="text-slate-100">
          Review, approve, and manage all cryptocurrency payments
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by student, description, or tx hash..."
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="flagged">Flagged</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => exportReport('csv')}
                icon={<Download className="h-4 w-4" />}
              >
                Export CSV
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => exportReport('pdf')}
                icon={<FileText className="h-4 w-4" />}
              >
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">
              Transactions ({filteredTransactions.length})
            </h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx, index) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{tx.studentName}</div>
                          <div className="text-gray-500 text-xs">{tx.studentId}</div>
                          <div className="text-gray-500 text-xs truncate max-w-xs">
                            {tx.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">{tx.currency.icon}</span>
                          <div>
                            <div className="font-medium">{tx.amount} {tx.currency.symbol}</div>
                            <div className="text-gray-500 text-xs">${tx.usdValue.toLocaleString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(tx.status)}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {format(parseISO(tx.createdAt), 'MMM d, yyyy')}
                        <div className="text-xs text-gray-500">
                          {format(parseISO(tx.createdAt), 'HH:mm')}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {tx.status === 'confirmed' && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleAction(tx, 'approve')}
                                icon={<CheckCircle className="h-3 w-3" />}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleAction(tx, 'flag')}
                                icon={<Flag className="h-3 w-3" />}
                              >
                                Flag
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleAction(tx, 'reject')}
                                icon={<XCircle className="h-3 w-3" />}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          
                          {tx.txHash && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => window.open(`https://etherscan.io/tx/${tx.txHash}`, '_blank')}
                              icon={<ExternalLink className="h-3 w-3" />}
                            />
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No transactions found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${actionType?.charAt(0).toUpperCase()}${actionType?.slice(1)} Transaction`}
      >
        {selectedTx && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Student:</span>
                  <span className="font-medium">{selectedTx.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">{selectedTx.amount} {selectedTx.currency.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">USD Value:</span>
                  <span className="font-medium">${selectedTx.usdValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TX Hash:</span>
                  <span className="font-mono text-xs">{selectedTx.txHash?.slice(0, 20)}...</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes {actionType === 'flag' && '(Required)'}
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                required={actionType === 'flag'}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Add notes for ${actionType} action...`}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant={actionType === 'approve' ? 'success' : actionType === 'flag' ? 'warning' : 'danger'}
                onClick={confirmAction}
                disabled={actionType === 'flag' && !adminNotes.trim()}
              >
                Confirm {actionType?.charAt(0).toUpperCase()}{actionType?.slice(1)}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}