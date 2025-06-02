
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
    description: 'Analyze documents for meaningful themes like respect, inclusion, and diversity',
    url: isProduction() 
      ? 'https://wordlens.app' 
      : 'https://83239b53-8480-4243-b2dd-d190bf041317.lovableproject.com'
  },
  
  // API configuration
  api: {
    supabaseUrl: 'https://ccmyjrgrdymwraiuauoq.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbXlqcmdyZHltd3JhaXVhdW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MjM0ODgsImV4cCI6MjA2NDM5OTQ4OH0.JLROmtAGaL3pCbGsoQf1hS47lk8ovdblb0YoL_fr5cg'
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
    debounceDelay: isProduction() ? 500 : 300, // Higher debounce in production
    cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
    enableServiceWorker: isProduction()
  },
  
  // Security settings
  security: {
    enableContentSecurityPolicy: isProduction(),
    sanitizeUploads: true,
    maxConcurrentUploads: 3,
    enableHTTPS: isProduction()
  },
  
  // Analytics and monitoring
  monitoring: {
    enableErrorReporting: isProduction(),
    enablePerformanceMonitoring: isProduction(),
    logLevel: isProduction() ? 'error' : 'debug'
  }
};

export default config;
