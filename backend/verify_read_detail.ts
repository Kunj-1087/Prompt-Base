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
                name: 'Detail Tester',
                email: `detail_${Date.now()}@test.com`,
                password: 'password123'
            });
        });
        
        const token = loginRes.data.data.accessToken;
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create a prompt
        console.log('Creating Prompt for Detail Test...');
        const createRes = await axios.post(`${API_URL}/prompts`, {
             title: 'Detail Test Prompt',
             description: 'Testing the single get endpoint',
             status: 'active',
             priority: 'high',
             tags: ['detail_test']
        }, { headers });
        
        const createdId = createRes.data.data._id;
        console.log('Created ID:', createdId);

        // 3. Get Single Prompt
        console.log('Fetching Single Prompt...');
        const getRes = await axios.get(`${API_URL}/prompts/${createdId}`, { headers });
        
        const fetchedPrompt = getRes.data.data;
        if (fetchedPrompt._id !== createdId) throw new Error('ID mismatch');
        if (fetchedPrompt.title !== 'Detail Test Prompt') throw new Error('Title mismatch');

        console.log('SUCCESS: Get Single Prompt Verified');

        // 4. Test 404
        console.log('Testing 404...');
        try {
            await axios.get(`${API_URL}/prompts/65b123456789012345678900`, { headers });
            throw new Error('Should have failed with 404');
        } catch (e: any) {
            if (e.response?.status === 404) console.log('Passed 404 check');
            else throw e;
        }

    } catch (error: any) {
        console.error('FAILED:', error.response?.data || error.message);
    }
};

run();
