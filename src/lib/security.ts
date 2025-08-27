import DOMPurify from 'dompurify';
import { supabase } from '@/integrations/supabase/client';

// XSS Sanitization
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};

export const sanitizeText = (text: string): string => {
  // Remove any HTML tags and dangerous characters
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Content validation
export const validateMessageContent = (content: string): { isValid: boolean; error?: string } => {
  if (!content || content.trim().length === 0) {
    return { isValid: false, error: 'Le message ne peut pas être vide' };
  }

  if (content.length > 4000) {
    return { isValid: false, error: 'Le message ne peut pas dépasser 4000 caractères' };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:(?!image\/)/gi, // Allow only image data URLs
    /vbscript:/gi,
    /expression\s*\(/gi
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(content)) {
      return { isValid: false, error: 'Contenu non autorisé détecté' };
    }
  }

  return { isValid: true };
};

// Rate limiting (client-side tracking)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (key: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const limit = rateLimitMap.get(key);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (limit.count >= maxRequests) {
    return false;
  }

  limit.count++;
  return true;
};

// Audit logging
export interface AuditEvent {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
}

export const logSecurityEvent = async (event: AuditEvent): Promise<void> => {
  try {
    const { error } = await supabase.rpc('log_audit_event', {
      p_action: event.action,
      p_resource_type: event.resource_type,
      p_resource_id: event.resource_id || null,
      p_details: event.details || null
    });

    if (error) {
      console.error('Failed to log security event:', error);
    }
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};

// Security event types
export const SecurityEvents = {
  // Authentication
  LOGIN_SUCCESS: 'auth.login.success',
  LOGIN_FAILED: 'auth.login.failed',
  LOGOUT: 'auth.logout',
  SIGNUP: 'auth.signup',
  
  // Data access
  DATA_VIEW: 'data.view',
  DATA_CREATE: 'data.create',
  DATA_UPDATE: 'data.update',
  DATA_DELETE: 'data.delete',
  
  // Security
  XSS_ATTEMPT_BLOCKED: 'security.xss.blocked',
  RATE_LIMIT_EXCEEDED: 'security.rate_limit.exceeded',
  SUSPICIOUS_ACTIVITY: 'security.suspicious_activity',
  UNAUTHORIZED_ACCESS: 'security.unauthorized_access',
  
  // File operations
  FILE_UPLOAD: 'file.upload',
  FILE_UPLOAD_BLOCKED: 'file.upload.blocked'
} as const;

// Input sanitization for forms
export const sanitizeFormInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 1000); // Limit length
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Phone validation (French format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(?:\+33|0)[1-9](?:[0-9]{8})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Email validation with detailed response
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  return { isValid: true };
};

// File validation types and functions
export interface FileValidationOptions {
  maxSize: number; // in bytes
  allowedExtensions: string[];
  allowedTypes: string[];
  allowedMimeTypes?: string[];
}

export const validateFile = (file: File, options: FileValidationOptions): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > options.maxSize) {
    return { 
      isValid: false, 
      error: `File size exceeds maximum allowed size of ${Math.round(options.maxSize / (1024 * 1024))}MB` 
    };
  }
  
  // Check file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !options.allowedExtensions.includes(fileExtension)) {
    return { 
      isValid: false, 
      error: `File type not allowed. Allowed types: ${options.allowedExtensions.join(', ')}` 
    };
  }
  
  // Check MIME type if specified
  if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'File type not allowed based on content' 
    };
  }
  
  return { isValid: true };
};

// Predefined file validation options
export const FILE_VALIDATION_OPTIONS = {
  images: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  documents: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedExtensions: ['pdf', 'doc', 'docx', 'txt'],
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  },
  audio: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedExtensions: ['mp3', 'm4a', 'wav', 'ogg'],
    allowedTypes: ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg'],
    allowedMimeTypes: ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg']
  }
};