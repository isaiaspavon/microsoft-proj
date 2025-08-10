import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ServerIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  WifiIcon,
  CircleStackIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const ServiceHealth = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('all');

  const services = [
    {
      name: 'Azure Compute',
      status: 'healthy',
      uptime: 99.99,
      responseTime: 45,
      availability: 100,
      incidents: 0,
      icon: ServerIcon,
      description: 'Virtual machines, containers, and compute resources'
    },
    {
      name: 'Azure Storage',
      status: 'healthy',
      uptime: 99.98,
      responseTime: 12,
      availability: 100,
      incidents: 0,
      icon: CircleStackIcon,
      description: 'Blob storage, file storage, and data services'
    },
    {
      name: 'Azure Network',
      status: 'degraded',
      uptime: 99.85,
      responseTime: 85,
      availability: 95,
      incidents: 1,
      icon: WifiIcon,
      description: 'Virtual networks, load balancers, and connectivity'
    },
    {
      name: 'Azure Database',
      status: 'healthy',
      uptime: 99.97,
      responseTime: 28,
      availability: 100,
      incidents: 0,
      icon: CircleStackIcon,
      description: 'SQL Database, Cosmos DB, and data services'
    },
    {
      name: 'Azure App Service',
      status: 'critical',
      uptime: 98.5,
      responseTime: 150,
      availability: 85,
      incidents: 2,
      icon: CloudIcon,
      description: 'Web apps, mobile apps, and API services'
    },
    {
      name: 'Azure Monitor',
      status: 'healthy',
      uptime: 99.99,
      responseTime: 8,
      availability: 100,
      incidents: 0,
      icon: ChartBarIcon,
      description: 'Monitoring, logging, and diagnostics'
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

  const filteredServices = selectedService === 'all' 
    ? services 
    : services.filter(service => service.status === selectedService);

  const overallHealth = {
    healthy: services.filter(s => s.status === 'healthy').length,
    degraded: services.filter(s => s.status === 'degraded').length,
    critical: services.filter(s => s.status === 'critical').length,
    total: services.length
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
            <h1 className="text-3xl font-bold text-gray-900">Service Health</h1>
            <p className="text-gray-600 mt-1">
              Real-time status of Azure services and components
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ServerIcon className="w-6 h-6 text-azure-600" />
          <span className="text-sm font-medium text-gray-600">
            {services.length} Services
          </span>
        </div>
      </motion.div>

      {/* Overall Health Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Healthy Services</p>
              <p className="text-2xl font-bold text-green-600">{overallHealth.healthy}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Degraded Services</p>
              <p className="text-2xl font-bold text-yellow-600">{overallHealth.degraded}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Services</p>
              <p className="text-2xl font-bold text-red-600">{overallHealth.critical}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Uptime</p>
              <p className="text-2xl font-bold text-gray-900">
                {((overallHealth.healthy / overallHealth.total) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
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
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure-500 focus:border-azure-500"
          >
            <option value="all">All Statuses</option>
            <option value="healthy">Healthy</option>
            <option value="degraded">Degraded</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredServices.map((service, index) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-azure-100 rounded-lg flex items-center justify-center">
                  {React.createElement(service.icon, { className: "w-5 h-5 text-azure-600" })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-xs text-gray-500">{service.description}</p>
                </div>
              </div>
              <div className={`w-3 h-3 ${getStatusColor(service.status)} rounded-full`}></div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-sm font-medium ${
                  service.status === 'healthy' ? 'text-green-600' :
                  service.status === 'degraded' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {getStatusText(service.status)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium text-gray-900">{service.uptime}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-medium text-gray-900">{service.responseTime}ms</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Availability</span>
                <span className="text-sm font-medium text-gray-900">{service.availability}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Incidents</span>
                <span className="text-sm font-medium text-gray-900">{service.incidents}</span>
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

export default ServiceHealth;
