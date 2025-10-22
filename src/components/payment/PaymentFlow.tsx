import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Wallet, QrCode, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { SUPPORTED_CURRENCIES } from '../../config/constants';
import { blockchainService } from '../../services/blockchainService';
import { CryptoCurrency } from '../../types';
import { clsx } from 'clsx';
import QRCode from 'qrcode';

interface PaymentFlowProps {
  amount: number;
  description: string;
  onComplete: (txHash: string) => void;
  onCancel: () => void;
}

export function PaymentFlow({ amount, description, onComplete, onCancel }: PaymentFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>(SUPPORTED_CURRENCIES[0]);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'qr'>('wallet');
  const [gasEstimate, setGasEstimate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');

  const cryptoAmount = amount / selectedCurrency.usdPrice;

  const handleCurrencySelect = async (currency: CryptoCurrency) => {
    setSelectedCurrency(currency);
    setIsLoading(true);
    
    try {
      const gas = await blockchainService.estimateGas(currency.symbol, cryptoAmount);
      setGasEstimate(gas);
    } catch (error) {
      console.error('Gas estimation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCode = async () => {
    const paymentData = {
      to: '0x742d35Cc6643C0532925a3b8F26c6Cad1234567',
      value: cryptoAmount.toFixed(6),
      currency: selectedCurrency.symbol
    };
    
    const qrString = JSON.stringify(paymentData);
    const qrDataUrl = await QRCode.toDataURL(qrString);
    setQrCode(qrDataUrl);
  };

  const handleWalletPayment = async () => {
    setIsLoading(true);
    
    try {
      const txHash = await blockchainService.initiatePayment(
        cryptoAmount,
        selectedCurrency,
        '0x742d35Cc6643C0532925a3b8F26c6Cad1234567'
      );
      onComplete(txHash);
    } catch (error) {
      console.error('Payment failed:', error);
      setIsLoading(false);
    }
  };

  const steps = [
    { title: 'Select Currency', component: <CurrencySelection /> },
    { title: 'Choose Method', component: <PaymentMethod /> },
    { title: 'Confirm Payment', component: <PaymentConfirmation /> }
  ];

  function CurrencySelection() {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Select Cryptocurrency</h3>
        <div className="grid gap-3">
          {SUPPORTED_CURRENCIES.map((currency) => (
            <motion.div
              key={currency.symbol}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCurrencySelect(currency)}
              className={clsx(
                'p-4 border-2 rounded-lg cursor-pointer transition-colors',
                selectedCurrency.symbol === currency.symbol
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{currency.icon}</div>
                  <div>
                    <div className="font-medium">{currency.name}</div>
                    <div className="text-sm text-gray-500">{currency.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${currency.usdPrice.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">
                    {(amount / currency.usdPrice).toFixed(6)} {currency.symbol}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {gasEstimate && (
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
      </div>
    );
  }

  function PaymentMethod() {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        
        <div className="grid gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPaymentMethod('wallet')}
            className={clsx(
              'p-4 border-2 rounded-lg cursor-pointer',
              paymentMethod === 'wallet' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            )}
          >
            <div className="flex items-center space-x-3">
              <Wallet className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-medium">MetaMask Wallet</div>
                <div className="text-sm text-gray-500">Connect and pay directly</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setPaymentMethod('qr');
              generateQRCode();
            }}
            className={clsx(
              'p-4 border-2 rounded-lg cursor-pointer',
              paymentMethod === 'qr' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            )}
          >
            <div className="flex items-center space-x-3">
              <QrCode className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-medium">QR Code</div>
                <div className="text-sm text-gray-500">Scan with mobile wallet</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  function PaymentConfirmation() {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Confirm Payment</h3>
        
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">${amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Crypto Amount:</span>
            <span className="font-medium">{cryptoAmount.toFixed(6)} {selectedCurrency.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Gas Fee:</span>
            <span className="font-medium">${gasEstimate} USD</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total:</span>
            <span>${(amount + (gasEstimate || 0))}</span>
          </div>
        </div>

        {paymentMethod === 'qr' && qrCode && (
          <div className="flex flex-col items-center space-y-4">
            <img src={qrCode} alt="Payment QR Code" className="w-48 h-48" />
            <p className="text-sm text-gray-600 text-center">
              Scan this QR code with your mobile wallet
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleWalletPayment}
            loading={isLoading}
            className="w-full"
            size="lg"
            icon={paymentMethod === 'wallet' ? <Wallet className="h-5 w-5" /> : undefined}
          >
            {paymentMethod === 'wallet' ? 'Pay with MetaMask' : 'Confirm Payment'}
          </Button>
          
          <Button variant="secondary" onClick={onCancel} className="w-full">
            Cancel Payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card variant="elevated" className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Payment</h2>
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  step >= stepNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                )}
              >
                {stepNumber}
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[step - 1].component}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button
            variant="secondary"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            icon={<ChevronLeft className="h-4 w-4" />}
          >
            Back
          </Button>
          
          {step < 3 && (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !selectedCurrency}
              icon={<ChevronRight className="h-4 w-4" />}
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}