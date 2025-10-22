export const SUPPORTED_CURRENCIES = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '🔵',
    usdPrice: 1.00,
    gasPrice: 15,
    confirmationTime: 2
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '⟐',
    usdPrice: 2400,
    gasPrice: 25,
    confirmationTime: 5
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '₿',
    usdPrice: 43000,
    gasPrice: 50,
    confirmationTime: 15
  }
];

export const TRANSACTION_TYPES = [
  { value: 'tuition', label: 'Tuition Fee' },
  { value: 'fees', label: 'Administrative Fees' },
  { value: 'housing', label: 'Housing & Accommodation' },
  { value: 'books', label: 'Books & Materials' }
];

export const API_ENDPOINTS = {
  auth: '/api/auth',
  transactions: '/api/transactions',
  users: '/api/users',
  ipfs: '/api/ipfs'
};

export const DEMO_MODE_CONFIG = {
  confirmationSpeed: 'normal', // fast, normal, slow
  gasMultiplier: 1,
  volatilityEnabled: true,
  failureRate: 0.05 // 5% chance of failure
};