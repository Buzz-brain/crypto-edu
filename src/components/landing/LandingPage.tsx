import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Globe, 
  Lock,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Users,
  TrendingUp,
  Award,
  Smartphone,
  CreditCard,
  BookOpen
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Shield,
      title: 'Secure Blockchain Payments',
      description: 'All transactions are recorded on immutable blockchain ledgers with full transparency and cryptographic security'
    },
    {
      icon: Zap,
      title: 'Instant Settlements',
      description: 'Payments are processed in real-time with automatic confirmation tracking and immediate receipt generation'
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Pay from anywhere in the world with supported cryptocurrencies, no geographical restrictions'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Multi-signature wallets, smart contract audited payment flows, and institutional-grade security'
    }
  ];

  const steps = [
    { 
      step: 1, 
      title: 'Connect Your Wallet', 
      description: 'Link your MetaMask or other supported wallet securely',
      icon: Smartphone
    },
    { 
      step: 2, 
      title: 'Select Payment', 
      description: 'Choose tuition, fees, or other institutional charges',
      icon: CreditCard
    },
    { 
      step: 3, 
      title: 'Confirm Transaction', 
      description: 'Review details and complete payment on blockchain',
      icon: CheckCircle
    },
    { 
      step: 4, 
      title: 'Receive Confirmation', 
      description: 'Get instant receipt and IPFS-stored proof',
      icon: Award
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Computer Science Student',
      university: 'MIT',
      content: 'The crypto payment system made paying tuition from overseas so much easier! No more international wire fees.',
      rating: 5,
      avatar: '👩‍💻'
    },
    {
      name: 'Dr. Michael Johnson',
      role: 'Finance Director',
      university: 'Stanford University',
      content: 'Transparent, secure, and efficient. Exactly what modern institutions need for the digital age.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Emma Rodriguez',
      role: 'International Student',
      university: 'Harvard University',
      content: 'Finally, a payment system that works globally without the hassle of traditional banking.',
      rating: 5,
      avatar: '👩‍🎓'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Students Served', icon: Users },
    { value: '$2.5M+', label: 'Processed Volume', icon: TrendingUp },
    { value: '99.9%', label: 'Uptime', icon: Shield },
    { value: '150+', label: 'Universities', icon: BookOpen }
  ];

  // Floating animation variants
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '2s' }}
            className="absolute top-40 right-20 w-24 h-24 bg-yellow-400/20 rounded-full blur-lg"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '4s' }}
            className="absolute bottom-32 left-1/4 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
              >
                The Future of
                <motion.span 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500"
                >
                  Educational Payments
                </motion.span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
              >
                Pay tuition and fees securely using cryptocurrency. Transparent, fast, and globally accessible 
                with institutional-grade security.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center mb-12"
              >
                <Button
                  onClick={onGetStarted}
                  size="lg"
                  icon={<ArrowRight className="h-6 w-6" />}
                  className="bg-black text-blue-600 hover:bg-gray-50 border-none shadow-2xl px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
                >
                  Start Paying with Crypto
                </Button>
                
                {/* <Button
                  variant="secondary"
                  size="lg"
                  icon={<Play className="h-6 w-6" />}
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                >
                  Watch Demo
                </Button> */}
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-blue-200"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Bank-Level Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Educational Vector Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative"
            >
              {/* Main Illustration Container */}
              <div className="relative w-full max-w-lg mx-auto">
                {/* Background Glow */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-pink-500/30 rounded-full blur-3xl"
                />
                
                {/* Educational Scene SVG */}
                <motion.svg
                  viewBox="0 0 400 400"
                  className="w-full h-auto relative z-10"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                >
                  {/* Background Circle */}
                  <motion.circle
                    cx="200"
                    cy="200"
                    r="180"
                    fill="url(#heroGradient)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                  
                  {/* Floating Coins */}
                  <motion.g
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <circle cx="120" cy="100" r="20" fill="#FFD700" opacity="0.9" />
                    <text x="120" y="108" textAnchor="middle" fontSize="16" fill="#FFA500">₿</text>
                  </motion.g>
                  
                  <motion.g
                    animate={{ 
                      y: [0, -15, 0],
                      rotate: [0, -5, 0]
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    <circle cx="300" cy="120" r="18" fill="#627EEA" opacity="0.9" />
                    <text x="300" y="128" textAnchor="middle" fontSize="14" fill="white">Ξ</text>
                  </motion.g>
                  
                  <motion.g
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, 3, 0]
                    }}
                    transition={{ 
                      duration: 3.5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    <circle cx="80" cy="280" r="16" fill="#26A17B" opacity="0.9" />
                    <text x="80" y="287" textAnchor="middle" fontSize="12" fill="white">$</text>
                  </motion.g>

                  {/* Student Figure */}
                  <motion.g
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    {/* Body */}
                    <ellipse cx="200" cy="280" rx="25" ry="40" fill="#4F46E5" />
                    {/* Head */}
                    <circle cx="200" cy="220" r="25" fill="#FDB4A6" />
                    {/* Hair */}
                    <path d="M175 210 Q200 190 225 210 Q220 200 200 200 Q180 200 175 210" fill="#8B4513" />
                    {/* Eyes */}
                    <circle cx="192" cy="218" r="2" fill="#000" />
                    <circle cx="208" cy="218" r="2" fill="#000" />
                    {/* Smile */}
                    <path d="M190 230 Q200 235 210 230" stroke="#000" strokeWidth="1.5" fill="none" />
                    {/* Arms */}
                    <ellipse cx="170" cy="260" rx="8" ry="20" fill="#FDB4A6" transform="rotate(-20 170 260)" />
                    <ellipse cx="230" cy="260" rx="8" ry="20" fill="#FDB4A6" transform="rotate(20 230 260)" />
                    {/* Graduation Cap */}
                    <rect x="180" y="200" width="40" height="8" fill="#000" />
                    <polygon points="200,195 210,200 190,200" fill="#000" />
                    <circle cx="210" cy="198" r="3" fill="#FFD700" />
                  </motion.g>

                  {/* University Building */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  >
                    {/* Building Base */}
                    <rect x="120" y="320" width="160" height="60" fill="#E5E7EB" />
                    {/* Columns */}
                    <rect x="130" y="320" width="8" height="60" fill="#D1D5DB" />
                    <rect x="150" y="320" width="8" height="60" fill="#D1D5DB" />
                    <rect x="170" y="320" width="8" height="60" fill="#D1D5DB" />
                    <rect x="190" y="320" width="8" height="60" fill="#D1D5DB" />
                    <rect x="210" y="320" width="8" height="60" fill="#D1D5DB" />
                    <rect x="230" y="320" width="8" height="60" fill="#D1D5DB" />
                    <rect x="250" y="320" width="8" height="60" fill="#D1D5DB" />
                    {/* Roof */}
                    <polygon points="110,320 200,300 290,320" fill="#7C3AED" />
                    {/* Door */}
                    <rect x="190" y="350" width="20" height="30" fill="#8B4513" />
                  </motion.g>

                  {/* Blockchain Network Lines */}
                  <motion.g
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ delay: 1.6, duration: 2 }}
                  >
                    <path d="M120 100 Q200 150 300 120" stroke="#FFD700" strokeWidth="2" fill="none" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite" />
                    </path>
                    <path d="M80 280 Q150 200 200 220" stroke="#26A17B" strokeWidth="2" fill="none" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" values="0;-10" dur="1.2s" repeatCount="indefinite" />
                    </path>
                    <path d="M300 120 Q250 200 200 280" stroke="#627EEA" strokeWidth="2" fill="none" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" values="0;-10" dur="0.8s" repeatCount="indefinite" />
                    </path>
                  </motion.g>

                  {/* Gradient Definitions */}
                  <defs>
                    <radialGradient id="heroGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                    </radialGradient>
                  </defs>
                </motion.svg>

                {/* Floating Elements Around Illustration */}
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                >
                  🎓
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, -8, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-2 -left-6 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                >
                  💳
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute top-1/2 -right-8 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                >
                  🔒
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats Row - Moved below the main content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
                Why Choose CryptoEdu?
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built for the Future of
              <span className="text-blue-600"> Education</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the next generation of institutional payments with cutting-edge blockchain technology 
              designed specifically for educational institutions.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card interactive className="h-full group">
                  <CardContent className="p-8 text-center">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <feature.icon className="h-10 w-10 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-4">
                How It Works
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Secure, and Transparent
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with cryptocurrency payments in just four easy steps
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full relative overflow-hidden group">
                    <CardContent className="p-8 text-center relative z-10">
                      {/* Step Number */}
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                      >
                        {step.step}
                      </motion.div>
                      
                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="mb-4"
                      >
                        <step.icon className="h-8 w-8 text-blue-600 mx-auto" />
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </CardContent>
                    
                    {/* Hover Effect Background */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl"
                    />
                  </Card>
                </motion.div>
                
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <motion.div 
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
                    className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20"
                  >
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400" />
                    <ArrowRight className="h-4 w-4 text-blue-400 absolute -right-2 -top-2" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
                Testimonials
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Students & Institutions
              <span className="text-green-600"> Worldwide</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full group">
                  <CardContent className="p-8">
                    {/* Stars */}
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <p className="text-xs text-blue-600 font-medium">{testimonial.university}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              repeatType: 'reverse' 
            }}
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px'
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Revolutionize
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Your Payments?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
              Join thousands of students and institutions already using CryptoEdu 
              for secure, transparent, and efficient payments.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-black text-blue-600 hover:bg-gray-50 px-12 py-6 text-xl font-bold shadow-2xl"
                icon={<ArrowRight className="h-6 w-6" />}
              >
                Start Your Journey Today
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-blue-200 mt-6 text-sm"
            >
              No setup fees • Secure by design • 24/7 support
            </motion.p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
