import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// import { useQuery } from 'react-query';
import toast from 'react-hot-toast';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import RegionalView from './pages/RegionalView';
import ServiceHealth from './pages/ServiceHealth';
import LoadingSpinner from './components/LoadingSpinner';

// Services
// import { fetchGlobalMetrics } from './services/api';
import { useSocket } from './hooks/useSocket';

// Context
import { DashboardProvider } from './context/DashboardContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();

  // Fetch initial global metrics (commented out for demo)
  // const { data: globalMetrics, isLoading: metricsLoading } = useQuery(
  //   'globalMetrics',
  //   fetchGlobalMetrics,
  //   {
  //     refetchInterval: 30000, // Refresh every 30 seconds
  //     staleTime: 25000,
  //   }
  // );

  // Socket connection status
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        toast.success('Real-time connection established');
      });

      socket.on('disconnect', () => {
        toast.error('Real-time connection lost');
      });

      socket.on('metrics-update', (data) => {
        toast.success('Metrics updated in real-time', {
          duration: 2000,
        });
      });

      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('metrics-update');
      };
    }
  }, [socket]);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl lg:relative lg:translate-x-0"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-6">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Dashboard />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/incidents"
                    element={
                      <motion.div
                        key="incidents"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Incidents />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <motion.div
                        key="analytics"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Analytics />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <motion.div
                        key="settings"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Settings />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/regions"
                    element={
                      <motion.div
                        key="regions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RegionalView />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/service-health"
                    element={
                      <motion.div
                        key="service-health"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ServiceHealth />
                      </motion.div>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}

export default App; 