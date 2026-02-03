import axios from 'axios';
import mongoose from 'mongoose';
import User from './src/models/user.model';
import Prompt from './src/models/prompt.model';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:5000/api/v1';
const TEST_EMAIL = `prompt_test_${Date.now()}@example.com`;
const PASSWORD = 'password123';

const run = async () => {
    try {
        const uri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/prompt-base';
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // 1. Signup & Login
        console.log('1. Auth Setup...');
        const signupRes = await axios.post(`${API_URL}/auth/signup`, {
            name: 'Prompt Test',
            email: TEST_EMAIL,
            password: PASSWORD
        });
        const token = signupRes.data.data.accessToken;
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create Prompt
        console.log('2. Create Prompt...');
        const createRes = await axios.post(`${API_URL}/prompts`, {
            title: 'Test Prompt',
            description: 'This is a test prompt description.',
            status: 'draft',
            priority: 'high',
            tags: ['test', 'demo'],
            metadata: { version: 1 }
        }, { headers });
        const promptId = createRes.data.data._id;
        console.log(`   Created Prompt ID: ${promptId}`);
        if (!promptId) throw new Error('Failed to create prompt');

        // 3. Get Prompts (List)
        console.log('3. Get Prompts...');
        const listRes = await axios.get(`${API_URL}/prompts`, { headers });
        console.log(`   Found ${listRes.data.data.length} prompts`);
        if (listRes.data.data.length !== 1) throw new Error('Expected 1 prompt');

        // 4. Get Prompt by ID
        console.log('4. Get Prompt by ID...');
        const getRes = await axios.get(`${API_URL}/prompts/${promptId}`, { headers });
        if (getRes.data.data.title !== 'Test Prompt') throw new Error('Title mismatch');

        // 5. Update Prompt
        console.log('5. Update Prompt...');
        const updateRes = await axios.patch(`${API_URL}/prompts/${promptId}`, {
            title: 'Updated Prompt Title',
            status: 'active'
        }, { headers });
        if (updateRes.data.data.title !== 'Updated Prompt Title') throw new Error('Update failed');

        // 6. Delete Prompt (Soft)
        console.log('6. Delete Prompt...');
        await axios.delete(`${API_URL}/prompts/${promptId}`, { headers });

        // 7. Verify Delete (List should be empty)
        const listFinal = await axios.get(`${API_URL}/prompts`, { headers });
        console.log(`   Found ${listFinal.data.data.length} prompts after delete`);
        if (listFinal.data.data.length !== 0) throw new Error('Expected 0 prompts (soft deleted excluded)');

        // 8. Verify DB (Soft Deleted)
        const dbPrompt = await Prompt.findById(promptId);
        if (!dbPrompt?.isDeleted) throw new Error('DB object not marked isDeleted');

        console.log('ALL TESTS PASSED');

        // Cleanup
        await User.deleteOne({ email: TEST_EMAIL });
        await Prompt.deleteMany({ user: signupRes.data.data.user.id });

    } catch (error: any) {
        console.error('TEST FAILED:', error.response?.data || error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
