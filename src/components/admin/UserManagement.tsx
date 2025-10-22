import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  UserPlus, 
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  Mail,
  Calendar,
  Wallet,
  Download,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';
import { User } from '../../types';
import { mockUsers } from '../../services/mockData';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    ...mockUsers,
    {
      id: 'user_002',
      email: 'bob.wilson@university.edu',
      role: 'student',
      name: 'Bob Wilson',
      studentId: 'STU2024002',
      walletAddress: '0x8f7e6d5c4b3a2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7',
      createdAt: '2024-01-10T09:30:00Z',
      isVerified: true,
      twoFactorEnabled: false
    },
    {
      id: 'user_003',
      email: 'emma.davis@university.edu',
      role: 'student',
      name: 'Emma Davis',
      studentId: 'STU2024003',
      createdAt: '2024-01-08T14:15:00Z',
      isVerified: false,
      twoFactorEnabled: false
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<'edit' | 'create' | 'delete'>('create');
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'student' as 'student' | 'admin',
    studentId: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'verified' && user.isVerified) ||
      (statusFilter === 'unverified' && !user.isVerified);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId || ''
    });
    setModalType('edit');
    setShowModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setModalType('delete');
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (!selectedUser) return;
    
    setUsers(users.filter(u => u.id !== selectedUser.id));
    toast.success('User deleted successfully');
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSaveUser = () => {
    if (modalType === 'edit' && selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...editFormData }
          : user
      ));
      toast.success('User updated successfully');
    } else if (modalType === 'create') {
      const newUser: User = {
        id: `user_${Date.now()}`,
        ...editFormData,
        createdAt: new Date().toISOString(),
        isVerified: false,
        twoFactorEnabled: false
      };
      setUsers([...users, newUser]);
      toast.success('User created successfully');
    }
    
    setShowModal(false);
    setSelectedUser(null);
    setEditFormData({ name: '', email: '', role: 'student', studentId: '' });
  };

  const exportUsers = (format: 'csv' | 'pdf') => {
    const exportData = filteredUsers.map(user => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      'Student ID': user.studentId || 'N/A',
      Verified: user.isVerified ? 'Yes' : 'No',
      '2FA Enabled': user.twoFactorEnabled ? 'Yes' : 'No',
      'Created Date': format(parseISO(user.createdAt), 'yyyy-MM-dd'),
      'Wallet Address': user.walletAddress ? `${user.walletAddress.slice(0, 20)}...` : 'None'
    }));

    if (format === 'csv') {
      exportToCSV(exportData, 'users');
    } else {
      exportToPDF(exportData, 'users', 'User Management Report');
    }
    
    toast.success(`Exported ${exportData.length} users as ${format.toUpperCase()}`);
  };

  const toggleVerification = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isVerified: !user.isVerified }
        : user
    ));
    toast.success('User verification status updated');
  };

  const toggle2FA = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, twoFactorEnabled: !user.twoFactorEnabled }
        : user
    ));
    toast.success('2FA status updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">User Management</h1>
        <p className="text-purple-100">
          Manage student accounts, verification status, and security settings
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.length}
                  </p>
                </div>
                <UserPlus className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.isVerified).length}
                  </p>
                </div>
                <ShieldCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {users.filter(u => u.role === 'student').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">With 2FA</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {users.filter(u => u.twoFactorEnabled).length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="admin">Admins</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            <div className="flex justify-end mt-4">
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setSelectedUser(null);
                    setEditFormData({ name: '', email: '', role: 'student', studentId: '' });
                    setModalType('create');
                    setShowModal(true);
                  }}
                  icon={<UserPlus className="h-4 w-4" />}
                >
                  Add User
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => exportUsers('csv')}
                  icon={<Download className="h-4 w-4" />}
                >
                  CSV
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => exportUsers('pdf')}
                  icon={<FileText className="h-4 w-4" />}
                >
                  PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">
              Users ({filteredUsers.length})
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        {user.isVerified && (
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                        )}
                        {user.twoFactorEnabled && (
                          <Shield className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </span>
                        {user.studentId && (
                          <span>ID: {user.studentId}</span>
                        )}
                        <span className="capitalize">{user.role}</span>
                      </div>
                      {user.walletAddress && (
                        <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1">
                          <Wallet className="h-3 w-3" />
                          <span className="font-mono">{user.walletAddress.slice(0, 20)}...</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {format(parseISO(user.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant={user.isVerified ? 'warning' : 'success'}
                      size="sm"
                      onClick={() => toggleVerification(user.id)}
                      icon={user.isVerified ? <Shield className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                    >
                      {user.isVerified ? 'Unverify' : 'Verify'}
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toggle2FA(user.id)}
                    >
                      {user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                      icon={<Edit className="h-3 w-3" />}
                    />
                    
                    {user.role !== 'admin' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        icon={<Trash2 className="h-3 w-3" />}
                      />
                    )}
                  </div>
                </motion.div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <UserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No users found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Action Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === 'delete' ? 'Delete User' : modalType === 'edit' ? 'Edit User' : 'Create User'}
      >
        {modalType === 'delete' && selectedUser ? (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-900">Delete User Account</h3>
                  <p className="text-sm text-red-800 mt-1">
                    Are you sure you want to delete {selectedUser.name}? This action cannot be undone.
                    All associated transactions and data will be preserved for audit purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
              >
                Delete User
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as 'student' | 'admin' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              
              {editFormData.role === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={editFormData.studentId}
                    onChange={(e) => setEditFormData({ ...editFormData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter student ID"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveUser}
                disabled={!editFormData.name || !editFormData.email}
              >
                {modalType === 'edit' ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}