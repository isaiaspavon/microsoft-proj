import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Cog6ToothIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    teams: true,
    critical: true,
    warning: true,
    info: false,
  });

  const [display, setDisplay] = useState({
    theme: 'light',
    refreshInterval: 30,
    showAnimations: true,
    compactMode: false,
  });

  const [integrations, setIntegrations] = useState({
    azureMonitor: true,
    applicationInsights: true,
    logAnalytics: false,
    eventHub: false,
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('cloudinsight-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setNotifications(parsed.notifications || notifications);
      setDisplay(parsed.display || display);
      setIntegrations(parsed.integrations || integrations);
    }
  }, [notifications, display, integrations]);

  const handleSaveSettings = () => {
    const settings = {
      notifications,
      display,
      integrations,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('cloudinsight-settings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(true);
    toast.success('Two-factor authentication enabled!');
  };

  const handleGenerateApiKey = () => {
    const newApiKey = 'ci_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    setApiKey(newApiKey);
    toast.success('API key generated successfully!');
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDisplayChange = (key, value) => {
    setDisplay(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleIntegrationChange = (key) => {
    setIntegrations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              Configure your CloudInsight dashboard preferences
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <BellIcon className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Channels</h4>
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Email Notifications' },
                  { key: 'slack', label: 'Slack Integration' },
                  { key: 'teams', label: 'Microsoft Teams' },
                ].map(item => (
                  <label key={item.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={() => handleNotificationChange(item.key)}
                      className="rounded border-gray-300 text-azure-600 focus:ring-azure-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Severity Levels</h4>
              <div className="space-y-3">
                {[
                  { key: 'critical', label: 'Critical Incidents' },
                  { key: 'warning', label: 'Warning Alerts' },
                  { key: 'info', label: 'Information Updates' },
                ].map(item => (
                  <label key={item.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={() => handleNotificationChange(item.key)}
                      className="rounded border-gray-300 text-azure-600 focus:ring-azure-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Display Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Display</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={display.theme}
                onChange={(e) => handleDisplayChange('theme', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure-500 focus:border-azure-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refresh Interval (seconds)
              </label>
              <select
                value={display.refreshInterval}
                onChange={(e) => handleDisplayChange('refreshInterval', parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure-500 focus:border-azure-500"
              >
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={display.showAnimations}
                  onChange={() => handleDisplayChange('showAnimations', !display.showAnimations)}
                  className="rounded border-gray-300 text-azure-600 focus:ring-azure-500"
                />
                <span className="ml-3 text-sm text-gray-700">Show Animations</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={display.compactMode}
                  onChange={() => handleDisplayChange('compactMode', !display.compactMode)}
                  className="rounded border-gray-300 text-azure-600 focus:ring-azure-500"
                />
                <span className="ml-3 text-sm text-gray-700">Compact Mode</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <GlobeAltIcon className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Azure Integrations</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { key: 'azureMonitor', label: 'Azure Monitor', description: 'Real-time metrics and alerts' },
              { key: 'applicationInsights', label: 'Application Insights', description: 'Application performance monitoring' },
              { key: 'logAnalytics', label: 'Log Analytics', description: 'Centralized log management' },
              { key: 'eventHub', label: 'Event Hub', description: 'Real-time data streaming' },
            ].map(item => (
              <div key={item.key} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={integrations[item.key]}
                  onChange={() => handleIntegrationChange(item.key)}
                  className="mt-1 rounded border-gray-300 text-azure-600 focus:ring-azure-500"
                />
                <div>
                  <label className="text-sm font-medium text-gray-700">{item.label}</label>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <ShieldCheckIcon className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure-500 focus:border-azure-500">
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={480}>8 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Two-Factor Authentication
              </label>
              <div className="flex items-center space-x-4">
                {!twoFactorEnabled ? (
                  <>
                    <button 
                      onClick={handleEnable2FA}
                      className="px-4 py-2 bg-azure-600 text-white rounded-lg hover:bg-azure-700 transition-colors"
                    >
                      Enable
                    </button>
                    <span className="text-sm text-gray-500">Currently disabled</span>
                  </>
                ) : (
                  <>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      Enabled
                    </span>
                    <span className="text-sm text-gray-500">Two-factor authentication is active</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Access
              </label>
              <div className="flex items-center space-x-4">
                {!apiKey ? (
                  <>
                    <button 
                      onClick={handleGenerateApiKey}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Generate Key
                    </button>
                    <span className="text-sm text-gray-500">No active API keys</span>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={apiKey}
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <span className="text-sm text-green-600 font-medium">Active</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <button 
          onClick={handleSaveSettings}
          className="px-6 py-3 bg-azure-600 text-white rounded-lg hover:bg-azure-700 transition-colors font-medium"
        >
          Save Settings
        </button>
      </motion.div>
    </div>
  );
};

export default Settings; 