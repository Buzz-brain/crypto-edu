export interface User {
  id: string;
  email: string;
  role: 'student' | 'admin';
  name: string;
  studentId?: string;
  walletAddress?: string;
  createdAt: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  currency: CryptoCurrency;
  usdValue: number;
  txHash?: string;
  status: TransactionStatus;
  type: 'tuition' | 'fees' | 'housing' | 'books';
  description: string;
  gasUsed?: number;
  gasPrice?: number;
  blockNumber?: number;
  confirmations: number;
  requiredConfirmations: number;
  createdAt: string;
  confirmedAt?: string;
  receiptHash?: string;
  adminNotes?: string;
}

export interface CryptoCurrency {
  symbol: string;
  name: string;
  icon: string;
  usdPrice: number;
  gasPrice: number;
  confirmationTime: number; // minutes
}

export type TransactionStatus = 
  | 'pending'
  | 'confirming' 
  | 'confirmed'
  | 'failed'
  | 'flagged'
  | 'approved'
  | 'rejected';

export interface PaymentRequest {
  studentId: string;
  amount: number;
  currency: string;
  type: string;
  description: string;
  dueDate: string;
}

export interface Receipt {
  id: string;
  transactionId: string;
  ipfsHash: string;
  fileName: string;
  uploadedAt: string;
  verified: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

export interface WalletConnection {
  address: string;
  balance: number;
  network: string;
  connected: boolean;
}