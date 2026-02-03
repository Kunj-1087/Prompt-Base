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
                name: 'Update Tester',
                email: `update_${Date.now()}@test.com`,
                password: 'password123'
            });
        });
        
        const token = loginRes.data.data.accessToken;
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create Prompt
        console.log('Creating Prompt for Update Test...');
        const createRes = await axios.post(`${API_URL}/prompts`, {
             title: 'Original Title',
             description: 'Original Description',
             status: 'draft',
             priority: 'low',
             tags: ['update_test']
        }, { headers });
        const id = createRes.data.data._id;

        // 3. Update Prompt (PATCH)
        console.log('Updating Prompt...');
        const updatePayload = {
            title: 'Updated Title',
            status: 'active',
            priority: 'high'
        };

        const updateRes = await axios.patch(`${API_URL}/prompts/${id}`, updatePayload, { headers });
        const updated = updateRes.data.data;

        if (updated.title !== 'Updated Title') throw new Error('Title not updated');
        if (updated.status !== 'active') throw new Error('Status not updated');
        if (updated.description !== 'Original Description') throw new Error('Description changed unexpectedly');

        console.log('SUCCESS: Prompt Updated Correctly');

    } catch (error: any) {
        console.error('FAILED:', error.response?.data || error.message);
    }
};

run();
