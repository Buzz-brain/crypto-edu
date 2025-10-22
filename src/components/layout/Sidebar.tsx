import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  CreditCard, 
  History, 
  Upload, 
  Settings, 
  Users,
  BarChart3,
  FileText,
  Shield,
  HelpCircle,
  Bell,
  Palette
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const studentMenuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Home },
    { id: 'make-payment', label: 'Make Payment', icon: CreditCard },
    { id: 'history', label: 'Transaction History', icon: History },
    { id: 'receipts', label: 'Upload Receipts', icon: Upload },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
    { id: 'settings', label: t('settings'), icon: Settings }
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Home },
    { id: 'transactions', label: 'Transaction Management', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    // { id: 'simulator', label: 'Payment Simulator', icon: Shield },
    { id: 'notifications', label: 'All Notifications', icon: Bell },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
    // { id: 'style-guide', label: 'Style Guide', icon: Palette },
    { id: 'settings', label: t('settings'), icon: Settings }
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : studentMenuItems;

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-white border-r border-gray-200 h-screen sticky top-16 overflow-y-auto"
    >
      <nav className="mt-8 px-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPageChange(item.id)}
              className={cn(
                'w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200',
                isActive 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
              aria-label={`Navigate to ${item.label}`}
            >
              <Icon className={cn('h-5 w-5', isActive ? 'text-blue-600' : 'text-gray-400')} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute right-2 w-1 h-6 bg-blue-600 rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-xs text-gray-500 text-center">
          <p>CryptoEdu v2.0</p>
          <p>Demo Mode Active</p>
        </div>
      </div>
    </motion.aside>
  );
}