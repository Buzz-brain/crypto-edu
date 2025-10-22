import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LandingPage } from './components/landing/LandingPage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PaymentHistory } from './components/student/PaymentHistory';
import { ReceiptUpload } from './components/student/ReceiptUpload';
import { MakePayment } from './components/student/MakePayment';
import { TransactionManagement } from './components/admin/TransactionManagement';
import { UserManagement } from './components/admin/UserManagement';
import { NotificationsPage } from './components/admin/NotificationsPage';
import { PaymentSimulator } from './components/simulator/PaymentSimulator';
import { Settings } from './components/settings/Settings';
import { StyleGuide } from './components/dev/StyleGuide';
import { HelpCenter } from './components/help/HelpCenter';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { useNetwork } from './hooks/useNetwork';

function OfflineBanner() {
  const { isOnline } = useNetwork();
  
  if (isOnline) return null;

  return (
    <div className="bg-amber-500 text-white text-center py-2 text-sm font-medium">
      You are currently offline. Some features may be limited.
    </div>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showAuth === 'login') {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <LoginForm onSwitchToRegister={() => setShowAuth('register')} />
        </div>
      );
    }
    
    if (showAuth === 'register') {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <RegisterForm onSwitchToLogin={() => setShowAuth('login')} />
        </div>
      );
    }
    
    return <LandingPage onGetStarted={() => setShowAuth('login')} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return user.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />;
      case 'make-payment':
        return <MakePayment />;
      case 'history':
        return <PaymentHistory />;
      case 'receipts':
        return <ReceiptUpload />;
      case 'transactions':
        return <TransactionManagement />;
      case 'users':
        return <UserManagement />;
      case 'notifications':
        return <NotificationsPage />;
      case 'simulator':
        return <PaymentSimulator />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <HelpCenter />;
      case 'style-guide':
        return <StyleGuide />;
      default:
        return user.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <OfflineBanner />
      <Header />
      <div className="flex">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1 p-6 max-w-7xl">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
            },
            success: {
              style: {
                background: '#059669',
              },
            },
            error: {
              style: {
                background: '#DC2626',
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;