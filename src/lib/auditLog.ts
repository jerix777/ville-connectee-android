import { logSecurityEvent, SecurityEvents } from './security';

export interface AuditEvent {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

// Main audit logging function
export const logAuditEvent = async (event: AuditEvent): Promise<void> => {
  try {
    // Enrich event with browser information
    const enrichedEvent = {
      ...event,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      // IP address will be captured server-side
    };

    // Log to security service
    await logSecurityEvent(enrichedEvent);

    // In development, also log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Audit Event:', enrichedEvent);
    }
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
};

// Predefined audit event types
export const AUDIT_EVENTS = {
  // Authentication events
  AUTH: {
    LOGIN_SUCCESS: 'auth.login.success',
    LOGIN_FAILED: 'auth.login.failed',
    LOGOUT: 'auth.logout',
    SIGNUP: 'auth.signup',
    PASSWORD_CHANGE: 'auth.password.change',
    EMAIL_CHANGE: 'auth.email.change',
  },
  
  // Data operations
  DATA: {
    CREATE: 'data.create',
    READ: 'data.read',
    UPDATE: 'data.update',
    DELETE: 'data.delete',
    BULK_DELETE: 'data.bulk_delete',
  },
  
  // Security events
  SECURITY: {
    XSS_BLOCKED: 'security.xss.blocked',
    RATE_LIMIT_HIT: 'security.rate_limit.hit',
    UNAUTHORIZED_ACCESS: 'security.unauthorized_access',
    SUSPICIOUS_ACTIVITY: 'security.suspicious_activity',
    FILE_UPLOAD_BLOCKED: 'security.file_upload.blocked',
  },
  
  // Admin actions
  ADMIN: {
    USER_ROLE_CHANGE: 'admin.user.role_change',
    USER_SUSPEND: 'admin.user.suspend',
    USER_ACTIVATE: 'admin.user.activate',
    SYSTEM_SETTING_CHANGE: 'admin.system.setting_change',
  },
} as const;

// Security audit helper class
export class SecurityAudit {
  // Log successful login
  static async logLogin(success: boolean, email?: string, error?: string) {
    await logAuditEvent({
      action: success ? AUDIT_EVENTS.AUTH.LOGIN_SUCCESS : AUDIT_EVENTS.AUTH.LOGIN_FAILED,
      resource_type: 'auth',
      details: {
        email: email?.substring(0, email.indexOf('@') + 1) + '***', // Mask email
        success,
        error: success ? undefined : error,
      },
    });
  }

  // Log role changes
  static async logRoleChange(targetUserId: string, oldRole: string, newRole: string) {
    await logAuditEvent({
      action: AUDIT_EVENTS.ADMIN.USER_ROLE_CHANGE,
      resource_type: 'user',
      resource_id: targetUserId,
      details: {
        old_role: oldRole,
        new_role: newRole,
      },
    });
  }

  // Log unauthorized access attempts
  static async logUnauthorizedAccess(resource: string, attemptedAction: string) {
    await logAuditEvent({
      action: AUDIT_EVENTS.SECURITY.UNAUTHORIZED_ACCESS,
      resource_type: resource,
      details: {
        attempted_action: attemptedAction,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Log suspicious activity
  static async logSuspiciousActivity(activity: string, details: Record<string, any>) {
    await logAuditEvent({
      action: AUDIT_EVENTS.SECURITY.SUSPICIOUS_ACTIVITY,
      resource_type: 'security',
      details: {
        activity,
        ...details,
      },
    });
  }

  // Log blocked file uploads
  static async logFileUploadBlocked(filename: string, reason: string, fileSize: number) {
    await logAuditEvent({
      action: AUDIT_EVENTS.SECURITY.FILE_UPLOAD_BLOCKED,
      resource_type: 'file',
      details: {
        filename: filename.substring(0, 50), // Limit filename length
        reason,
        file_size: fileSize,
      },
    });
  }

  // Log data access
  static async logDataAccess(resourceType: string, resourceId: string, action: string) {
    await logAuditEvent({
      action: `${AUDIT_EVENTS.DATA.READ}.${resourceType}`,
      resource_type: resourceType,
      resource_id: resourceId,
      details: {
        action,
      },
    });
  }
}