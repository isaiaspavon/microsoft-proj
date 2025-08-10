import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GlobeAltIcon, 
  ServerIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { getMockData } from '../services/api';

const RegionalView = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('all');
  // const mockData = getMockData(); // Unused variable removed

  const regions = [
    {
      name: 'East US',
      status: 'healthy',
      uptime: 99.99,
      services: 45,
      incidents: 0,
      latency: 12,
      users: 1250000
    },
    {
      name: 'West US 2',
      status: 'healthy',
      uptime: 99.98,
      services: 42,
      incidents: 0,
      latency: 15,
      users: 980000
    },
    {
      name: 'North Europe',
      status: 'degraded',
      uptime: 99.85,
      services: 38,
      incidents: 1,
      latency: 25,
      users: 750000
    },
    {
      name: 'Southeast Asia',
      status: 'critical',
      uptime: 98.5,
      services: 35,
      incidents: 2,
      latency: 45,
      users: 650000
    },
    {
      name: 'Central US',
      status: 'healthy',
      uptime: 99.97,
      services: 40,
      incidents: 0,
      latency: 18,
      users: 850000
    },
    {
      name: 'West Europe',
      status: 'healthy',
      uptime: 99.96,
      services: 41,
      incidents: 0,
      latency: 22,
      users: 920000
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy': return 'Healthy';
      case 'degraded': return 'Degraded';
      case 'critical': return 'Critical';
      default: return 'Unknown';
    }
  };

  const filteredRegions = selectedRegion === 'all' 
    ? regions 
    : regions.filter(region => region.status === selectedRegion);

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
            <h1 className="text-3xl font-bold text-gray-900">Regional Overview</h1>
            <p className="text-gray-600 mt-1">
              Detailed status of Azure services across all regions
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <GlobeAltIcon className="w-6 h-6 text-azure-600" />
          <span className="text-sm font-medium text-gray-600">
            {regions.length} Regions
          </span>
        </div>
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
              <p className="text-sm font-medium text-gray-600">Healthy Regions</p>
              <p className="text-2xl font-bold text-green-600">
                {regions.filter(r => r.status === 'healthy').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Degraded Regions</p>
              <p className="text-2xl font-bold text-yellow-600">
                {regions.filter(r => r.status === 'degraded').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Regions</p>
              <p className="text-2xl font-bold text-red-600">
                {regions.filter(r => r.status === 'critical').length}
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
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">
                {regions.reduce((sum, r) => sum + r.services, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ServerIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure-500 focus:border-azure-500"
          >
            <option value="all">All Statuses</option>
            <option value="healthy">Healthy</option>
            <option value="degraded">Degraded</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </motion.div>

      {/* Regions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredRegions.map((region, index) => (
          <motion.div
            key={region.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              // Could navigate to detailed region view
              console.log(`Viewing details for ${region.name}`);
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{region.name}</h3>
              <div className={`w-3 h-3 ${getStatusColor(region.status)} rounded-full`}></div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-sm font-medium ${
                  region.status === 'healthy' ? 'text-green-600' :
                  region.status === 'degraded' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {getStatusText(region.status)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium text-gray-900">{region.uptime}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Services</span>
                <span className="text-sm font-medium text-gray-900">{region.services}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Incidents</span>
                <span className="text-sm font-medium text-gray-900">{region.incidents}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Latency</span>
                <span className="text-sm font-medium text-gray-900">{region.latency}ms</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm font-medium text-gray-900">
                  {(region.users / 1000).toFixed(0)}K
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="w-full px-3 py-2 text-sm font-medium text-azure-600 bg-azure-50 rounded-lg hover:bg-azure-100 transition-colors">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RegionalView;
