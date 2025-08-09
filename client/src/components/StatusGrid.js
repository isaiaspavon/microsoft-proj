import React from 'react';
import { motion } from 'framer-motion';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const StatusGrid = ({ regions = [] }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-700';
      case 'degraded':
        return 'text-yellow-700';
      case 'critical':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50';
      case 'degraded':
        return 'bg-yellow-50';
      case 'critical':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {regions.map((region, index) => (
        <motion.div
          key={region.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`${getStatusBg(region.status)} rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">{region.name}</span>
            </div>
            <div className={`w-2 h-2 ${getStatusColor(region.status)} rounded-full`}></div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Status</span>
              <span className={`text-xs font-medium capitalize ${getStatusText(region.status)}`}>
                {region.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Latency</span>
              <span className="text-xs font-medium text-gray-900">{region.latency}ms</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatusGrid; 