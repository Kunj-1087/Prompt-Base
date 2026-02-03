// Env setup for Jest
process.env.NODE_ENV = 'test';
process.env.PORT = '5000';
process.env.DATABASE_URL = 'mongodb://localhost:27017/prompt_base_test';
process.env.DATABASE_URL_TEST = 'mongodb://localhost:27017/prompt_base_test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.SMTP_HOST = 'smtp.test.com';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = 'test-user';
process.env.SMTP_PASS = 'test-pass';
process.env.FROM_EMAIL = 'test@example.com';
