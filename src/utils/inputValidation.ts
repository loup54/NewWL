
export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'uuid' | 'boolean';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class InputValidator {
  private rules: ValidationRule[];

  constructor(rules: ValidationRule[]) {
    this.rules = rules;
  }

  validate(data: Record<string, any>): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const rule of this.rules) {
      const value = data[rule.field];
      const fieldErrors = this.validateField(rule, value);
      errors.push(...fieldErrors);
    }

    return errors;
  }

  private validateField(rule: ValidationRule, value: any): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required validation
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({ field: rule.field, message: `${rule.field} is required` });
      return errors; // Stop validation if required field is missing
    }

    // Skip other validations if value is empty and not required
    if (!rule.required && (value === undefined || value === null || value === '')) {
      return errors;
    }

    // Type validation
    if (rule.type) {
      const typeError = this.validateType(rule.field, value, rule.type);
      if (typeError) {
        errors.push(typeError);
        return errors; // Stop if type is wrong
      }
    }

    // Length validations for strings
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must be at least ${rule.minLength} characters`
        });
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must not exceed ${rule.maxLength} characters`
        });
      }
    }

    // Numeric range validations
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must be at least ${rule.min}`
        });
      }
      if (rule.max !== undefined && value > rule.max) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must not exceed ${rule.max}`
        });
      }
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors.push({
        field: rule.field,
        message: `${rule.field} format is invalid`
      });
    }

    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(value);
      if (customResult !== true) {
        errors.push({
          field: rule.field,
          message: typeof customResult === 'string' ? customResult : `${rule.field} is invalid`
        });
      }
    }

    return errors;
  }

  private validateType(field: string, value: any, type: string): ValidationError | null {
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          return { field, message: `${field} must be a string` };
        }
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return { field, message: `${field} must be a valid number` };
        }
        break;
      case 'email':
        if (typeof value !== 'string' || !this.isValidEmail(value)) {
          return { field, message: `${field} must be a valid email address` };
        }
        break;
      case 'uuid':
        if (typeof value !== 'string' || !this.isValidUUID(value)) {
          return { field, message: `${field} must be a valid UUID` };
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          return { field, message: `${field} must be a boolean` };
        }
        break;
    }
    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}

// Common validation rules
export const commonValidations = {
  voucherCode: {
    field: 'code',
    required: true,
    type: 'string' as const,
    minLength: 13,
    maxLength: 13,
    pattern: /^(FREE|PAID)-[A-Z0-9]{8}$/
  },
  voucherValue: {
    field: 'value',
    required: true,
    type: 'number' as const,
    min: 0.01,
    max: 1000
  },
  codeCount: {
    field: 'codeCount',
    required: true,
    type: 'number' as const,
    min: 1,
    max: 100
  },
  email: {
    field: 'email',
    required: true,
    type: 'email' as const,
    maxLength: 254
  },
  userId: {
    field: 'user_id',
    required: true,
    type: 'uuid' as const
  }
};

// Sanitization utilities
export const sanitizeInput = {
  string: (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  },
  
  number: (input: any): number | null => {
    const num = parseFloat(input);
    return isNaN(num) ? null : num;
  },
  
  boolean: (input: any): boolean => {
    return Boolean(input);
  },
  
  voucherCode: (input: string): string => {
    return input.toUpperCase().trim();
  }
};
