import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const UptimeChart = ({ timeRange = '24h' }) => {
  // Generate mock data based on time range
  const generateData = () => {
    const now = new Date();
    const data = [];
    const labels = [];
    
    let points = 24;
    let interval = 1; // hours
    
    if (timeRange === '7d') {
      points = 7;
      interval = 24; // days
    } else if (timeRange === '30d') {
      points = 30;
      interval = 24; // days
    } else if (timeRange === '1h') {
      points = 60;
      interval = 1/60; // minutes
    }
    
    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * interval * 60 * 60 * 1000);
      labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      
      // Generate realistic uptime data with some variation
      const baseUptime = 99.98;
      const variation = (Math.random() - 0.5) * 0.04; // ±0.02%
      data.push(baseUptime + variation);
    }
    
    return { labels, data };
  };

  const { labels, data } = generateData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Uptime %',
        data,
        borderColor: '#0078d4',
        backgroundColor: 'rgba(0, 120, 212, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0078d4',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#0078d4',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Uptime: ${context.parsed.y.toFixed(3)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        min: 99.9,
        max: 100,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
          callback: function(value) {
            return value.toFixed(3) + '%';
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      point: {
        hoverBackgroundColor: '#0078d4',
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default UptimeChart; 