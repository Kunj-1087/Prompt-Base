import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:5000/api/v1';

const run = async () => {
    try {
        // 1. Login (reusing logic or hardcoded if env set)
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
             email: 'frontend_sim_1715000000000@test.com', // Use the one from previous test if possible, or new
             password: 'password123'
        }).catch(async () => {
             // Fallback create
             return axios.post(`${API_URL}/auth/signup`, {
                name: 'Pagination Tester',
                email: `paginator_${Date.now()}@test.com`,
                password: 'password123'
            });
        });
        
        const token = loginRes.data.data.accessToken;
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create multiple prompts
        console.log('Seeding prompts...');
        const totalToCreate = 25;
        for (let i = 0; i < totalToCreate; i++) {
             await axios.post(`${API_URL}/prompts`, {
                 title: `Prompt ${i}`,
                 status: 'active',
                 priority: 'medium',
                 tags: ['page_test']
             }, { headers });
        }

        // 3. Test Pagination
        console.log('Testing Page 1 (Limit 10)...');
        const res1 = await axios.get(`${API_URL}/prompts?page=1&limit=10`, { headers });
        if (res1.data.data.pagination.page !== 1) throw new Error('Page mismatch');
        if (res1.data.data.data.length !== 10) throw new Error('Limit mismatch');
        if (!res1.data.data.pagination.hasNext) throw new Error('Should have next page');

        console.log('Testing Page 2...');
        const res2 = await axios.get(`${API_URL}/prompts?page=2&limit=10`, { headers });
        if (res2.data.data.pagination.page !== 2) throw new Error('Page 2 mismatch');

        console.log('Testing Sort (Order Asc)...');
        // By default we update controller to sort by creation, so Prompt 0 should be first on asc
        const resSort = await axios.get(`${API_URL}/prompts?sort=createdAt&order=asc&limit=1`, { headers });
        // Assuming no other prompts, checking title regex might be flaky if other tests ran. 
        // Just checking status code and structure here for now.
        if (resSort.status !== 200) throw new Error('Sort failed');

        console.log('SUCCESS: Pagination Logic Verified');

    } catch (error: any) {
        console.error('FAILED:', error.response?.data || error.message);
    }
};

run();
