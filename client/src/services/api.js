import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Global metrics
export const fetchGlobalMetrics = async () => {
  try {
    const response = await api.get('/metrics/global');
    return response.data;
  } catch (error) {
    console.error('Error fetching global metrics:', error);
    throw error;
  }
};

// Regional metrics
export const fetchRegionalMetrics = async (region = 'all') => {
  try {
    const response = await api.get(`/metrics/regional?region=${region}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching regional metrics:', error);
    throw error;
  }
};

// Service metrics
export const fetchServiceMetrics = async (service = 'all') => {
  try {
    const response = await api.get(`/metrics/services?service=${service}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service metrics:', error);
    throw error;
  }
};

// Incidents
export const fetchIncidents = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/incidents?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }
};

export const createIncident = async (incidentData) => {
  try {
    const response = await api.post('/incidents', incidentData);
    return response.data;
  } catch (error) {
    console.error('Error creating incident:', error);
    throw error;
  }
};

export const updateIncident = async (id, updateData) => {
  try {
    const response = await api.put(`/incidents/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating incident:', error);
    throw error;
  }
};

// Analytics
export const fetchAnalytics = async (timeRange = '24h', filters = {}) => {
  try {
    const params = new URLSearchParams({ timeRange, ...filters });
    const response = await api.get(`/analytics?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

// Regions
export const fetchRegions = async () => {
  try {
    const response = await api.get('/regions');
    return response.data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

// Services
export const fetchServices = async () => {
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Azure Monitor integration
export const fetchAzureMetrics = async (resourceId, metricName, timeRange = '1h') => {
  try {
    const response = await api.get('/azure/metrics', {
      params: {
        resourceId,
        metricName,
        timeRange,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Azure metrics:', error);
    throw error;
  }
};

// Health checks
export const fetchHealthChecks = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error fetching health checks:', error);
    throw error;
  }
};

// Settings
export const fetchSettings = async () => {
  try {
    const response = await api.get('/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSettings = async (settings) => {
  try {
    const response = await api.put('/settings', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

// Mock data for development
export const getMockData = () => ({
  globalMetrics: {
    uptime: 99.98,
    activeIncidents: 2,
    totalRegions: 100,
    healthyRegions: 97,
    degradedRegions: 2,
    criticalRegions: 1,
    avgResponseTime: 45,
    totalRequests: 1542000000,
  },
  incidents: [
    {
      id: '1',
      title: 'High CPU usage in East US region',
      description: 'CPU utilization has exceeded 90% for the past 30 minutes',
      severity: 'warning',
      status: 'investigating',
      region: 'East US',
      service: 'Virtual Machines',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(),
      affectedUsers: 15000,
    },
    {
      id: '2',
      title: 'Database connection timeout',
      description: 'SQL Database connections are timing out intermittently',
      severity: 'critical',
      status: 'resolved',
      region: 'West US 2',
      service: 'SQL Database',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      affectedUsers: 50000,
    },
  ],
  regions: [
    { id: 'eastus', name: 'East US', status: 'healthy', latency: 25 },
    { id: 'westus2', name: 'West US 2', status: 'degraded', latency: 45 },
    { id: 'northeurope', name: 'North Europe', status: 'healthy', latency: 30 },
    { id: 'southeastasia', name: 'Southeast Asia', status: 'critical', latency: 120 },
  ],
  services: [
    { id: 'vm', name: 'Virtual Machines', status: 'healthy', uptime: 99.99 },
    { id: 'sql', name: 'SQL Database', status: 'degraded', uptime: 99.85 },
    { id: 'storage', name: 'Storage', status: 'healthy', uptime: 99.98 },
    { id: 'network', name: 'Virtual Network', status: 'healthy', uptime: 99.97 },
  ],
});

export default api; 