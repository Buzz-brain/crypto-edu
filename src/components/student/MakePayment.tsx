import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Wallet, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Copy,
  QrCode
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { SUPPORTED_CURRENCIES } from '../../config/constants';
import { blockchainService } from '../../services/blockchainService';
import { walletService } from '../../services/walletService';
import { CryptoCurrency } from '../../types';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

export function MakePayment() {
  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency | null>(null);
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('tuition');
  const [description, setDescription] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [gasEstimate, setGasEstimate] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<'pending' | 'confirming' | 'confirmed' | 'failed' | null>(null);
  const [confirmations, setConfirmations] = useState(0);
  const [qrCode, setQrCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const paymentTypes = [
    { value: 'tuition', label: 'Tuition Fee', description: 'Semester or annual tuition payment' },
    { value: 'fees', label: 'Administrative Fees', description: 'Registration, lab, or other fees' },
    { value: 'housing', label: 'Housing & Accommodation', description: 'Dormitory or housing costs' },
    { value: 'books', label: 'Books & Materials', description: 'Textbooks and course materials' }
  ];

  const handleCurrencySelect = async (currency: CryptoCurrency) => {
    setSelectedCurrency(currency);
    if (amount) {
      setIsLoading(true);
      try {
        const cryptoAmount = parseFloat(amount) / currency.usdPrice;
        const gas = await blockchainService.estimateGas(currency.symbol, cryptoAmount);
        setGasEstimate(gas);
      } catch (error) {
        console.error('Gas estimation failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAmountChange = async (value: string) => {
    setAmount(value);
    if (selectedCurrency && value) {
      setIsLoading(true);
      try {
        const cryptoAmount = parseFloat(value) / selectedCurrency.usdPrice;
        const gas = await blockchainService.estimateGas(selectedCurrency.symbol, cryptoAmount);
        setGasEstimate(gas);
      } catch (error) {
        console.error('Gas estimation failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const connection = await walletService.connectMetaMask();
      setWalletConnected(true);
      toast.success(`Wallet connected: ${connection.address.slice(0, 8)}...`);
    } catch (error) {
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCode = async () => {
    if (!selectedCurrency || !amount) return;
    
    const cryptoAmount = parseFloat(amount) / selectedCurrency.usdPrice;
    const paymentData = {
      to: '0x742d35Cc6643C0532925a3b8F26c6Cad1234567',
      value: cryptoAmount.toFixed(6),
      currency: selectedCurrency.symbol,
      description: description || `${paymentType} payment`
    };
    
    const qrString = JSON.stringify(paymentData);
    const qrDataUrl = await QRCode.toDataURL(qrString);
    setQrCode(qrDataUrl);
  };

  const processPayment = async () => {
    if (!selectedCurrency || !amount) return;

    setIsLoading(true);
    setTxStatus('pending');

    try {
      const cryptoAmount = parseFloat(amount) / selectedCurrency.usdPrice;
      const hash = await blockchainService.initiatePayment(
        cryptoAmount,
        selectedCurrency,
        '0x742d35Cc6643C0532925a3b8F26c6Cad1234567'
      );
      
      setTxHash(hash);
      setTxStatus('confirming');
      toast.success('Transaction submitted to blockchain!');

      // Simulate confirmation progress
      blockchainService.simulateConfirmationProgress(hash, (newConfirmations) => {
        setConfirmations(newConfirmations);
        if (newConfirmations >= 6) {
          setTxStatus('confirmed');
          toast.success('Payment confirmed!');
        }
      });

    } catch (error) {
      setTxStatus('failed');
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const resetPayment = () => {
    setStep(1);
    setSelectedCurrency(null);
    setAmount('');
    setDescription('');
    setTxHash(null);
    setTxStatus(null);
    setConfirmations(0);
    setGasEstimate(null);
    setQrCode('');
  };

  if (txStatus) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
        >
          <h1 className="text-2xl font-bold mb-2">Payment Status</h1>
          <p className="text-blue-100">
            Track your cryptocurrency payment in real-time
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated" className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                {txStatus === 'pending' && (
                  <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-10 w-10 text-yellow-600 animate-pulse" />
                  </div>
                )}
                {txStatus === 'confirming' && (
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="h-10 w-10 text-blue-600" />
                    </motion.div>
                  </div>
                )}
                {txStatus === 'confirmed' && (
                  <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                )}
                {txStatus === 'failed' && (
                  <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-10 w-10 text-red-600" />
                  </div>
                )}
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {txStatus === 'pending' && 'Payment Pending'}
                {txStatus === 'confirming' && 'Confirming Payment'}
                {txStatus === 'confirmed' && 'Payment Confirmed!'}
                {txStatus === 'failed' && 'Payment Failed'}
              </h2>

              <p className="text-gray-600 mb-6">
                {txStatus === 'pending' && 'Your payment is being processed...'}
                {txStatus === 'confirming' && `Waiting for blockchain confirmations (${confirmations}/6)`}
                {txStatus === 'confirmed' && 'Your payment has been successfully confirmed on the blockchain'}
                {txStatus === 'failed' && 'There was an issue processing your payment'}
              </p>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <div className="font-medium">${amount}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Currency:</span>
                    <div className="font-medium flex items-center">
                      <span className="mr-1">{selectedCurrency?.icon}</span>
                      {selectedCurrency?.symbol}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <div className="font-medium capitalize">{paymentType}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Gas Fee:</span>
                    <div className="font-medium">${gasEstimate}</div>
                  </div>
                </div>
              </div>

              {/* Transaction Hash */}
              {txHash && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Hash
                  </label>
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-3">
                    <code className="flex-1 text-sm font-mono text-gray-800 truncate">
                      {txHash}
                    </code>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(txHash)}
                      icon={<Copy className="h-3 w-3" />}
                      className="p-2"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, '_blank')}
                      icon={<ExternalLink className="h-3 w-3" />}
                      className="p-2"
                    />
                  </div>
                </div>
              )}

              {/* Confirmation Progress */}
              {txStatus === 'confirming' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Confirmations</span>
                    <span className="font-medium">{confirmations}/6</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(confirmations / 6) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Estimated time: {(6 - confirmations) * 2} minutes
                  </p>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={resetPayment}
                  variant="secondary"
                >
                  Make Another Payment
                </Button>
                {txStatus === 'confirmed' && (
                  <Button
                    onClick={() => window.open('/receipts', '_self')}
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    Upload Receipt
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Make Payment</h1>
        <p className="text-green-100">
          Pay your institutional fees securely with cryptocurrency
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                step >= stepNumber
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              )}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={clsx(
                  'w-12 h-0.5 mx-2 transition-colors',
                  step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                )} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Step Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="elevated" className="max-w-2xl mx-auto">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              {step === 1 && 'Payment Details'}
              {step === 2 && 'Select Currency'}
              {step === 3 && 'Connect Wallet'}
              {step === 4 && 'Confirm Payment'}
            </h2>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {paymentTypes.map((type) => (
                        <motion.button
                          key={type.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPaymentType(type.value)}
                          className={clsx(
                            'p-4 border-2 rounded-lg text-left transition-colors',
                            paymentType === type.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <div className="font-medium text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (USD)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="Enter amount in USD"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Payment description"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid gap-4">
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <motion.button
                        key={currency.symbol}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCurrencySelect(currency)}
                        className={clsx(
                          'p-4 border-2 rounded-lg transition-colors',
                          selectedCurrency?.symbol === currency.symbol
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{currency.icon}</div>
                            <div className="text-left">
                              <div className="font-medium">{currency.name}</div>
                              <div className="text-sm text-gray-500">{currency.symbol}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${currency.usdPrice.toLocaleString()}</div>
                            {amount && (
                              <div className="text-sm text-gray-500">
                                {(parseFloat(amount) / currency.usdPrice).toFixed(6)} {currency.symbol}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {gasEstimate && selectedCurrency && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span>Estimated gas fee: ${gasEstimate} USD</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  {!walletConnected ? (
                    <>
                      <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Wallet className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Connect Your Wallet</h3>
                      <p className="text-gray-600">
                        Connect your MetaMask wallet to proceed with the payment
                      </p>
                      <Button
                        onClick={connectWallet}
                        loading={isLoading}
                        size="lg"
                        icon={<Wallet className="h-5 w-5" />}
                        className="w-full"
                      >
                        Connect MetaMask
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">or</span>
                        </div>
                      </div>

                      <Button
                        onClick={generateQRCode}
                        variant="secondary"
                        size="lg"
                        icon={<QrCode className="h-5 w-5" />}
                        className="w-full"
                      >
                        Generate QR Code
                      </Button>

                      {qrCode && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-6"
                        >
                          <img src={qrCode} alt="Payment QR Code" className="w-48 h-48 mx-auto" />
                          <p className="text-sm text-gray-600 mt-2">
                            Scan with your mobile wallet
                          </p>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Wallet Connected!</h3>
                      <p className="text-gray-600">
                        Your wallet is connected and ready for payment
                      </p>
                    </>
                  )}
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-center">Confirm Payment</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Type:</span>
                      <span className="font-medium capitalize">{paymentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Currency:</span>
                      <span className="font-medium flex items-center">
                        <span className="mr-1">{selectedCurrency?.icon}</span>
                        {selectedCurrency?.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crypto Amount:</span>
                      <span className="font-medium">
                        {selectedCurrency && (parseFloat(amount) / selectedCurrency.usdPrice).toFixed(6)} {selectedCurrency?.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gas Fee:</span>
                      <span className="font-medium">${gasEstimate}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${(parseFloat(amount) + (gasEstimate || 0)).toFixed(2)}</span>
                    </div>
                  </div>

                  {description && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <span className="text-sm text-gray-600">Description:</span>
                      <p className="font-medium">{description}</p>
                    </div>
                  )}

                  <Button
                    onClick={processPayment}
                    loading={isLoading}
                    size="lg"
                    className="w-full"
                    icon={<CreditCard className="h-5 w-5" />}
                  >
                    Confirm Payment
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="secondary"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Back
              </Button>
              
              {step < 4 && (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!amount || !paymentType)) ||
                    (step === 2 && !selectedCurrency) ||
                    (step === 3 && !walletConnected && !qrCode)
                  }
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}