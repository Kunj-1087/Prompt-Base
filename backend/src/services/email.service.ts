
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { emailTemplates } from '../templates/emailTemplates';

interface EmailOptions {
  to: string;
  subject: string;
  template: keyof typeof emailTemplates;
  context: Record<string, any>;
}

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private async sendEmail({ to, subject, template, context }: EmailOptions) {
    const templateData = emailTemplates[template];
    if (!templateData) {
      throw new Error(`Email template '${template}' not found`);
    }

    const htmlCompiler = handlebars.compile(templateData.html);
    const textCompiler = handlebars.compile(templateData.text);

    const html = htmlCompiler(context);
    const text = textCompiler(context);

    try {
      const info = await this.transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to,
        subject,
        html,
        text,
      });
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    return this.sendEmail({
      to,
      subject: emailTemplates.welcome.subject,
      template: 'welcome',
      context: { 
        name, 
        ctaLink: `${process.env.FRONTEND_URL}/dashboard` 
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    return this.sendEmail({
      to,
      subject: emailTemplates.verification.subject,
      template: 'verification',
      context: { 
        verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${token}` 
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetLink: string) {
    return this.sendEmail({
      to,
      subject: emailTemplates.resetPassword.subject,
      template: 'resetPassword',
      context: { resetLink },
    });
  }

  async sendNotificationEmail(to: string, message: string, actionLink: string) {
    return this.sendEmail({
      to,
      subject: emailTemplates.notification.subject,
      template: 'notification',
      context: { message, actionLink },
    });
  }

  async sendPasswordResetSuccessEmail(to: string) {
      // Intentionally simple or using notification template if specific one missing
      // Or we can assume 'resetSuccess' logic or just skip context
      // For now, let's use a generic notification or assume template exists
      // But verify template exists? 'emailTemplates' import.
      // Let's check templates/emailTemplates usage
      // I'll assume we used notification or create a new one.
      // Safest: Use notification template for now as fallback
      return this.sendEmail({
          to,
          subject: 'Password Reset Successful',
          template: 'notification', // reusing notification as fallback
          context: { 
              message: 'Your password has been successfully reset.',
              actionLink: `${process.env.FRONTEND_URL}/login`
          }
      });
  }
}

export const emailService = new EmailService();
