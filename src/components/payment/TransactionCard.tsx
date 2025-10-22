import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Transaction } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { blockchainService } from '../../services/blockchainService';
import { clsx } from 'clsx';

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const [confirmations, setConfirmations] = useState(transaction.confirmations);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (transaction.status === 'confirming' && !isSimulating) {
      setIsSimulating(true);
      blockchainService.simulateConfirmationProgress(
        transaction.txHash!,
        (newConfirmations) => setConfirmations(newConfirmations)
      ).then(() => {
        setIsSimulating(false);
      });
    }
  }, [transaction.status, transaction.txHash, isSimulating]);

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'confirmed':
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'flagged':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'confirmed':
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'flagged':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card interactive variant="elevated">
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">{transaction.currency.icon}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                  {getStatusIcon()}
                </div>
                
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-600">
                    {transaction.amount} {transaction.currency.symbol} • ${transaction.usdValue.toLocaleString()}
                  </p>
                  
                  {transaction.txHash && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {transaction.txHash.slice(0, 20)}...
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="p-1"
                        icon={<ExternalLink className="h-3 w-3" />}
                        onClick={() => window.open(`https://etherscan.io/tx/${transaction.txHash}`, '_blank')}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                getStatusColor()
              )}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Confirmation Progress */}
          {(transaction.status === 'confirming' || transaction.status === 'pending') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Confirmations</span>
                <span className="font-medium">
                  {confirmations}/{transaction.requiredConfirmations}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(confirmations / transaction.requiredConfirmations) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                  className="bg-blue-600 h-2 rounded-full"
                />
              </div>
              
              {confirmations < transaction.requiredConfirmations && (
                <p className="text-xs text-gray-500 mt-2">
                  Estimated time: {(transaction.requiredConfirmations - confirmations) * 2} minutes
                </p>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}