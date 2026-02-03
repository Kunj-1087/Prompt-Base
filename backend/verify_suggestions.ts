import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Use 127.0.0.1 to avoid potential localhost IPv6 issues
const API_URL = 'http://127.0.0.1:5000/api/v1';

const run = async () => {
    try {
        console.log(`Targeting ${API_URL}`);
        
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
             email: 'frontend_sim_1715000000000@test.com', 
             password: 'password123'
        }).catch(async (err) => {
             // Try signup if login fails (first run cleanup?)
             console.log('Login failed, trying signup...', err.message);
             return axios.post(`${API_URL}/auth/signup`, {
                name: 'Suggestions Tester',
                email: `suggest_${Date.now()}@test.com`,
                password: 'password123'
            });
        });
        
        const token = loginRes.data.data.accessToken;
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create Prompts for Suggestions
        // We need titles that start with same prefix to test autocomplete
        console.log('Creating Prompts...');
        await axios.post(`${API_URL}/prompts`, { title: 'React Hooks Guide', status: 'active', tags: ['react'] }, { headers });
        await axios.post(`${API_URL}/prompts`, { title: 'React Context API', status: 'active', tags: ['react'] }, { headers });
        await axios.post(`${API_URL}/prompts`, { title: 'React Router v6', status: 'active', tags: ['react'] }, { headers });
        await axios.post(`${API_URL}/prompts`, { title: 'Vue Composition API', status: 'active', tags: ['vue'] }, { headers });

        // 3. Test Suggestions "Rea"
        console.log('Fetching suggestions for "Rea"...');
        const resRea = await axios.get(`${API_URL}/prompts/suggestions?q=Rea`, { headers });
        const suggestions = resRea.data.data; // It returns array of strings directly in data? No, sendResponse wraps in { status, message, data }
        
        console.log('Suggestions received:', suggestions);

        if (!Array.isArray(suggestions)) throw new Error('Response data is not an array');
        if (suggestions.length < 3) throw new Error('Expected at least 3 suggestions for "Rea"');
        if (!suggestions.includes('React Hooks Guide')) throw new Error('Missing "React Hooks Guide"');
        if (suggestions.includes('Vue Composition API')) throw new Error('Should not include "Vue Composition API"');

        // 4. Test Limit
        // limit is hardcoded to 5 in controller.

        console.log('SUCCESS: Suggestions Verified');

    } catch (error: any) {
        console.error('FAILED DETAILS:', error.response?.status, error.response?.data);
        console.error('ERROR MESSAGE:', error.message);
        process.exit(1);
    }
};

run();
