import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

describe('Auth API', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test123!'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('id');
      // Adjusted expectation to match actual response (accessToken/refreshToken)
      expect(response.body.data).toHaveProperty('accessToken');
    });
    
    it('should reject duplicate email', async () => {
      // First signup
      await request(app).post('/api/v1/auth/signup').send({
        name: 'Test',
        email: 'duplicate@example.com',
        password: 'Test123!'
      });
      
      // Duplicate signup
      const response = await request(app).post('/api/v1/auth/signup').send({
        name: 'Test2',
        email: 'duplicate@example.com',
        password: 'Test123!'
      });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    it('should reject weak password', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send({
        name: 'Test',
        email: 'test2@example.com',
        password: 'weak' // Too short (min 8)
      });
      
      expect(response.status).toBe(400);
    });
  });
  
  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await request(app).post('/api/v1/auth/signup').send({
        name: 'Login Test',
        email: 'login@example.com',
        password: 'Test123!'
      });
    });
    
    it('should login with correct credentials', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'login@example.com',
        password: 'Test123!'
      });
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('accessToken');
    });
    
    it('should reject incorrect password', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'login@example.com',
        password: 'WrongPassword123!'
      });
      
      expect(response.status).toBe(401);
    });
  });
});
