import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model';
import Item from './models/item.model';
import Activity from './models/activity.model';
import config from './config/env';

dotenv.config();

const seedDashboard = async () => {
  try {
    await mongoose.connect(config.DATABASE_URL); // Using DATABASE_URL directly as env.ts has logic (but accessing internal config object structure might fail if compiled differently, relying on standard mongoose connect if env logic is tricky via script)
    // Actually, let's just use the process.env.DATABASE_URL since we loaded dotenv
    // Or better, let's use the config if we can import it reliably. 
    // `config` from `./config/env` exports a default object.
    
    console.log('MongoDB Connected');

    // Find the admin user or any user to attach data to
    const user = await User.findOne({ email: 'admin@example.com' }); // Ensure this matches previous seed
    
    if (!user) {
        console.error('User not found. Please run seed_admin.ts first.');
        process.exit(1);
    }

    console.log(`Seeding data for user: ${user.email}`);

    // Create Items
    await Item.deleteMany({ user: user._id });
    await Item.create([
        { user: user._id, title: 'My First Project', status: 'active' },
        { user: user._id, title: 'Draft Prompt Idea', status: 'draft' },
        { user: user._id, title: 'Archived Project', status: 'inactive' },
    ]);
    console.log('Items seeded');

    // Create Activity Logs
    await Activity.deleteMany({ user: user._id });
    await Activity.create([
        { user: user._id, action: 'Created project "My First Project"', createdAt: new Date() },
        { user: user._id, action: 'Logged in', createdAt: new Date(Date.now() - 1000 * 60 * 60) }, // 1 hour ago
        { user: user._id, action: 'Updated profile', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) }, // 2 hours ago
    ]);
    console.log('Activities seeded');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding dashboard:', error);
    process.exit(1);
  }
};

seedDashboard();
