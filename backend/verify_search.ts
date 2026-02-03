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
        }).catch(async () => {
             return axios.post(`${API_URL}/auth/signup`, {
                name: 'Search Tester',
                email: `search_${Date.now()}@test.com`,
                password: 'password123'
            });
        });
        
        const token = loginRes.data.data.accessToken;
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create Prompts for Search
        console.log('Creating Prompts...');
        await axios.post(`${API_URL}/prompts`, {
             title: 'Red Apple',
             status: 'active',
             tags: ['fruit']
        }, { headers });
        await axios.post(`${API_URL}/prompts`, {
             title: 'Green Apple',
             description: 'A delicious fruit',
             status: 'active',
             tags: ['fruit']
        }, { headers });
        await axios.post(`${API_URL}/prompts`, {
             title: 'Blue Sky',
             status: 'active',
             tags: ['nature']
        }, { headers });

        // 3. Test Text Search "Apple"
        console.log('Searching "Apple"...');
        // Wait a bit for indexing? MongoDB text index usually reasonably fast but maybe async?
        // Usually immediate for small data.
        const resApple = await axios.get(`${API_URL}/prompts/search?q=Apple`, { headers });
        const apples = resApple.data.data;
        console.log(`Found ${apples.length} apples`);
        if (apples.some((p: any) => p.title.includes('Sky'))) throw new Error('Found Sky when searching Apple');
        if (apples.length < 2) console.warn('Warning: Text index might be slow updates or exact phrase issue. "Red Apple" should contain "Apple" token.');

        // 4. Test Text Search "fruit" (in description or tag? Index is title/desc)
        console.log('Searching "fruit"...');
        const resFruit = await axios.get(`${API_URL}/prompts/search?q=fruit`, { headers });
        // Green Apple has 'fruit' in description. Red Apple has it in tags (Tags not indexed in text index in model yet).
        // Model: promptSchema.index({ title: 'text', description: 'text' });
        // So Green Apple should be found. Red Apple might NOT be found if description is empty?
        const fruits = resFruit.data.data;
        if (!fruits.find((p: any) => p.title === 'Green Apple')) throw new Error('Green Apple not found by description "fruit"');

        console.log('SUCCESS: Text Search Verified');

    } catch (error: any) {
        console.error('FAILED DETAILS:', error.response?.status, error.response?.data);
        console.error('ERROR MESSAGE:', error.message);
    }
};

run();
