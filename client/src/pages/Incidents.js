import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  FunnelIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { getMockData } from '../services/api';
import IncidentList from '../components/IncidentList';

const Incidents = () => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const mockData = getMockData();

  const filteredIncidents = mockData.incidents.filter(incident => {
    if (selectedSeverity !== 'all' && incident.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && incident.status !== selectedStatus) return false;
    if (selectedRegion !== 'all' && incident.region !== selectedRegion) return false;
    return true;
  });

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'investigating', label: 'Investigating' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'mitigated', label: 'Mitigated' },
  ];

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
    { value: 'East US', label: 'East US' },
    { value: 'West US 2', label: 'West US 2' },
    { value: 'North Europe', label: 'North Europe' },
    { value: 'Southeast Asia', label: 'Southeast Asia' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Incidents</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage service incidents across all regions
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-azure-600 text-white rounded-lg hover:bg-azure-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Report Incident</span>
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.incidents.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-orange-600">
                {mockData.incidents.filter(i => i.status === 'investigating').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">
                {mockData.incidents.filter(i => i.severity === 'critical').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Affected Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockData.incidents.reduce((sum, i) => sum + (i.affectedUsers || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <FunnelIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure-500 focus:border-azure-500"
            >
              {severityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure-500 focus:border-azure-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure-500 focus:border-azure-500"
            >
              {regionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Incidents List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Incidents</h3>
            <p className="text-sm text-gray-500">
              Showing {filteredIncidents.length} of {mockData.incidents.length} incidents
            </p>
          </div>
        </div>
        
        <IncidentList incidents={filteredIncidents} />
      </motion.div>
    </div>
  );
};

export default Incidents; 