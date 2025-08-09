import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

const IncidentList = ({ incidents = [], limit }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'warning':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'investigating':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'mitigated':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const displayIncidents = limit ? incidents.slice(0, limit) : incidents;

  if (displayIncidents.length === 0) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">No active incidents</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayIncidents.map((incident, index) => (
        <motion.div
          key={incident.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </span>
              </div>
              
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {incident.title}
              </h4>
              
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {incident.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-3 h-3" />
                <span>{moment(incident.createdAt).fromNow()}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <UserGroupIcon className="w-3 h-3" />
                <span>{incident.affectedUsers?.toLocaleString() || 0} users</span>
              </div>
            </div>
            
            <div className="text-xs">
              <span className="font-medium">{incident.region}</span>
              <span className="mx-1">•</span>
              <span>{incident.service}</span>
            </div>
          </div>
        </motion.div>
      ))}
      
      {limit && incidents.length > limit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center pt-2"
        >
          <button className="text-sm text-azure-600 hover:text-azure-700 font-medium">
            View {incidents.length - limit} more incidents
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default IncidentList; 