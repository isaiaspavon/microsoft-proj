import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  XMarkIcon,
  HomeIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  ServerIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useDashboard } from '../context/DashboardContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Incidents', href: '/incidents', icon: ExclamationTriangleIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const filters = [
  { name: 'All Regions', value: 'all', icon: GlobeAltIcon },
  { name: 'East US', value: 'eastus', icon: ServerIcon },
  { name: 'West US 2', value: 'westus2', icon: ServerIcon },
  { name: 'North Europe', value: 'northeurope', icon: ServerIcon },
  { name: 'Southeast Asia', value: 'southeastasia', icon: ServerIcon },
];

const timeRanges = [
  { name: 'Last Hour', value: '1h' },
  { name: 'Last 24 Hours', value: '24h' },
  { name: 'Last 7 Days', value: '7d' },
  { name: 'Last 30 Days', value: '30d' },
];

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { filters: currentFilters, updateFilters, globalMetrics } = useDashboard();

  const handleFilterChange = (type, value) => {
    updateFilters({ [type]: value });
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-azure-500 to-azure-600 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">CloudInsight</h2>
            <p className="text-xs text-gray-500">Azure Monitor</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-azure-50 text-azure-700 border border-azure-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-azure-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        {/* Filters */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Filters
            </h3>
            
            {/* Region Filter */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Region
              </label>
              <select
                value={currentFilters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure-500 focus:border-azure-500"
              >
                {filters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range Filter */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Time Range
              </label>
              <select
                value={currentFilters.timeRange}
                onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure-500 focus:border-azure-500"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Summary */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Global Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Healthy</span>
                </div>
                <span className="text-sm font-semibold text-green-700">
                  {globalMetrics?.healthyRegions || 98}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Degraded</span>
                </div>
                <span className="text-sm font-semibold text-yellow-700">
                  {globalMetrics?.degradedRegions || 1}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Critical</span>
                </div>
                <span className="text-sm font-semibold text-red-700">
                  {globalMetrics?.criticalRegions || 1}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated</span>
          <span className="flex items-center space-x-1">
            <ClockIcon className="w-3 h-3" />
            <span>Just now</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 