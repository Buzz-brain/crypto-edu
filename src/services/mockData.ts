import { Transaction, User, PaymentRequest, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user_001',
    email: 'alice.smith@university.edu',
    role: 'student',
    name: 'Alice Smith',
    studentId: 'STU2024001',
    walletAddress: '0x742d35Cc6643C0532925a3b8F26c6Cad1234567',
    createdAt: '2024-01-15T08:00:00Z',
    isVerified: true,
    twoFactorEnabled: true
  },
  {
    id: 'admin_001',
    email: 'admin@university.edu',
    role: 'admin',
    name: 'Dr. Sarah Johnson',
    createdAt: '2023-08-01T08:00:00Z',
    isVerified: true,
    twoFactorEnabled: true
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx_001',
    studentId: 'STU2024001',
    studentName: 'Alice Smith',
    amount: 2.5,
    currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '⟐',
      usdPrice: 2400,
      gasPrice: 25,
      confirmationTime: 5
    },
    usdValue: 6000,
    txHash: '0x8d7e9f2a1c4b5e8a7f9d2c5e8b1a4d7e9f2c5a8b1e4d7f9c2a5e8b1d4f7a9c2',
    status: 'confirmed',
    type: 'tuition',
    description: 'Spring 2024 Tuition Payment',
    gasUsed: 21000,
    gasPrice: 25,
    blockNumber: 18954321,
    confirmations: 12,
    requiredConfirmations: 6,
    createdAt: '2024-01-20T10:30:00Z',
    confirmedAt: '2024-01-20T10:35:00Z'
  }
];

export const mockPaymentRequests: PaymentRequest[] = [
  {
    studentId: 'STU2024001',
    amount: 7500,
    currency: 'USD',
    type: 'tuition',
    description: 'Spring 2024 Tuition Fee',
    dueDate: '2024-03-01T23:59:59Z'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    userId: 'user_001',
    title: 'Payment Confirmed',
    message: 'Your tuition payment of 2.5 ETH has been confirmed on the blockchain.',
    type: 'success',
    read: false,
    createdAt: '2024-01-20T10:35:00Z'
  }
];