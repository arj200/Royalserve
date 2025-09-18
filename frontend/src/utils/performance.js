// Performance optimization utilities for the application

export const performanceUtils = {
  // Request timing utility
  timeRequest: async (requestName, requestFunction) => {
    const startTime = performance.now();
    try {
      const result = await requestFunction();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`⚡ ${requestName} completed in ${duration.toFixed(2)}ms`);
      
      // Log slow requests (>2 seconds)
      if (duration > 2000) {
        console.warn(`🐌 Slow request detected: ${requestName} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.error(`❌ ${requestName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  },

  // Debounce utility for performance
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Memory usage monitor
  logMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = performance.memory;
      console.log('💾 Memory Usage:', {
        used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
      });
    }
  },

  // Check network connection quality
  getConnectionInfo: () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }
};

// Log performance info on load
console.log('🚀 Performance Utils Loaded');
if (performanceUtils.getConnectionInfo()) {
  console.log('🌐 Connection Info:', performanceUtils.getConnectionInfo());
}