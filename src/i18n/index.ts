import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.makePayment': 'Make Payment',
      'nav.history': 'Transaction History',
      'nav.receipts': 'Upload Receipts',
      'nav.help': 'Help Center',
      'nav.settings': 'Settings',
      'nav.logout': 'Sign Out',
      'nav.transactions': 'Transaction Management',
      'nav.users': 'User Management',
      'nav.simulator': 'Payment Simulator',
      'nav.notifications': 'All Notifications',
      'nav.styleGuide': 'Style Guide',

      // Authentication
      'auth.welcomeBack': 'Welcome Back',
      'auth.signIn': 'Sign In',
      'auth.signUp': 'Sign Up',
      'auth.createAccount': 'Create Account',
      'auth.email': 'Email Address',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.fullName': 'Full Name',
      'auth.studentId': 'Student ID',
      'auth.forgotPassword': 'Forgot Password?',
      'auth.dontHaveAccount': "Don't have an account?",
      'auth.alreadyHaveAccount': 'Already have an account?',
      'auth.registerHere': 'Register here',
      'auth.signInHere': 'Sign in here',
      'auth.connectWallet': 'Connect with MetaMask',
      'auth.agreeToTerms': 'I agree to the Terms of Service and Privacy Policy',

      // Common
      'common.loading': 'Loading...',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.view': 'View',
      'common.download': 'Download',
      'common.export': 'Export',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.next': 'Next',
      'common.back': 'Back',
      'common.confirm': 'Confirm',
      'common.close': 'Close',

      // Dashboard
      'dashboard.welcomeBack': 'Welcome back, {{name}}!',
      'dashboard.currentBalance': 'Current Balance',
      'dashboard.pendingPayments': 'Pending Payments',
      'dashboard.thisMonth': 'This Month',
      'dashboard.quickActions': 'Quick Actions',
      'dashboard.recentTransactions': 'Recent Transactions',

      // Payments
      'payment.makePayment': 'Make Payment',
      'payment.selectCurrency': 'Select Cryptocurrency',
      'payment.paymentDetails': 'Payment Details',
      'payment.connectWallet': 'Connect Wallet',
      'payment.confirmPayment': 'Confirm Payment',
      'payment.paymentPending': 'Payment Pending',
      'payment.paymentConfirmed': 'Payment Confirmed!',
      'payment.paymentFailed': 'Payment Failed',

      // Receipts
      'receipt.uploadReceipt': 'Upload Receipt',
      'receipt.uploadedReceipts': 'Uploaded Receipts',
      'receipt.dragDrop': 'Drag & drop your receipt file here, or click to browse',
      'receipt.supportedFormats': 'Supports: PDF, PNG, JPG (Max 5MB)',

      // Settings
      'settings.profile': 'Profile Information',
      'settings.security': 'Security',
      'settings.preferences': 'Preferences',
      'settings.notifications': 'Notifications',
      'settings.language': 'Language',
      'settings.theme': 'Theme',
      'settings.changePassword': 'Change Password',
      'settings.twoFactor': 'Two-Factor Authentication',

      // Admin
      'admin.userManagement': 'User Management',
      'admin.transactionManagement': 'Transaction Management',
      'admin.totalUsers': 'Total Users',
      'admin.verified': 'Verified',
      'admin.students': 'Students',
      'admin.with2FA': 'With 2FA',
      'admin.addUser': 'Add User',
      'admin.editUser': 'Edit User',
      'admin.deleteUser': 'Delete User',

      // Notifications
      'notification.paymentConfirmed': 'Payment Confirmed',
      'notification.receiptUploaded': 'Receipt Uploaded',
      'notification.walletConnected': 'Wallet Connected',
      'notification.exportSuccess': 'Export completed successfully',
      'notification.themeChanged': 'Theme updated',
      'notification.languageChanged': 'Language updated',
    }
  },
  fr: {
    translation: {
      // Navigation
      'nav.dashboard': 'Tableau de bord',
      'nav.makePayment': 'Effectuer un paiement',
      'nav.history': 'Historique des transactions',
      'nav.receipts': 'Télécharger des reçus',
      'nav.help': 'Centre d\'aide',
      'nav.settings': 'Paramètres',
      'nav.logout': 'Se déconnecter',
      'nav.transactions': 'Gestion des transactions',
      'nav.users': 'Gestion des utilisateurs',
      'nav.simulator': 'Simulateur de paiement',
      'nav.notifications': 'Toutes les notifications',
      'nav.styleGuide': 'Guide de style',

      // Authentication
      'auth.welcomeBack': 'Bon retour',
      'auth.signIn': 'Se connecter',
      'auth.signUp': 'S\'inscrire',
      'auth.createAccount': 'Créer un compte',
      'auth.email': 'Adresse e-mail',
      'auth.password': 'Mot de passe',
      'auth.confirmPassword': 'Confirmer le mot de passe',
      'auth.fullName': 'Nom complet',
      'auth.studentId': 'ID étudiant',
      'auth.forgotPassword': 'Mot de passe oublié?',
      'auth.dontHaveAccount': 'Vous n\'avez pas de compte?',
      'auth.alreadyHaveAccount': 'Vous avez déjà un compte?',
      'auth.registerHere': 'Inscrivez-vous ici',
      'auth.signInHere': 'Connectez-vous ici',
      'auth.connectWallet': 'Se connecter avec MetaMask',
      'auth.agreeToTerms': 'J\'accepte les conditions d\'utilisation et la politique de confidentialité',

      // Common
      'common.loading': 'Chargement...',
      'common.save': 'Enregistrer',
      'common.cancel': 'Annuler',
      'common.delete': 'Supprimer',
      'common.edit': 'Modifier',
      'common.view': 'Voir',
      'common.download': 'Télécharger',
      'common.export': 'Exporter',
      'common.search': 'Rechercher',
      'common.filter': 'Filtrer',
      'common.next': 'Suivant',
      'common.back': 'Retour',
      'common.confirm': 'Confirmer',
      'common.close': 'Fermer',

      // Dashboard
      'dashboard.welcomeBack': 'Bon retour, {{name}}!',
      'dashboard.currentBalance': 'Solde actuel',
      'dashboard.pendingPayments': 'Paiements en attente',
      'dashboard.thisMonth': 'Ce mois-ci',
      'dashboard.quickActions': 'Actions rapides',
      'dashboard.recentTransactions': 'Transactions récentes',

      // Payments
      'payment.makePayment': 'Effectuer un paiement',
      'payment.selectCurrency': 'Sélectionner la cryptomonnaie',
      'payment.paymentDetails': 'Détails du paiement',
      'payment.connectWallet': 'Connecter le portefeuille',
      'payment.confirmPayment': 'Confirmer le paiement',
      'payment.paymentPending': 'Paiement en attente',
      'payment.paymentConfirmed': 'Paiement confirmé!',
      'payment.paymentFailed': 'Échec du paiement',

      // Receipts
      'receipt.uploadReceipt': 'Télécharger un reçu',
      'receipt.uploadedReceipts': 'Reçus téléchargés',
      'receipt.dragDrop': 'Glissez-déposez votre fichier de reçu ici, ou cliquez pour parcourir',
      'receipt.supportedFormats': 'Formats supportés: PDF, PNG, JPG (Max 5MB)',

      // Settings
      'settings.profile': 'Informations du profil',
      'settings.security': 'Sécurité',
      'settings.preferences': 'Préférences',
      'settings.notifications': 'Notifications',
      'settings.language': 'Langue',
      'settings.theme': 'Thème',
      'settings.changePassword': 'Changer le mot de passe',
      'settings.twoFactor': 'Authentification à deux facteurs',

      // Admin
      'admin.userManagement': 'Gestion des utilisateurs',
      'admin.transactionManagement': 'Gestion des transactions',
      'admin.totalUsers': 'Total des utilisateurs',
      'admin.verified': 'Vérifiés',
      'admin.students': 'Étudiants',
      'admin.with2FA': 'Avec 2FA',
      'admin.addUser': 'Ajouter un utilisateur',
      'admin.editUser': 'Modifier l\'utilisateur',
      'admin.deleteUser': 'Supprimer l\'utilisateur',

      // Notifications
      'notification.paymentConfirmed': 'Paiement confirmé',
      'notification.receiptUploaded': 'Reçu téléchargé',
      'notification.walletConnected': 'Portefeuille connecté',
      'notification.exportSuccess': 'Exportation terminée avec succès',
      'notification.themeChanged': 'Thème mis à jour',
      'notification.languageChanged': 'Langue mise à jour',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;