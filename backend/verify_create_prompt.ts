import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:5000/api/v1';
const TEST_EMAIL = `frontend_sim_${Date.now()}@test.com`;
const PASSWORD = 'password123';

const run = async () => {
    try {
        // 1. Login
        console.log('Logging in...');
        // First create user if not exists (signup)
        let token;
        try {
            const signupRes = await axios.post(`${API_URL}/auth/signup`, {
                name: 'Frontend Sim',
                email: TEST_EMAIL,
                password: PASSWORD
            });
            token = signupRes.data.data.accessToken;
        } catch (e) {
            // Login if exists
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                 email: TEST_EMAIL,
                 password: PASSWORD
            });
            token = loginRes.data.data.accessToken;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Simulate Frontend Payload (Tags as array, Status/Priority set)
        console.log('Creating Prompt...');
        const payload = {
            title: 'Frontend Created Prompt',
            description: 'Created via simulation script matching frontend logic.',
            status: 'draft',
            priority: 'medium',
            tags: ['frontend', 'react', 'simulation']
        };

        const createRes = await axios.post(`${API_URL}/prompts`, payload, { headers });
        console.log('Prompt Created:', createRes.data.data);

        if (createRes.data.data.title !== payload.title) throw new Error('Title mismatch');
        if (createRes.data.data.tags.length !== 3) throw new Error('Tags mismatch');

        console.log('SUCCESS: Backend accepts Frontend payload structure.');

    } catch (error: any) {
        console.error('FAILED:', error.response?.data || error.message);
    }
};

run();
