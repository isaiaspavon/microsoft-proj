import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

const DashboardContext = createContext();

const initialState = {
  globalMetrics: {
    uptime: 99.98,
    activeIncidents: 0,
    totalRegions: 100,
    healthyRegions: 98,
    degradedRegions: 1,
    criticalRegions: 1,
    avgResponseTime: 45,
    totalRequests: 1542000000,
  },
  incidents: [],
  regions: [],
  services: [],
  filters: {
    region: 'all',
    service: 'all',
    status: 'all',
    timeRange: '24h',
  },
  realTimeUpdates: true,
  isLoading: false,
  error: null,
};

const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GLOBAL_METRICS':
      return {
        ...state,
        globalMetrics: action.payload,
      };
    case 'SET_INCIDENTS':
      return {
        ...state,
        incidents: action.payload,
      };
    case 'SET_REGIONS':
      return {
        ...state,
        regions: action.payload,
      };
    case 'SET_SERVICES':
      return {
        ...state,
        services: action.payload,
      };
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case 'TOGGLE_REAL_TIME':
      return {
        ...state,
        realTimeUpdates: !state.realTimeUpdates,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'ADD_INCIDENT':
      return {
        ...state,
        incidents: [action.payload, ...state.incidents],
      };
    case 'UPDATE_INCIDENT':
      return {
        ...state,
        incidents: state.incidents.map(incident =>
          incident.id === action.payload.id ? action.payload : incident
        ),
      };
    default:
      return state;
  }
};

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const socket = useSocket();

  // Socket event listeners
  useEffect(() => {
    if (socket && state.realTimeUpdates) {
      socket.on('metrics-update', (data) => {
        dispatch({ type: 'SET_GLOBAL_METRICS', payload: data.globalMetrics });
      });

      socket.on('incident-update', (data) => {
        dispatch({ type: 'UPDATE_INCIDENT', payload: data });
      });

      socket.on('new-incident', (data) => {
        dispatch({ type: 'ADD_INCIDENT', payload: data });
      });

      return () => {
        socket.off('metrics-update');
        socket.off('incident-update');
        socket.off('new-incident');
      };
    }
  }, [socket, state.realTimeUpdates]);

  const value = {
    ...state,
    dispatch,
    updateFilters: (filters) => dispatch({ type: 'UPDATE_FILTERS', payload: filters }),
    toggleRealTime: () => dispatch({ type: 'TOGGLE_REAL_TIME' }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}; 