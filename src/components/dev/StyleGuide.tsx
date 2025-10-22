import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Layout, Zap } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export function StyleGuide() {
  const [activeTab, setActiveTab] = useState('colors');

  const colorRamps = {
    primary: ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'],
    secondary: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534'],
    accent: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412'],
    success: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534'],
    warning: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'],
    error: ['#fef2f2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d']
  };

  const typography = [
    { name: 'Heading 1', class: 'text-4xl font-bold', sample: 'The quick brown fox' },
    { name: 'Heading 2', class: 'text-3xl font-bold', sample: 'The quick brown fox' },
    { name: 'Heading 3', class: 'text-2xl font-semibold', sample: 'The quick brown fox' },
    { name: 'Heading 4', class: 'text-xl font-semibold', sample: 'The quick brown fox' },
    { name: 'Body Large', class: 'text-lg font-normal', sample: 'The quick brown fox jumps over the lazy dog' },
    { name: 'Body', class: 'text-base font-normal', sample: 'The quick brown fox jumps over the lazy dog' },
    { name: 'Body Small', class: 'text-sm font-normal', sample: 'The quick brown fox jumps over the lazy dog' },
    { name: 'Caption', class: 'text-xs font-normal', sample: 'The quick brown fox jumps over the lazy dog' }
  ];

  const spacing = [8, 16, 24, 32, 48, 64, 96, 128];

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'spacing', label: 'Spacing', icon: Layout },
    { id: 'components', label: 'Components', icon: Zap }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Design System & Style Guide</h1>
        <p className="text-pink-100">
          Complete design tokens and component library for CryptoEdu
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'colors' && (
          <div className="space-y-6">
            {Object.entries(colorRamps).map(([name, colors]) => (
              <Card key={name}>
                <CardHeader>
                  <h3 className="text-lg font-semibold capitalize">{name} Colors</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 overflow-x-auto">
                    {colors.map((color, index) => (
                      <motion.div
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        className="flex-shrink-0 text-center"
                      >
                        <div
                          className="w-16 h-16 rounded-lg shadow-sm border cursor-pointer"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            navigator.clipboard.writeText(color);
                            toast.success(`Copied ${color}`);
                          }}
                        />
                        <div className="mt-2 text-xs font-mono">{color}</div>
                        <div className="text-xs text-gray-500">{(index + 1) * 100}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'typography' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Typography Scale</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {typography.map((type) => (
                  <div key={type.name}>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">{type.name}</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{type.class}</code>
                    </div>
                    <p className={type.class}>{type.sample}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'spacing' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Spacing System (8px base)</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spacing.map((size) => (
                  <div key={size} className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-mono text-gray-600">
                      {size}px
                    </div>
                    <div
                      className="bg-blue-200 h-4"
                      style={{ width: `${size}px` }}
                    />
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      p-{size / 4}
                    </code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'components' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Button Variants</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Button Sizes</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
}