interface Config {
  API_URL: string;
  APP_NAME: string;
  ENVIRONMENT: string;
}

const getEnv = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const config: Config = {
  API_URL: getEnv('VITE_API_URL', 'http://localhost:5000/api'),
  APP_NAME: getEnv('VITE_APP_NAME', 'Prompt-Base'),
  ENVIRONMENT: getEnv('VITE_ENVIRONMENT', 'development'),
};

export default config;
