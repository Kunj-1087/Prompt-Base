import request from 'supertest';
import app from '../../app';
import User from '../../models/user.model';
import mongoose from 'mongoose';

describe('Auth API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/v1/auth/signup', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
      // Check cookies
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should not register a user with existing email', async () => {
       await User.create({
         name: 'Existing User',
         email: 'test@example.com',
         password: 'Password123!',
         emailVerified: true
       });

       const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
        });

        expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
      it('should login successfully with correct credentials', async () => {
          // Create user first (password hashing happens in pre-save)
          const user = new User({
              name: 'Login User',
              email: 'login@example.com',
              password: 'Password123!',
              emailVerified: true
          });
          await user.save();

          const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'login@example.com',
                password: 'Password123!'
            });
          
          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
          expect(response.headers['set-cookie']).toBeDefined();
      });

      it('should fail with incorrect password', async () => {
        const user = new User({
            name: 'Login User',
            email: 'login@example.com',
            password: 'Password123!',
            emailVerified: true
        });
        await user.save();

        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({
              email: 'login@example.com',
              password: 'WrongPassword'
          });
        
        expect(response.status).toBe(401);
    });
  });
});
