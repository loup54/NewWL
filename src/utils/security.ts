
import config from './environment';

export const validateFileType = (file: File): boolean => {
  return config.upload.allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File): boolean => {
  return file.size <= config.upload.maxFileSize;
};

export const sanitizeFileName = (fileName: string): string => {
  // Remove potentially dangerous characters and limit length
  return fileName
    .replace(/[^a-zA-Z0-9.-_]/g, '_')
    .substring(0, 100);
};

export const validateFileContent = (content: string): boolean => {
  // Basic content validation - check for potentially malicious patterns
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(content));
};

export const createSecureFileReader = (): FileReader => {
  const reader = new FileReader();
  
  // Add timeout to prevent hanging reads
  const timeout = setTimeout(() => {
    reader.abort();
    console.error('File read timeout exceeded');
  }, 30000); // 30 seconds
  
  reader.addEventListener('loadend', () => {
    clearTimeout(timeout);
  });
  
  reader.addEventListener('error', () => {
    clearTimeout(timeout);
  });
  
  return reader;
};

export const generateSecureId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
