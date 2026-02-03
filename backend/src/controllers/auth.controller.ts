import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import Session from '../models/session.model'; // Updated import
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { sendResponse } from '../utils/response';
import { AppError } from '../utils/AppError';
import speakeasy from 'speakeasy';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';

import crypto from 'crypto';
import { emailService } from '../services/email.service';

// Signup remains mostly same, but we should create a session if we auto-login (we don't active auto-login on signup here based on response)
// Keeping signup as is for RefreshToken creation? NO.
// We must replace RefreshToken usage with Session usage entirely.
// Signup currently generates tokens. We should switch that to Session too or just not return tokens on signup?
// Signup returns tokens. Let's create a partial session or just return tokens linked to a session.

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendResponse(res, 400, 'Email already in use');
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpires,
    emailVerified: false
  });

  // Send verification email
  try {
    await emailService.sendVerificationEmail(user.email, verificationToken);
  } catch (err) {
    console.error('Failed to send verification email:', err);
  }

  // PARSE DEVICE INFO
  const ua = new UAParser(req.headers['user-agent']).getResult();
  // const ip = req.ip || '127.0.0.1'; // Express req.ip can be trusted if trust proxy set
  // Get IP properly (if behind proxy, x-forwarded-for etc. Express req.ip handles if configured)
  const ip = req.ip || '127.0.0.1';
  const geo = geoip.lookup(ip);
  const location = geo ? `${geo.city}, ${geo.country}` : 'Unknown Location';

  // Generate tokens
  // We need session ID for access token, but session is created AFTER token generation in previous code block.
  // Let's optimize: Create session first, or create ID first.
  // Valid flow: 
  // 1. Create Refresh Token string (random or jwt)
  // 2. Create Session (get _id)
  // 3. Create Access Token (with session._id)
  
  const refreshToken = generateRefreshToken(user._id);

  // CREATE SESSION
  const session = await Session.create({
      user: user._id,
      token: refreshToken,
      device: `${ua.device.vendor || ''} ${ua.device.model || 'Desktop'}`, 
      browser: `${ua.browser.name} ${ua.browser.version}`,
      os: `${ua.os.name} ${ua.os.version}`,
      ipAddress: ip,
      location: location,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  const accessToken = generateAccessToken(user._id, user.role, session._id);

  // Set Cookies
  const sameSiteOption: 'none' | 'lax' | 'strict' = process.env.NODE_ENV === 'production' ? 'none' : 'lax';
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: sameSiteOption
  };

  res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 15 * 60 * 1000) // 15 min
  });

  res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });

  sendResponse(res, 201, 'User created successfully. Please verify your email.', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: false
    },
    accessToken,
    refreshToken,
  });
};

export const checkEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  
  if (!email) {
    return sendResponse(res, 400, 'Email is required');
  }

  const existingUser = await User.findOne({ email });
  
  sendResponse(res, 200, 'Email availability checked', {
    available: !existingUser
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password, code } = req.body;

  // Find user
  const user = await User.findOne({ email }).select('+password +twoFactorSecret');
  if (!user || !user.isActive) {
    return sendResponse(res, 401, 'Invalid credentials or inactive account');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password!);
  if (!isMatch) {
    return sendResponse(res, 401, 'Invalid credentials');
  }

  // 2FA Logic
  if (user.twoFactorEnabled) {
      if (!code) {
          return sendResponse(res, 200, '2FA Code Required', { require2FA: true });
      }

      const verified = speakeasy.totp.verify({
          secret: user.twoFactorSecret!,
          encoding: 'base32',
          token: code
      });
      
      let backupUsed = false;
      if (!verified) {
           const userWithBackup = await User.findById(user._id).select('+twoFactorBackupCodes');
           if (userWithBackup?.twoFactorBackupCodes && userWithBackup.twoFactorBackupCodes.includes(code)) {
               backupUsed = true;
               userWithBackup.twoFactorBackupCodes = userWithBackup.twoFactorBackupCodes.filter(c => c !== code);
               await userWithBackup.save();
           } else {
               return sendResponse(res, 401, 'Invalid 2FA Code');
           }
      }
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // PARSE DEVICE INFO
  const ua = new UAParser(req.headers['user-agent']).getResult();
  // Simplified IP handling
  let ip = req.ip || '127.0.0.1';
  if (ip === '::1') ip = '127.0.0.1';
  
  const geo = geoip.lookup(ip);
  const location = geo ? `${geo.city}, ${geo.country}` : 'Unknown Location';

  // Generate tokens
  const refreshToken = generateRefreshToken(user._id);

  // CREATE SESSION
  const session = await Session.create({
      user: user._id,
      token: refreshToken,
      device: ua.device.model ? `${ua.device.vendor || ''} ${ua.device.model}` : 'Desktop', 
      browser: `${ua.browser.name || 'Unknown'} ${ua.browser.version || ''}`.trim(),
      os: `${ua.os.name || 'Unknown'} ${ua.os.version || ''}`.trim(),
      ipAddress: ip,
      location: location,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  const accessToken = generateAccessToken(user._id, user.role, session._id);

  // Set Cookies
  const sameSiteOption: 'none' | 'lax' | 'strict' = process.env.NODE_ENV === 'production' ? 'none' : 'lax';
  const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteOption
  };
  
  res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 15 * 60 * 1000)
  });
  
  res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  sendResponse(res, 200, 'Login successful', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: true // Assuming active check passed
  },
    accessToken,
    refreshToken,
  });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return sendResponse(res, 400, 'Refresh token required');
  }

  // Verify session/token in DB
  const session = await Session.findOne({ token: refreshToken });
  if (!session || !session.isValid) {
      if (session) await Session.deleteOne({ _id: session._id }); // Cleanup invalid
    return sendResponse(res, 401, 'Invalid refresh token');
  }

  // Verify expiration
  if (session.expiresAt.getTime() < Date.now()) {
    await Session.deleteOne({ _id: session._id });
    return sendResponse(res, 401, 'Refresh token expired');
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    // Pass session._id to access token
    const accessToken = generateAccessToken(payload.userId, 'user', session._id); 
    
    // Update last activity
    session.lastActivity = new Date();
    await session.save();

    sendResponse(res, 200, 'Token refreshed', { accessToken });
  } catch (error) {
    return sendResponse(res, 401, 'Invalid refresh token');
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await Session.deleteOne({ token: refreshToken });
  }
  
  // Also clear cookie if used
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  sendResponse(res, 200, 'Logged out successfully');
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // We return 200 even if user doesn't exist for security (prevent enumeration)
    return sendResponse(res, 200, 'If an account with that email exists, we have sent a password reset link.');
  }

  // Generate random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token to store in DB
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save({ validateBeforeSave: false });

  try {
    await emailService.sendPasswordResetEmail(user.email, resetToken); // Send unhashed token
    
    sendResponse(res, 200, 'If an account with that email exists, we have sent a password reset link.');
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    return sendResponse(res, 500, 'There was an error sending the email. Try again later!');
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  if (!token || !password) {
      return sendResponse(res, 400, "Token and new password required");
  }

  // Hash provided token to compare with DB
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return sendResponse(res, 400, 'Token is invalid or has expired');
  }

  // Set new password
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(password, salt);
  
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Send success email
  try {
      await emailService.sendPasswordResetSuccessEmail(user.email); // Fixed call
  } catch (err) {
      console.error("Failed to send reset success email", err);
  }

  sendResponse(res, 200, 'Password updated successfully! Please log in.');
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    return sendResponse(res, 400, 'Verification token is required');
  }

  // Hash token to compare with DB (wait, checking signup: stored as plain hex? Let's check signup.)
  // Signup: verificationToken = crypto.randomBytes(32).toString('hex');
  // It is NOT hashed in signup. It IS hashed in forgotPassword.
  // Let's stick to plain token for verification as per signup implementation.

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return sendResponse(res, 400, 'Token is invalid or has expired');
  }

  user.emailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  sendResponse(res, 200, 'Email verified successfully');
};

export const resendVerification = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authorized', 401);

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    if (user.emailVerified) {
        return sendResponse(res, 400, 'Email is already verified');
    }

    // Rate limit check could be here or middleware. 
    // Implementing strict 1 minute limit using DB could be complex without a field.
    // relying on route rate limiter for IP.
    // But we can check if a token exists and was created recently? 
    // verificationTokenExpires is 24h from creation. 
    // If we want 1 min limit, we might need a `lastVerificationSent` field or just use the limiter middleware.
    // I will use middleware in routes.

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    try {
        await emailService.sendVerificationEmail(user.email, verificationToken);
    } catch (err) {
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
        return sendResponse(res, 500, 'Failed to send verification email');
    }

    sendResponse(res, 200, 'Verification email sent');
};
