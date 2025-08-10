import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  BellIcon, 
  WifiIcon, 
  ExclamationTriangleIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useDashboard } from '../context/DashboardContext';
import { useSocket } from '../hooks/useSocket';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const { globalMetrics, realTimeUpdates, toggleRealTime } = useDashboard();
  const socket = useSocket();

  const getConnectionStatus = () => {
    if (!socket) return { status: 'disconnected', color: 'text-red-500' };
    if (socket.connected) return { status: 'connected', color: 'text-green-500' };
    return { status: 'connecting', color: 'text-yellow-500' };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>

          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-azure-500 to-azure-600 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">CloudInsight</h1>
              <p className="text-sm text-gray-500">Azure Reliability Dashboard</p>
            </div>
          </div>
        </div>

        {/* Center - Status indicators */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Global uptime */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {globalMetrics?.uptime || 99.98}% Uptime
            </span>
          </div>

          {/* Active incidents */}
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              {globalMetrics?.activeIncidents || 0} Active Incidents
            </span>
          </div>

          {/* Connection status */}
          <div className="flex items-center space-x-2">
            <WifiIcon className={`w-4 h-4 ${connectionStatus.color}`} />
            <span className="text-sm font-medium text-gray-700 capitalize">
              {connectionStatus.status}
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Real-time toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleRealTime}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              realTimeUpdates
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {realTimeUpdates ? 'Live' : 'Paused'}
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <BellIcon className="w-6 h-6 text-gray-600" />
              {globalMetrics?.activeIncidents > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {globalMetrics.activeIncidents}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Alerts</h3>
                  {globalMetrics?.activeIncidents > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                        <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">High CPU usage detected</p>
                          <p className="text-xs text-gray-500">East US region • 2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No active alerts</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Settings */}
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
          </button>

          {/* User profile */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <UserCircleIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 