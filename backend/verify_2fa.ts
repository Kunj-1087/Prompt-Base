import axios from 'axios';
import mongoose from 'mongoose';
import User from './src/models/user.model';
import dotenv from 'dotenv';
import speakeasy from 'speakeasy';

dotenv.config();

const API_URL = 'http://localhost:5000/api/v1';
const TEST_EMAIL = `2fa_test_${Date.now()}@example.com`;
const PASSWORD = 'password123';

const run = async () => {
    try {
        const uri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/prompt-base';
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // 1. Signup
        console.log('1. Signing up...');
        await axios.post(`${API_URL}/auth/signup`, {
            name: '2FA Test',
            email: TEST_EMAIL,
            password: PASSWORD
        });

        // 2. Login to get token
        console.log('2. Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: TEST_EMAIL,
            password: PASSWORD
        });
        const token = loginRes.data.data.accessToken;
        const headers = { Authorization: `Bearer ${token}` };

        // 3. Setup 2FA
        console.log('3. Setup 2FA...');
        const setupRes = await axios.post(`${API_URL}/2fa/setup`, {}, { headers });
        const secret = setupRes.data.data.secret;
        console.log('   Secret:', secret);

        // 4. Verify Setup
        console.log('4. Verify Setup...');
        const code = speakeasy.totp({
            secret: secret,
            encoding: 'base32'
        });
        await axios.post(`${API_URL}/2fa/verify-setup`, { token: code }, { headers });
        console.log('   2FA Enabled');

        // 5. Login without code (Should require 2FA)
        console.log('5. Login without code...');
        const login2FA = await axios.post(`${API_URL}/auth/login`, {
            email: TEST_EMAIL,
            password: PASSWORD
        });
        if (login2FA.data.data.require2FA) {
            console.log('   PASS: 2FA Required signal received');
        } else {
            console.error('   FAIL: Did not ask for 2FA');
        }

        // 6. Login with code
        console.log('6. Login with code...');
        const codeLogin = speakeasy.totp({
            secret: secret,
            encoding: 'base32'
        });
        const finalLogin = await axios.post(`${API_URL}/auth/login`, {
            email: TEST_EMAIL,
            password: PASSWORD,
            code: codeLogin
        });
        
        if (finalLogin.data.data.accessToken) {
            console.log('   PASS: Login successful with code');
        } else {
            console.error('   FAIL: Login failed');
        }

        // Cleanup
        await User.deleteOne({ email: TEST_EMAIL });
        console.log('Cleanup done');

    } catch (error: any) {
        console.error('TEST FAILED:', error.response?.data || error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
