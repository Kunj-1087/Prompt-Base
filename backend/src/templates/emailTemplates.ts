
export const emailTemplates = {
  welcome: {
    subject: 'Welcome to Prompt-Base!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Welcome to Prompt-Base, {{name}}!</h1>
        <p>We're excited to have you on board.</p>
        <p>Explore our marketplace to find the best prompts for your needs.</p>
        <a href="{{ctaLink}}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a>
        <p>Best regards,<br>The Prompt-Base Team</p>
      </div>
    `,
    text: `
      Welcome to Prompt-Base, {{name}}!
      We're excited to have you on board.
      Explore our marketplace to find the best prompts for your needs.
      Get Started: {{ctaLink}}
      
      Best regards,
      The Prompt-Base Team
    `
  },
  verification: {
    subject: 'Verify your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Verify your email</h2>
        <p>Please click the button below to verify your email address.</p>
        <a href="{{verificationLink}}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>Or copy and paste this link into your browser:</p>
        <p>{{verificationLink}}</p>
      </div>
    `,
    text: `
      Verify your email
      Please click the link below to verify your email address.
      {{verificationLink}}
    `
  },
  resetPassword: {
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DC2626;">Password Reset</h2>
        <p>You requested a password reset. Click the button below to reset your password.</p>
        <a href="{{resetLink}}" style="display: inline-block; background-color: #DC2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
    text: `
      Password Reset
      You requested a password reset. Please visit the link below to reset your password.
      {{resetLink}}
      
      If you didn't request this, please ignore this email.
    `
  },
  notification: {
    subject: 'New Notification from Prompt-Base',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Notification</h2>
        <p>{{message}}</p>
        <a href="{{actionLink}}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Details</a>
      </div>
    `,
    text: `
      Notification
      {{message}}
      
      View Details: {{actionLink}}
    `
  }
};
