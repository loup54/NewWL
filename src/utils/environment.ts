
export const isProduction = () => import.meta.env.PROD;
export const isDevelopment = () => import.meta.env.DEV;

export const config = {
  environment: import.meta.env.MODE,
  isProduction: isProduction(),
  isDevelopment: isDevelopment(),
  
  // App configuration
  app: {
    name: 'WordLens Insight Engine',
    version: '1.0.0',
    description: 'Analyze documents for meaningful themes like respect, inclusion, and diversity'
  },
  
  // File upload limits
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'text/plain',
      'text/html',
      'text/markdown',
      'text/rtf',
      'application/rtf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    chunkSize: 1024 * 1024 // 1MB chunks for large file processing
  },
  
  // Performance settings
  performance: {
    virtualizationThreshold: 1000, // Lines before virtualization kicks in
    debounceDelay: 300, // ms for search debouncing
    cacheExpiry: 24 * 60 * 60 * 1000 // 24 hours
  },
  
  // Security settings
  security: {
    enableContentSecurityPolicy: isProduction(),
    sanitizeUploads: true,
    maxConcurrentUploads: 3
  }
};

export default config;
