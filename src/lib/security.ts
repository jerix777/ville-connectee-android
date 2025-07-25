// Security utilities for input validation and file handling

export interface FileValidationOptions {
  maxSize: number; // in bytes
  allowedTypes: string[];
  allowedExtensions: string[];
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// File upload validation
export function validateFile(file: File, options: FileValidationOptions): ValidationResult {
  // Check file size
  if (file.size > options.maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${Math.round(options.maxSize / (1024 * 1024))}MB limit`
    };
  }

  // Check file type
  if (!options.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed`
    };
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !options.allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `File extension .${extension} is not allowed`
    };
  }

  return { isValid: true };
}

// Predefined validation options
export const FILE_VALIDATION_OPTIONS = {
  images: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp']
  },
  audio: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
    allowedExtensions: ['mp3', 'wav', 'ogg']
  },
  documents: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'text/plain'],
    allowedExtensions: ['pdf', 'txt']
  }
};

// Text sanitization to prevent XSS
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Phone number validation
export function validatePhoneNumber(phone: string): ValidationResult {
  const phoneRegex = /^(?:\+237|237)?[2368][0-9]{7,8}$/;
  
  if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
    return {
      isValid: false,
      error: 'Invalid phone number format. Please use Cameroon format (e.g., 237123456789)'
    };
  }
  
  return { isValid: true };
}

// Email validation (stricter than basic regex)
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format'
    };
  }
  
  // Check for common disposable email domains
  const disposableDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (domain && disposableDomains.includes(domain)) {
    return {
      isValid: false,
      error: 'Disposable email addresses are not allowed'
    };
  }
  
  return { isValid: true };
}

// Password strength validation
export function validatePassword(password: string): ValidationResult {
  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long'
    };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const criteriaMet = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  if (criteriaMet < 3) {
    return {
      isValid: false,
      error: 'Password must contain at least 3 of: uppercase letters, lowercase letters, numbers, special characters'
    };
  }
  
  return { isValid: true };
}

// Rate limiting for forms (client-side)
export class RateLimiter {
  private static attempts: Map<string, number[]> = new Map();
  
  static checkLimit(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the time window
    const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true; // Within rate limit
  }
}

// Content moderation helpers
export function detectSuspiciousContent(text: string): ValidationResult {
  const suspiciousPatterns = [
    /\b(?:hack|exploit|vulnerability|injection|xss|csrf)\b/i,
    /javascript:/i,
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /on\w+\s*=/i, // event handlers
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        error: 'Content contains potentially harmful code'
      };
    }
  }
  
  return { isValid: true };
}