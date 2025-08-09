const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Mock data store
let globalMetrics = {
  uptime: 99.98,
  activeIncidents: 2,
  totalRegions: 100,
  healthyRegions: 97,
  degradedRegions: 2,
  criticalRegions: 1,
  avgResponseTime: 45,
  totalRequests: 1542000000,
};

let incidents = [
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
];

let regions = [
  { id: 'eastus', name: 'East US', status: 'healthy', latency: 25 },
  { id: 'westus2', name: 'West US 2', status: 'degraded', latency: 45 },
  { id: 'northeurope', name: 'North Europe', status: 'healthy', latency: 30 },
  { id: 'southeastasia', name: 'Southeast Asia', status: 'critical', latency: 120 },
];

let services = [
  { id: 'vm', name: 'Virtual Machines', status: 'healthy', uptime: 99.99 },
  { id: 'sql', name: 'SQL Database', status: 'degraded', uptime: 99.85 },
  { id: 'storage', name: 'Storage', status: 'healthy', uptime: 99.98 },
  { id: 'network', name: 'Virtual Network', status: 'healthy', uptime: 99.97 },
];

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial data
  socket.emit('metrics-update', { globalMetrics });
  socket.emit('incidents-update', { incidents });
  socket.emit('regions-update', { regions });
  socket.emit('services-update', { services });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulate real-time updates
const simulateMetricsUpdate = () => {
  // Simulate small variations in metrics
  globalMetrics.uptime = 99.98 + (Math.random() - 0.5) * 0.02;
  globalMetrics.avgResponseTime = 45 + (Math.random() - 0.5) * 10;
  globalMetrics.totalRequests += Math.floor(Math.random() * 1000000);

  io.emit('metrics-update', { globalMetrics });
};

const simulateIncidentUpdate = () => {
  // Randomly update incident status
  if (incidents.length > 0 && Math.random() < 0.1) {
    const randomIncident = incidents[Math.floor(Math.random() * incidents.length)];
    if (randomIncident.status === 'investigating') {
      randomIncident.status = 'resolved';
      randomIncident.updatedAt = new Date();
      globalMetrics.activeIncidents = Math.max(0, globalMetrics.activeIncidents - 1);
    }
    io.emit('incident-update', randomIncident);
    io.emit('metrics-update', { globalMetrics });
  }
};

// Schedule real-time updates
cron.schedule('*/30 * * * * *', simulateMetricsUpdate); // Every 30 seconds
cron.schedule('*/60 * * * * *', simulateIncidentUpdate); // Every minute

// API Routes

// Global metrics
app.get('/api/metrics/global', (req, res) => {
  res.json(globalMetrics);
});

// Regional metrics
app.get('/api/metrics/regional', (req, res) => {
  const { region } = req.query;
  if (region && region !== 'all') {
    const regionData = regions.find(r => r.id === region);
    res.json(regionData || { error: 'Region not found' });
  } else {
    res.json(regions);
  }
});

// Service metrics
app.get('/api/metrics/services', (req, res) => {
  const { service } = req.query;
  if (service && service !== 'all') {
    const serviceData = services.find(s => s.id === service);
    res.json(serviceData || { error: 'Service not found' });
  } else {
    res.json(services);
  }
});

// Incidents
app.get('/api/incidents', (req, res) => {
  const { severity, status, region } = req.query;
  let filteredIncidents = incidents;

  if (severity && severity !== 'all') {
    filteredIncidents = filteredIncidents.filter(i => i.severity === severity);
  }
  if (status && status !== 'all') {
    filteredIncidents = filteredIncidents.filter(i => i.status === status);
  }
  if (region && region !== 'all') {
    filteredIncidents = filteredIncidents.filter(i => i.region === region);
  }

  res.json(filteredIncidents);
});

app.post('/api/incidents', (req, res) => {
  const newIncident = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  incidents.unshift(newIncident);
  globalMetrics.activeIncidents++;
  
  io.emit('new-incident', newIncident);
  io.emit('metrics-update', { globalMetrics });
  
  res.status(201).json(newIncident);
});

app.put('/api/incidents/:id', (req, res) => {
  const { id } = req.params;
  const incidentIndex = incidents.findIndex(i => i.id === id);
  
  if (incidentIndex === -1) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  
  incidents[incidentIndex] = {
    ...incidents[incidentIndex],
    ...req.body,
    updatedAt: new Date(),
  };
  
  io.emit('incident-update', incidents[incidentIndex]);
  res.json(incidents[incidentIndex]);
});

// Analytics
app.get('/api/analytics', (req, res) => {
  const { timeRange } = req.query;
  
  // Generate mock analytics data based on time range
  const analyticsData = {
    responseTime: {
      average: 45,
      trend: 'decreasing',
      data: generateTimeSeriesData(timeRange || '24h', 40, 60),
    },
    requestVolume: {
      total: globalMetrics.totalRequests,
      trend: 'increasing',
      data: generateTimeSeriesData(timeRange || '24h', 1000000, 1500000),
    },
    errorRate: {
      current: 0.02,
      trend: 'decreasing',
      data: generateTimeSeriesData(timeRange || '24h', 0.01, 0.05),
    },
    uptime: {
      current: globalMetrics.uptime,
      trend: 'stable',
      data: generateTimeSeriesData(timeRange || '24h', 99.95, 100),
    },
  };
  
  res.json(analyticsData);
});

// Regions
app.get('/api/regions', (req, res) => {
  res.json(regions);
});

// Services
app.get('/api/services', (req, res) => {
  res.json(services);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json({
    notifications: {
      email: true,
      slack: false,
      teams: true,
      critical: true,
      warning: true,
      info: false,
    },
    display: {
      theme: 'light',
      refreshInterval: 30,
      showAnimations: true,
      compactMode: false,
    },
    integrations: {
      azureMonitor: true,
      applicationInsights: true,
      logAnalytics: false,
      eventHub: false,
    },
  });
});

app.put('/api/settings', (req, res) => {
  // In a real app, you'd save this to a database
  res.json({ message: 'Settings updated successfully' });
});

// Azure Monitor integration (mock)
app.get('/api/azure/metrics', (req, res) => {
  const { resourceId, metricName, timeRange } = req.query;
  
  // Mock Azure Monitor response
  const mockAzureData = {
    resourceId,
    metricName,
    timeRange,
    data: generateTimeSeriesData(timeRange || '1h', 0, 100),
    unit: 'Count',
    interval: 'PT1M',
  };
  
  res.json(mockAzureData);
});

// Helper function to generate time series data
function generateTimeSeriesData(timeRange, min, max) {
  const data = [];
  const now = new Date();
  let points = 24;
  let interval = 60 * 60 * 1000; // 1 hour in milliseconds
  
  if (timeRange === '1h') {
    points = 60;
    interval = 60 * 1000; // 1 minute
  } else if (timeRange === '7d') {
    points = 7;
    interval = 24 * 60 * 60 * 1000; // 1 day
  } else if (timeRange === '30d') {
    points = 30;
    interval = 24 * 60 * 60 * 1000; // 1 day
  }
  
  for (let i = points; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * interval);
    data.push({
      timestamp: timestamp.toISOString(),
      value: min + Math.random() * (max - min),
    });
  }
  
  return data;
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 CloudInsight server running on port ${PORT}`);
  console.log(`📊 Dashboard available at http://localhost:3000`);
  console.log(`🔌 WebSocket server ready for real-time updates`);
  console.log(`📈 Mock data initialized with ${incidents.length} incidents`);
}); 