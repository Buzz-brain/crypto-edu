import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Book, 
  Video, 
  MessageCircle, 
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Play
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface TutorialStep {
  title: string;
  description: string;
  target?: string;
  action?: string;
}

export function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState<TutorialStep[]>([]);
  const [tutorialStep, setTutorialStep] = useState(0);

  const faqData: FAQItem[] = [
    {
      question: 'How do I make my first cryptocurrency payment?',
      answer: 'Navigate to the Payments section, select your preferred cryptocurrency, enter the amount, and follow the wallet connection prompts. The system will guide you through each step with clear instructions.',
      category: 'payments'
    },
    {
      question: 'What cryptocurrencies are supported?',
      answer: 'We currently support Bitcoin (BTC), Ethereum (ETH), and USD Coin (USDC). Each currency has different confirmation times and gas fees, which are clearly displayed before payment.',
      category: 'payments'
    },
    {
      question: 'How long do transactions take to confirm?',
      answer: 'Confirmation times vary by cryptocurrency: USDC (~2 minutes), ETH (~5 minutes), BTC (~15 minutes). Real-time progress is shown during the confirmation process.',
      category: 'payments'
    },
    {
      question: 'What happens if my payment fails?',
      answer: 'Failed payments are immediately refunded to your wallet (minus any gas fees already consumed). You can retry the payment or contact support for assistance.',
      category: 'payments'
    },
    {
      question: 'How do I upload payment receipts?',
      answer: 'Use the Receipt Upload section to drag and drop or browse for your receipt files. Files are stored securely on IPFS with cryptographic verification.',
      category: 'receipts'
    },
    {
      question: 'What file formats are accepted for receipts?',
      answer: 'We accept PDF, PNG, JPG, and JPEG files up to 5MB in size. All files are stored with cryptographic hashing for verification.',
      category: 'receipts'
    },
    {
      question: 'How do I connect my MetaMask wallet?',
      answer: 'Click "Connect Wallet" in the header, approve the connection in MetaMask, and your wallet will be linked to your account for payments.',
      category: 'security'
    },
    {
      question: 'Is two-factor authentication required?',
      answer: '2FA is optional but highly recommended for additional account security. You can enable it in Settings with any TOTP authenticator app.',
      category: 'security'
    }
  ];

  const tutorials = {
    'first-payment': [
      { title: 'Welcome to Payments', description: 'Let\'s walk through making your first cryptocurrency payment', target: 'payments-section' },
      { title: 'Select Currency', description: 'Choose your preferred cryptocurrency and review the exchange rate', target: 'currency-selector' },
      { title: 'Connect Wallet', description: 'Connect your MetaMask wallet to authorize the payment', target: 'wallet-connect' },
      { title: 'Confirm Payment', description: 'Review details and confirm your payment on the blockchain', target: 'payment-confirm' },
      { title: 'Track Progress', description: 'Monitor your transaction as it gets confirmed on the blockchain', target: 'confirmation-tracker' }
    ],
    'receipt-upload': [
      { title: 'Receipt Management', description: 'Learn how to upload and verify payment receipts', target: 'receipt-section' },
      { title: 'Upload Files', description: 'Drag and drop or browse for your receipt files', target: 'upload-area' },
      { title: 'IPFS Storage', description: 'Your receipts are stored on IPFS for permanent verification', target: 'ipfs-info' },
      { title: 'Verification', description: 'Verify receipt authenticity using cryptographic hashing', target: 'verify-button' }
    ]
  };

  const categories = ['all', 'payments', 'receipts', 'security', 'account'];

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const startTutorial = (tutorialKey: keyof typeof tutorials) => {
    setCurrentTutorial(tutorials[tutorialKey]);
    setTutorialStep(0);
    setShowTutorialModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Help Center</h1>
        <p className="text-emerald-100">
          Get help with payments, security, and platform features
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card interactive>
            <CardContent className="p-6 text-center">
              <Play className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">First Payment Tutorial</h3>
              <p className="text-gray-600 text-sm mb-4">
                Interactive guide for your first cryptocurrency payment
              </p>
              <Button
                onClick={() => startTutorial('first-payment')}
                size="sm"
                className="w-full"
              >
                Start Tutorial
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card interactive>
            <CardContent className="p-6 text-center">
              <Book className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Receipt Upload Guide</h3>
              <p className="text-gray-600 text-sm mb-4">
                Learn to upload and verify payment receipts
              </p>
              <Button
                onClick={() => startTutorial('receipt-upload')}
                variant="success"
                size="sm"
                className="w-full"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card interactive>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get help from our support team
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                icon={<ExternalLink className="h-4 w-4" />}
              >
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search FAQ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="payments">Payments</option>
                  <option value="receipts">Receipts</option>
                  <option value="security">Security</option>
                  <option value="account">Account</option>
                </select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                      {expandedFAQ === index ? (
                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedFAQ === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50">
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No results found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search terms or category filter
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tutorial Modal */}
      <Modal
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
        title={`Tutorial: ${currentTutorial[tutorialStep]?.title}`}
        size="lg"
      >
        <AnimatePresence mode="wait">
          {currentTutorial.length > 0 && (
            <motion.div
              key={tutorialStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Step {tutorialStep + 1} of {currentTutorial.length}
                </h3>
                <p className="text-blue-800">
                  {currentTutorial[tutorialStep]?.description}
                </p>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <div className="flex space-x-1">
                  {currentTutorial.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-8 rounded-full transition-colors ${
                        index <= tutorialStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="secondary"
                  onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
                  disabled={tutorialStep === 0}
                >
                  Previous
                </Button>
                
                {tutorialStep < currentTutorial.length - 1 ? (
                  <Button
                    onClick={() => setTutorialStep(tutorialStep + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowTutorialModal(false)}
                  >
                    Complete
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </div>
  );
}