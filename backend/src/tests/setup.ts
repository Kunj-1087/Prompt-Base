import mongoose from 'mongoose';

beforeAll(async () => {
    const mongoUri = process.env.DATABASE_URL_TEST || 'mongodb://localhost:27017/prompt_base_test';
    
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    }
});

afterEach(async () => {
    // Optional: Clear collections between tests if needed (or just drop DB at end)
    // const collections = mongoose.connection.collections;
    // for (const key in collections) {
    //    await collections[key].deleteMany({});
    // }
});
