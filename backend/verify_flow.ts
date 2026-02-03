import axios from 'axios';
import mongoose from 'mongoose';
import User from './src/models/user.model';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:5000/api/v1';
const TEST_EMAIL = `verify_test_${Date.now()}@example.com`;

const run = async () => {
  try {
    // Connect to DB to read token
    const uri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/prompt-base';
    await mongoose.connect(uri);
    console.log('Connected to DB');

    // 1. Signup
    console.log('1. Signing up user...' + TEST_EMAIL);
    await axios.post(`${API_URL}/auth/signup`, {
      name: 'Verify Test',
      email: TEST_EMAIL,
      password: 'password123'
    });
    console.log('Signup successful');

    // 2. Get User from DB
    const user = await User.findOne({ email: TEST_EMAIL }).select('+verificationToken');
    if (!user || !user.verificationToken) {
        throw new Error('User not found or token missing');
    }
    console.log('Token retrieved from DB:', user.verificationToken);

    // 3. Verify Email
    console.log('3. Verifying email...');
    const verifyRes = await axios.post(`${API_URL}/auth/verify-email/${user.verificationToken}`);
    console.log('Verification response:', verifyRes.data.message);

    // 4. Check status
    const verifiedUser = await User.findById(user._id);
    if (verifiedUser?.emailVerified) {
        console.log('PASS: User is strictly verified in DB');
    } else {
        throw new Error('FAIL: User is NOT verified in DB');
    }

    // 5. Cleanup
    await User.deleteOne({ _id: user._id });
    console.log('Cleanup done');

  } catch (error: any) {
    console.error('TEST FAILED:', error.response?.data || error.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();
