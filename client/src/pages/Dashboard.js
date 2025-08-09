import React, { useState } from 'react';
import { motion } from 'framer-motion';
// import { useQuery } from 'react-query';
import { 
  ChartBarIcon, 
  GlobeAltIcon, 
  ServerIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { useDashboard } from '../context/DashboardContext';
import { getMockData } from '../services/api';
import MetricCard from '../components/MetricCard';
import StatusGrid from '../components/StatusGrid';
import UptimeChart from '../components/UptimeChart';
import IncidentList from '../components/IncidentList';


const Dashboard = () => {
  const { globalMetrics } = useDashboard();
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Fetch regional and service metrics (commented out for demo)
  // const { data: regionalData } = useQuery(
  //   ['regionalMetrics', filters.region],
  //   () => fetchRegionalMetrics(filters.region),
  //   { refetchInterval: 30000 }
  // );

  // const { data: serviceData } = useQuery(
  //   ['serviceMetrics', filters.service],
  //   () => fetchServiceMetrics(filters.service),
  //   { refetchInterval: 30000 }
  // );

  // Mock data for demonstration
  const mockData = getMockData();

  const metrics = [
    {
      title: 'Global Uptime',
      value: `${globalMetrics?.uptime || 99.98}%`,
      change: '+0.02%',
      changeType: 'positive',
      icon: ChartBarIcon,
      color: 'bg-green-500',
      description: 'Overall system availability',
    },
    {
      title: 'Active Incidents',
      value: globalMetrics?.activeIncidents || 2,
      change: '-1',
      changeType: 'negative',
      icon: ExclamationTriangleIcon,
      color: 'bg-orange-500',
      description: 'Current open incidents',
    },
    {
      title: 'Avg Response Time',
      value: `${globalMetrics?.avgResponseTime || 45}ms`,
      change: '-5ms',
      changeType: 'positive',
      icon: ClockIcon,
      color: 'bg-blue-500',
      description: 'Average API response time',
    },
    {
      title: 'Total Requests',
      value: `${((globalMetrics?.totalRequests || 1542000000) / 1000000).toFixed(1)}M`,
      change: '+2.3%',
      changeType: 'positive',
      icon: ArrowTrendingUpIcon,
      color: 'bg-purple-500',
      description: 'Requests processed today',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time monitoring of Azure cloud services across {globalMetrics?.totalRegions || 100} regions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure-500 focus:border-azure-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => (
          <motion.div key={metric.title} variants={itemVariants}>
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Uptime Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Uptime Trends</h3>
                <p className="text-sm text-gray-500">System availability over time</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Healthy</span>
              </div>
            </div>
            <UptimeChart timeRange={selectedTimeRange} />
          </motion.div>

          {/* Regional Status Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Regional Status</h3>
                <p className="text-sm text-gray-500">Health status across all regions</p>
              </div>
              <button className="text-sm text-azure-600 hover:text-azure-700 font-medium">
                View All
              </button>
            </div>
            <StatusGrid regions={mockData.regions} />
          </motion.div>
        </div>

        {/* Right Column - Incidents & Quick Actions */}
        <div className="space-y-6">
          {/* Active Incidents */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Incidents</h3>
                <p className="text-sm text-gray-500">Recent service disruptions</p>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                {globalMetrics?.activeIncidents || 2} Active
              </span>
            </div>
            <IncidentList incidents={mockData.incidents} limit={3} />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 text-left bg-azure-50 hover:bg-azure-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <GlobeAltIcon className="w-5 h-5 text-azure-600" />
                  <span className="text-sm font-medium text-gray-900">View All Regions</span>
                </div>
                <ArrowTrendingUpIcon className="w-4 h-4 text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">Report Incident</span>
                </div>
                <ArrowTrendingUpIcon className="w-4 h-4 text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <ServerIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Service Health</span>
                </div>
                <ArrowTrendingUpIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Azure Monitor</span>
                </div>
                <span className="text-sm text-green-700 font-medium">Connected</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Real-time Updates</span>
                </div>
                <span className="text-sm text-green-700 font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Data Processing</span>
                </div>
                <span className="text-sm text-green-700 font-medium">Online</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 