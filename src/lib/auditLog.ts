import { supabase } from "@/integrations/supabase/client";

export interface AuditEvent {
  action: string;
  resource_type: string;
  resource_id?: string;
  user_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

// Note: Audit log table should be created via migration
// This is a placeholder for future audit log functionality

// Log security-relevant events
export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    const currentUser = await supabase.auth.getUser();
    
    const auditEntry = {
      ...event,
      user_id: event.user_id || currentUser.data.user?.id,
      timestamp: new Date().toISOString(),
      ip_address: event.ip_address || 'unknown',
      user_agent: event.user_agent || navigator.userAgent,
    };

    // For now, log to console in development
    if (import.meta.env.DEV) {
      console.log('🔐 AUDIT LOG:', auditEntry);
    }

    // In production, you would store this in a secure audit table
    // await supabase.from('audit_logs').insert(auditEntry);
    
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

// Predefined audit event types
export const AUDIT_EVENTS = {
  AUTH: {
    LOGIN_SUCCESS: 'auth.login.success',
    LOGIN_FAILED: 'auth.login.failed',
    LOGOUT: 'auth.logout',
    SIGNUP: 'auth.signup',
    PASSWORD_CHANGE: 'auth.password.change',
    ROLE_CHANGE: 'auth.role.change',
  },
  DATA: {
    CREATE: 'data.create',
    UPDATE: 'data.update',
    DELETE: 'data.delete',
    VIEW_SENSITIVE: 'data.view.sensitive',
  },
  SECURITY: {
    UNAUTHORIZED_ACCESS: 'security.unauthorized_access',
    SUSPICIOUS_ACTIVITY: 'security.suspicious_activity',
    FILE_UPLOAD_BLOCKED: 'security.file_upload.blocked',
    RATE_LIMIT_EXCEEDED: 'security.rate_limit.exceeded',
  },
  ADMIN: {
    USER_ROLE_ASSIGNED: 'admin.user_role.assigned',
    DATA_EXPORT: 'admin.data.export',
    SYSTEM_CONFIG_CHANGE: 'admin.system.config_change',
  }
} as const;

// Helper functions for common audit scenarios
export class SecurityAudit {
  static async logLogin(success: boolean, email?: string, error?: string) {
    await logAuditEvent({
      action: success ? AUDIT_EVENTS.AUTH.LOGIN_SUCCESS : AUDIT_EVENTS.AUTH.LOGIN_FAILED,
      resource_type: 'auth',
      details: {
        email: email ? email.substring(0, 3) + '***' : undefined, // Partially mask email
        error: error,
        timestamp: new Date().toISOString()
      }
    });
  }

  static async logRoleChange(targetUserId: string, oldRole: string, newRole: string) {
    await logAuditEvent({
      action: AUDIT_EVENTS.AUTH.ROLE_CHANGE,
      resource_type: 'user_role',
      resource_id: targetUserId,
      details: {
        old_role: oldRole,
        new_role: newRole,
        changed_at: new Date().toISOString()
      }
    });
  }

  static async logUnauthorizedAccess(resource: string, attemptedAction: string) {
    await logAuditEvent({
      action: AUDIT_EVENTS.SECURITY.UNAUTHORIZED_ACCESS,
      resource_type: resource,
      details: {
        attempted_action: attemptedAction,
        blocked_at: new Date().toISOString()
      }
    });
  }

  static async logSuspiciousActivity(activity: string, details: Record<string, any>) {
    await logAuditEvent({
      action: AUDIT_EVENTS.SECURITY.SUSPICIOUS_ACTIVITY,
      resource_type: 'security',
      details: {
        activity,
        ...details,
        detected_at: new Date().toISOString()
      }
    });
  }

  static async logFileUploadBlocked(filename: string, reason: string, fileSize: number) {
    await logAuditEvent({
      action: AUDIT_EVENTS.SECURITY.FILE_UPLOAD_BLOCKED,
      resource_type: 'file_upload',
      details: {
        filename: filename.substring(0, 20) + '...', // Truncate filename
        reason,
        file_size: fileSize,
        blocked_at: new Date().toISOString()
      }
    });
  }

  static async logDataAccess(resourceType: string, resourceId: string, action: string) {
    const actionKey = action.toUpperCase() as keyof typeof AUDIT_EVENTS.DATA;
    
    await logAuditEvent({
      action: AUDIT_EVENTS.DATA[actionKey] || AUDIT_EVENTS.DATA.VIEW_SENSITIVE,
      resource_type: resourceType,
      resource_id: resourceId,
      details: {
        action,
        accessed_at: new Date().toISOString()
      }
    });
  }
}