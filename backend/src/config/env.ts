import dotenv from 'dotenv';
import path from 'path';

// Load .env file
const envPath = path.resolve(__dirname, '../../.env');
const result = dotenv.config({ path: envPath });
console.log('Environment path:', envPath);
if (result.error) {
  console.error('Dotenv error:', result.error);
} else {
  console.log('Dotenv loaded successfully');
}

interface Config {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  CORS_ORIGIN: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  FROM_EMAIL: string;
}

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const config: Config = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: parseInt(getEnv('PORT', '5000'), 10),
  DATABASE_URL: getEnv('DATABASE_URL'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
  CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
  SMTP_HOST: getEnv('SMTP_HOST'),
  SMTP_PORT: parseInt(getEnv('SMTP_PORT', '587'), 10),
  SMTP_USER: getEnv('SMTP_USER'),
  SMTP_PASS: getEnv('SMTP_PASS'),
  FROM_EMAIL: getEnv('FROM_EMAIL'),
};

export default config;
