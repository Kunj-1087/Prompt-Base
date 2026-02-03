import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:5000/api/v1';

const run = async () => {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
             email: 'frontend_sim_1715000000000@test.com', 
             password: 'password123'
        }).catch(async () => {
             return axios.post(`${API_URL}/auth/signup`, {
                name: 'Params Tester',
                email: `params_${Date.now()}@test.com`,
                password: 'password123'
            });
        });
        
        const token = loginRes.data.data.accessToken;
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create items to ensure enough for limits
        console.log('Ensuring sufficient items...');
        // Just create 5 more to be safe
        for (let i = 0; i < 5; i++) {
             await axios.post(`${API_URL}/prompts`, {
                 title: `Limit Test ${i}`,
                 status: 'active',
                 priority: 'medium',
                 tags: ['limit_test']
             }, { headers });
        }

        // 3. Test Limit 10
        console.log('Testing Limit 10...');
        const res10 = await axios.get(`${API_URL}/prompts?limit=10`, { headers });
        if (res10.data.data.pagination.limit !== 10) throw new Error('Limit 10 failed');
        if (res10.data.data.data.length > 10) throw new Error('Returned > 10 items');

        // 4. Test Limit 5
        console.log('Testing Limit 5...');
        const res5 = await axios.get(`${API_URL}/prompts?limit=5`, { headers });
        if (res5.data.data.pagination.limit !== 5) throw new Error('Limit 5 failed');
        if (res5.data.data.data.length > 5) throw new Error('Returned > 5 items');

        // 5. Test Page 2 with Limit 5
        console.log('Testing Page 2, Limit 5...');
        const resPage2 = await axios.get(`${API_URL}/prompts?limit=5&page=2`, { headers });
        if (resPage2.data.data.pagination.page !== 2) throw new Error('Page 2 failed');

        console.log('SUCCESS: Params (Page/Limit) Verified');

    } catch (error: any) {
        console.error('FAILED:', error.response?.data || error.message);
    }
};

run();
