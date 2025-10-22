import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  PlayCircle, 
  PauseCircle 
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { blockchainService } from '../../services/blockchainService';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

export function PaymentSimulator() {
  const [config, setConfig] = useState(blockchainService.getSimulationConfig());
  const [isRunning, setIsRunning] = useState(false);

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    blockchainService.updateSimulationConfig(newConfig);
  };

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Payment Simulator</h1>
        <p className="text-purple-100">
          Control blockchain behavior for demonstration and testing purposes
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Network Configuration</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmation Speed
                </label>
                <select
                  value={config.confirmationSpeed}
                  onChange={(e) => handleConfigChange('confirmationSpeed', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fast">Fast (2s per confirmation)</option>
                  <option value="normal">Normal (5s per confirmation)</option>
                  <option value="slow">Slow (10s per confirmation)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gas Price Multiplier: {config.gasMultiplier}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={config.gasMultiplier}
                  onChange={(e) => handleConfigChange('gasMultiplier', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5x</span>
                  <span>3x</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Failure Rate: {Math.round(config.failureRate * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.2"
                  step="0.01"
                  value={config.failureRate}
                  onChange={(e) => handleConfigChange('failureRate', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>20%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Price Volatility
                </span>
                <button
                  onClick={() => handleConfigChange('volatilityEnabled', !config.volatilityEnabled)}
                  className={clsx(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    config.volatilityEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      config.volatilityEnabled ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Simulation Controls */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <h2 className="text-lg font-semibold">Simulation Control</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Button
                  onClick={toggleSimulation}
                  size="lg"
                  variant={isRunning ? 'danger' : 'success'}
                  icon={isRunning ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
                  className="w-full"
                >
                  {isRunning ? 'Stop Simulation' : 'Start Simulation'}
                </Button>
                
                <p className="text-sm text-gray-600 mt-2">
                  {isRunning 
                    ? 'Simulation is active - payments will process with configured settings'
                    : 'Simulation is paused - configure settings and start simulation'
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98.7%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">4.2s</div>
                  <div className="text-sm text-gray-600">Avg Confirmation</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full"
                  icon={<TrendingUp className="h-4 w-4" />}
                >
                  Simulate Gas Spike
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  icon={<AlertTriangle className="h-4 w-4" />}
                >
                  Trigger Network Congestion
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Demo Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-amber-50 border border-amber-200 rounded-lg p-4"
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900">Demo Mode Active</h3>
            <p className="text-sm text-amber-800 mt-1">
              This simulator controls the behavior of all payment flows in the application. 
              Real blockchain integration can be enabled by replacing the mock services with actual Web3 providers.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}