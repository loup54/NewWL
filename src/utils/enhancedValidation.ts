
import { validateFileContent, sanitizeFileName } from './security';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

export const validators = {
  email: (email: string): ValidationResult => {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    } else if (email.length > 254) {
      errors.push('Email address is too long');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: email.trim().toLowerCase()
    };
  },

  password: (password: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
      if (password.length > 128) {
        errors.push('Password is too long');
      }
      if (!/(?=.*[a-z])/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/(?=.*\d)/.test(password)) {
        errors.push('Password must contain at least one number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  fileName: (fileName: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!fileName) {
      errors.push('File name is required');
    } else {
      if (fileName.length > 100) {
        errors.push('File name is too long');
      }
      
      const dangerousPatterns = [
        /\.\./,
        /[<>:"|?*]/,
        /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i
      ];
      
      if (dangerousPatterns.some(pattern => pattern.test(fileName))) {
        errors.push('File name contains invalid characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizeFileName(fileName)
    };
  },

  fileContent: (content: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!validateFileContent(content)) {
      errors.push('File content contains potentially unsafe elements');
    }
    
    if (content.length > 10 * 1024 * 1024) { // 10MB limit
      errors.push('File content is too large');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  voucherCode: (code: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!code) {
      errors.push('Voucher code is required');
    } else {
      if (code.length < 8 || code.length > 32) {
        errors.push('Voucher code must be between 8 and 32 characters');
      }
      
      if (!/^[A-Z0-9-]+$/.test(code)) {
        errors.push('Voucher code can only contain uppercase letters, numbers, and hyphens');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: code.trim().toUpperCase()
    };
  },

  sanitizeHtml: (html: string): ValidationResult => {
    // Basic HTML sanitization - in production, use a library like DOMPurify
    const sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');

    return {
      isValid: true,
      errors: [],
      sanitizedValue: sanitized
    };
  }
};

export const validateForm = (data: Record<string, any>, rules: Record<string, keyof typeof validators>): {
  isValid: boolean;
  errors: Record<string, string[]>;
  sanitizedData: Record<string, any>;
} => {
  const errors: Record<string, string[]> = {};
  const sanitizedData: Record<string, any> = {};

  for (const [field, validatorKey] of Object.entries(rules)) {
    const validator = validators[validatorKey];
    const result = validator(data[field]);
    
    if (!result.isValid) {
      errors[field] = result.errors;
    }
    
    if (result.sanitizedValue !== undefined) {
      sanitizedData[field] = result.sanitizedValue;
    } else {
      sanitizedData[field] = data[field];
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
};
