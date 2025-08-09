import React from 'react';
import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const MetricCard = ({ title, value, change, changeType, icon: Icon, color, description }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center space-x-1">
          {changeType === 'positive' ? (
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
          )}
          <span
            className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change}
          </span>
        </div>
      </div>

      <div className="mb-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>

      <p className="text-xs text-gray-500">{description}</p>
    </motion.div>
  );
};

export default MetricCard; 