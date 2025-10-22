import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Clock, 
  TrendingUp, 
  Upload,
  DollarSign,
  Calendar
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { PaymentFlow } from '../payment/PaymentFlow';
import { TransactionCard } from '../payment/TransactionCard';
import { mockTransactions, mockPaymentRequests } from '../../services/mockData';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';

export function StudentDashboard() {
  const { user } = useAuth();
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(mockPaymentRequests[0]);
  const [transactions, setTransactions] = useState(mockTransactions);

  const totalBalance = 15750; // Mock current balance
  const pendingPayments = mockPaymentRequests.reduce((sum, req) => sum + req.amount, 0);

  const handlePaymentComplete = (txHash: string) => {
    // SRS 3.1.2: Transaction hash display
    const newTransaction = {
      id: `tx_${Date.now()}`,
      studentId: user!.studentId!,
      studentName: user!.name,
      amount: selectedPayment.amount / 2400, // Convert USD to ETH
      currency: {
        symbol: 'ETH',
        name: 'Ethereum',
        icon: '⟐',
        usdPrice: 2400,
        gasPrice: 25,
        confirmationTime: 5
      },
      usdValue: selectedPayment.amount,
      txHash,
      status: 'confirming' as const,
      type: selectedPayment.type as any,
      description: selectedPayment.description,
      gasUsed: 21000,
      gasPrice: 25,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      confirmations: 0,
      requiredConfirmations: 6,
      createdAt: new Date().toISOString()
    };

    setTransactions([newTransaction, ...transactions]);
    setShowPaymentFlow(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">
          Manage your payments securely with cryptocurrency
        </p>
      </motion.div>

      {/* Balance Cards */}
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
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalBalance.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
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
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-amber-600">
                    ${pendingPayments.toLocaleString()}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
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
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${(6000).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => setShowPaymentFlow(true)}
                icon={<CreditCard className="h-5 w-5" />}
                size="lg"
                className="w-full"
              >
                Make Payment
              </Button>
              <Button
                variant="secondary"
                icon={<Upload className="h-5 w-5" />}
                size="lg"
                className="w-full"
              >
                Upload Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
              
              {transactions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No transactions yet</p>
                  <p className="text-sm">Make your first payment to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Flow Modal */}
      <Modal
        isOpen={showPaymentFlow}
        onClose={() => setShowPaymentFlow(false)}
        size="lg"
      >
        <PaymentFlow
          amount={selectedPayment.amount}
          description={selectedPayment.description}
          onComplete={handlePaymentComplete}
          onCancel={() => setShowPaymentFlow(false)}
        />
      </Modal>
    </div>
  );
}