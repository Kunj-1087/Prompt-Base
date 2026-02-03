import axios from 'axios';
import mongoose from 'mongoose';
import Session from './src/models/session.model';
import User from './src/models/user.model';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:5000/api/v1';
const TEST_EMAIL = `session_test_${Date.now()}@example.com`;
const PASSWORD = 'password123';

const run = async () => {
    try {
        const uri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/prompt-base';
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // 1. Signup (Creates Session? We updated signup to create session?)
        // Let's check auth.controller. Yes we did.
        console.log('1. Signing up...');
        const signupRes = await axios.post(`${API_URL}/auth/signup`, {
            name: 'Session Test',
            email: TEST_EMAIL,
            password: PASSWORD
        });
        const token1 = signupRes.data.data.accessToken;
        const headers1 = { Authorization: `Bearer ${token1}` };

        // 2. Get Sessions
        console.log('2. Get Sessions (User 1)...');
        const sessions1 = await axios.get(`${API_URL}/sessions`, { headers: headers1 });
        console.log(`   Found ${sessions1.data.data.length} sessions`);
        if (sessions1.data.data.length !== 1) throw new Error('Expected 1 session');

        // 3. Login again (Simulate another device/session)
        console.log('3. Login again...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: TEST_EMAIL,
            password: PASSWORD
        });
        const token2 = loginRes.data.data.accessToken;
        const headers2 = { Authorization: `Bearer ${token2}` };

        // 4. Get Sessions again
        console.log('4. Get Sessions (User 1)...');
        const sessions2 = await axios.get(`${API_URL}/sessions`, { headers: headers2 });
        console.log(`   Found ${sessions2.data.data.length} sessions`);
        if (sessions2.data.data.length !== 2) throw new Error('Expected 2 sessions');

        // 5. Revoke First Session (using ID from list)
        // We need to identify which is which. token2 is current for headers2.
        const sessionToRevoke = sessions2.data.data.find((s: any) => !s.isCurrent);
        if (sessionToRevoke) {
            console.log(`5. Revoking session ${sessionToRevoke.id}...`);
            await axios.delete(`${API_URL}/sessions/${sessionToRevoke.id}`, { headers: headers2 });
            
            const sessions3 = await axios.get(`${API_URL}/sessions`, { headers: headers2 });
            console.log(`   Found ${sessions3.data.data.length} sessions`);
            if (sessions3.data.data.length !== 1) throw new Error('Expected 1 session after revocation');
        }

        // 6. Revoke All (Logout all)
        console.log('6. Revoke All...');
        // Create another dummy session first to test "revoke OTHER" vs "revoke ALL"?
        // Endpoint is DELETE /sessions/all => revokes all EXCEPT current.
        // Let's create one more login.
        await axios.post(`${API_URL}/auth/login`, { email: TEST_EMAIL, password: PASSWORD });
        
        // Now we have current (token2) + new one. Total 2.
        const sessions4 = await axios.get(`${API_URL}/sessions`, { headers: headers2 });
        // Wait, creating new login generated token3. token2 is technically still valid until revoked?
        // Yes, access token is valid. But refresh token?
        // Let's assume sessions are valid.
        console.log(`   (Pre-revoke-all) Found ${sessions4.data.data.length} sessions`);

        await axios.delete(`${API_URL}/sessions/all`, { headers: headers2 });
        const sessionsFinal = await axios.get(`${API_URL}/sessions`, { headers: headers2 });
        console.log(`   (Post-revoke-all) Found ${sessionsFinal.data.data.length} sessions`);
        
        // Should rely on "revoke others" logic in controller.
        // If logic is "revoke all except current", should stay 1 (current).
        if (sessionsFinal.data.data.length !== 1) throw new Error('Expected 1 session (current) after revoke-all');

        console.log('ALL TESTS PASSED');

        // Cleanup
        await User.deleteOne({ email: TEST_EMAIL });
        await Session.deleteMany({ user: sessionsFinal.data.data[0].user }); // cleanup sessions? user delete doesn't cascade yet?
        // Schema doesn't have cascade delete usually in Mongoose unless middleware added.
        // Manual cleanup.
        const user = await User.findOne({ email: TEST_EMAIL });
        if (user) await Session.deleteMany({ user: user._id });

    } catch (error: any) {
        console.error('TEST FAILED:', error.response?.data || error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
