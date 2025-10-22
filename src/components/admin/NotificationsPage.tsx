import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X,
  Eye,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { format, parseISO } from 'date-fns';
import { clsx } from 'clsx';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  userId?: string;
  userName?: string;
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif_001',
      title: 'Payment Confirmed',
      message: 'Alice Smith\'s tuition payment of 2.5 ETH has been confirmed on the blockchain.',
      type: 'success',
      read: false,
      createdAt: '2024-01-22T10:35:00Z',
      userId: 'user_001',
      userName: 'Alice Smith'
    },
    {
      id: 'notif_002',
      title: 'New User Registration',
      message: 'John Doe has registered as a new student and requires verification.',
      type: 'info',
      read: false,
      createdAt: '2024-01-22T09:20:00Z',
      userId: 'user_002',
      userName: 'John Doe'
    },
    {
      id: 'notif_003',
      title: 'Transaction Failed',
      message: 'Payment attempt by Emma Davis failed due to insufficient gas fees.',
      type: 'error',
      read: true,
      createdAt: '2024-01-22T08:15:00Z',
      userId: 'user_003',
      userName: 'Emma Davis'
    },
    {
      id: 'notif_004',
      title: 'High Gas Fees Alert',
      message: 'Current network gas fees are unusually high. Consider advising users to wait.',
      type: 'warning',
      read: false,
      createdAt: '2024-01-22T07:45:00Z'
    },
    {
      id: 'notif_005',
      title: 'Receipt Uploaded',
      message: 'Alice Smith uploaded a new receipt for transaction tx_001.',
      type: 'info',
      read: true,
      createdAt: '2024-01-21T16:30:00Z',
      userId: 'user_001',
      userName: 'Alice Smith'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'read' && notification.read) ||
      (statusFilter === 'unread' && !notification.read);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">All Notifications</h1>
            <p className="text-indigo-100">
              Manage system notifications and user activity alerts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="h-8 w-8" />
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                {filteredNotifications.length} notifications
                {unreadCount > 0 && ` • ${unreadCount} unread`}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark All Read
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">
              Notifications ({filteredNotifications.length})
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className={clsx(
                      'border-l-4 rounded-lg p-4 transition-all duration-200',
                      getTypeColor(notification.type),
                      !notification.read && 'shadow-md',
                      notification.read && 'opacity-75'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className={clsx(
                              'font-medium',
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            )}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                          </div>
                          
                          <p className="text-gray-600 mt-1 text-sm">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>
                              {format(parseISO(notification.createdAt), 'MMM d, yyyy HH:mm')}
                            </span>
                            {notification.userName && (
                              <span>• {notification.userName}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            icon={<Eye className="h-3 w-3" />}
                            className="p-2"
                          />
                        )}
                        
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          icon={<Trash2 className="h-3 w-3" />}
                          className="p-2"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredNotifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No notifications found</h3>
                  <p className="text-gray-400">
                    {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'All caught up! No new notifications.'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}