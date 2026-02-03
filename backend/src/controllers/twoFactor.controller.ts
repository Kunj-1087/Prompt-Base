import { Request, Response } from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import User from '../models/user.model';
import { sendResponse } from '../utils/response';
import { AppError } from '../utils/AppError';
import crypto from 'crypto';

// @desc    Setup 2FA - Generate Secret
// @route   POST /api/v1/2fa/setup
// @access  Private
export const setup2FA = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authorized', 401);

    const secret = speakeasy.generateSecret({
        name: `Prompt-Base (${req.user.email})`
    });

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    // Temporarily store secret (not enabled yet)
    user.twoFactorSecret = secret.base32;
    await user.save();

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

    sendResponse(res, 200, '2FA Secret generated', {
        secret: secret.base32,
        qrCode: qrCodeUrl
    });
};

// @desc    Verify 2FA Setup
// @route   POST /api/v1/2fa/verify-setup
// @access  Private
export const verifySetup = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authorized', 401);
    const { token } = req.body;

    const user = await User.findById(req.user.id).select('+twoFactorSecret');
    if (!user) throw new AppError('User not found', 404);

    if (!user.twoFactorSecret) {
        throw new AppError('2FA not initialized. Please run setup first.', 400);
    }

    const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token
    });

    if (!verified) {
        throw new AppError('Invalid token', 400);
    }

    user.twoFactorEnabled = true;
    
    // Generate backup codes
    const backupCodes = Array(5).fill(null).map(() => crypto.randomBytes(4).toString('hex'));
    user.twoFactorBackupCodes = backupCodes; // TODO: Hash these in production
    
    await user.save();

    sendResponse(res, 200, '2FA Enabled successfully', { backupCodes });
};

// @desc    Disable 2FA
// @route   POST /api/v1/2fa/disable
// @access  Private
export const disable2FA = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authorized', 401);
    const { token } = req.body; // Require token to disable for security

    const user = await User.findById(req.user.id).select('+twoFactorSecret');
    if (!user) throw new AppError('User not found', 404);

    if (!user.twoFactorEnabled) {
        return sendResponse(res, 400, '2FA is already disabled');
    }

    const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret!,
        encoding: 'base32',
        token
    });

    if (!verified) {
         throw new AppError('Invalid token. Cannot disable 2FA.', 400);
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.twoFactorBackupCodes = undefined;
    await user.save();

    sendResponse(res, 200, '2FA Disabled successfully');
};
