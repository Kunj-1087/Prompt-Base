import mongoose from 'mongoose';

beforeAll(async () => {
    const mongoUri = process.env.DATABASE_URL_TEST || 'mongodb://localhost:27017/prompt_base_test';
    
    // Connect to the test database
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
    }
});

afterAll(async () => {
    // Drop the test database and close connection
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    }
});

afterEach(async () => {
    // Clear all collections after each test to ensure isolation
    if (mongoose.connection.readyState !== 0) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    }
});
