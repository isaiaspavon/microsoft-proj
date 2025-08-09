import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-azure-600 to-azure-800 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-white"
      >
        {/* Logo */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-2xl"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0078d4"/>
            <path d="M2 17L12 22L22 17" stroke="#0078d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#0078d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold mb-2"
        >
          CloudInsight
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg opacity-80 mb-8"
        >
          Azure Reliability Dashboard
        </motion.p>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
          ))}
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-sm opacity-60 mt-6"
        >
          Connecting to Azure Monitor...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner; 