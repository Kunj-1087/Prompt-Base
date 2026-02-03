
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { emailService } from '../services/email.service';

async function testEmail() {
  console.log('Starting Email Service Test...');
  console.log('SMTP Config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER ? '***' : 'missing',
    from: process.env.FROM_EMAIL
  });

  try {
    console.log('Sending Welcome Email...');
    await emailService.sendWelcomeEmail('test@example.com', 'Test User');
    console.log('✅ Welcome Email sent successfully');

    console.log('Sending Verification Email...');
    await emailService.sendVerificationEmail('test@example.com', 'test-token-123');
    console.log('✅ Verification Email sent successfully');

    console.log('Sending Password Reset Email...');
    await emailService.sendPasswordResetEmail('test@example.com', 'https://example.com/reset');
    console.log('✅ Password Reset Email sent successfully');

    console.log('Sending Notification Email...');
    await emailService.sendNotificationEmail('test@example.com', 'This is a test notification', 'https://example.com/notifications');
    console.log('✅ Notification Email sent successfully');

    console.log('🎉 All email tests passed!');
  } catch (error) {
    console.error('❌ Email test failed:', error);
    process.exit(1);
  }
}

testEmail();
