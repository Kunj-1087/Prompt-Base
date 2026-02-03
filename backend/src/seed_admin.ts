import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { UserRole } from './models/user.model';
import config from './config/env';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.MONGO_URI || process.env.DATABASE_URL as string);
    console.log('MongoDB Connected');

    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists');
      if (existingAdmin.role !== UserRole.ADMIN) {
        existingAdmin.role = UserRole.ADMIN;
        await existingAdmin.save();
        console.log('Updated existing user to Admin');
      }
    } else {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'password123',
        role: UserRole.ADMIN,
        emailVerified: true,
      });
      console.log('Admin created successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
