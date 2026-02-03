import config from '../config/env';

/**
 * Service to handle email sending.
 * Currently logs to console over implementing an actual provider (SendGrid/Resend) for development speed.
 */
export const sendVerificationEmail = async (email: string, token: string, name: string) => {
  const verificationUrl = `${config.CORS_ORIGIN}/verify-email?token=${token}`;
  
  // In a real app, you would use a template engine and an email provider here.
  const emailContent = `
    Hi ${name},
    
    Welcome to Prompt-Base! Please verify your email address by clicking the link below:
    
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    Best,
    The Prompt-Base Team
  `;

  if (config.NODE_ENV !== 'test') {
    console.log(`
    ==================================================
    📧 [MOCK EMAIL SERVICE] Sending to: ${email}
    Subject: Verify your email
    ${emailContent}
    ==================================================
    `);
  }
  
  return true;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${config.CORS_ORIGIN}/reset-password?token=${token}`;
  
  const emailContent = `
    You requested a password reset. Please click the link below to reset your password:
    
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you did not request this, please ignore this email.
  `;

  if (config.NODE_ENV !== 'test') {
    console.log(`
    ==================================================
    📧 [MOCK EMAIL SERVICE] Sending to: ${email}
    Subject: Password Reset Request
    ${emailContent}
    ==================================================
    `);
  }
  
  return true;
};

export const sendPasswordResetSuccessEmail = async (email: string) => {
  if (config.NODE_ENV !== 'test') {
    console.log(`
    ==================================================
    📧 [MOCK EMAIL SERVICE] Sending to: ${email}
    Subject: Password Reset Successful
    
    Your password has been successfully reset.
    ==================================================
    `);
  }
  return true;
};
