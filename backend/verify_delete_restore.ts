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
                name: 'Delete Tester',
                email: `delete_${Date.now()}@test.com`,
                password: 'password123'
            });
        });
        
        const token = loginRes.data.data.accessToken;
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create Prompt
        console.log('Creating Prompt for Delete Test...');
        const createRes = await axios.post(`${API_URL}/prompts`, {
             title: 'To Be Deleted',
             status: 'draft',
             priority: 'low',
             tags: ['delete_test']
        }, { headers });
        const id = createRes.data.data._id;

        // 3. Delete Prompt
        console.log('Deleting Prompt...');
        await axios.delete(`${API_URL}/prompts/${id}`, { headers });
        
        // 4. Verify Deleted (Get should fail or return 404 if we filter out deleted)
        // Controller filters `isDeleted: false`, so it should return 404
        console.log('Verifying Deletion...');
        try {
            await axios.get(`${API_URL}/prompts/${id}`, { headers });
            throw new Error('Prompt should be not found');
        } catch (e: any) {
            if (e.response?.status !== 404) throw e;
            console.log('Prompt successfully hidden (404)');
        }

        // 5. Restore Prompt
        console.log('Restoring Prompt...');
        const restoreRes = await axios.post(`${API_URL}/prompts/${id}/restore`, {}, { headers });
        if (restoreRes.data.data.isDeleted !== false) throw new Error('Restore failed');

        // 6. Verify Restore
        console.log('Verifying Restoration...');
        const getRes = await axios.get(`${API_URL}/prompts/${id}`, { headers });
        if (getRes.data.data._id === id) console.log('Prompt successfully restored');

        console.log('SUCCESS: Delete and Restore Logic Verified');

    } catch (error: any) {
        console.error('FAILED:', error.response?.data || error.message);
    }
};

run();
