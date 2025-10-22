import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, LogOut, Settings, Wallet, Globe, Sun, Moon, Languages } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { walletService } from '../../services/walletService';
import { Modal } from '../ui/Modal';
import toast from 'react-hot-toast';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [walletConnected, setWalletConnected] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleConnectWallet = async () => {
    try {
      const connection = await walletService.connectMetaMask();
      setWalletConnected(true);
      toast.success(t('notification.walletConnected'));
    } catch (error) {
      toast.error('Wallet connection failed');
    }
  };

  const handleDisconnectWallet = () => {
    walletService.disconnect();
    setWalletConnected(false);
    toast.success('Wallet disconnected');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    toast.success(t('notification.languageChanged'));
  };

  const handleThemeToggle = () => {
    toggleTheme();
    toast.success(t('notification.themeChanged'));
  };

  const mockNotifications = [
    {
      id: 1,
      title: t('notification.paymentConfirmed'),
      message: 'Your tuition payment has been confirmed on the blockchain',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      title: t('notification.receiptUploaded'),
      message: 'Receipt successfully stored on IPFS',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Welcome to CryptoEdu',
      message: 'Complete your profile to get started',
      time: '2 hours ago',
      unread: false
    }
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                CryptoEdu
              </motion.div>
              {user?.role === 'student' && (
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
                  Student ID: {user.studentId}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="relative">
                <select
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="en">🇺🇸 EN</option>
                  <option value="fr">🇫🇷 FR</option>
                </select>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={handleThemeToggle}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Wallet Connection */}
              {user?.role === 'student' && (
                <>
                  {!walletConnected ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleConnectWallet}
                      icon={<Wallet className="h-4 w-4" />}
                    >
                      Connect Wallet
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="hidden sm:inline">Wallet Connected</span>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleDisconnectWallet}
                      >
                        Disconnect
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      {notifications}
                    </motion.span>
                  )}
                </motion.button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {mockNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                  {notification.title}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                                  {notification.time}
                                </p>
                              </div>
                              {notification.unread && (
                                <div className="h-2 w-2 bg-blue-600 rounded-full mt-1" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="secondary" size="sm" className="w-full">
                          View All Notifications
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0)}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name}
                </span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
                icon={<LogOut className="h-4 w-4" />}
                aria-label="Sign out"
              >
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </>
  );
}