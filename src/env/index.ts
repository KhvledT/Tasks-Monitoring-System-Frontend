import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000'),
  DEV: z.boolean().default(false),
  PROD: z.boolean().default(true),
});

const getEnv = () => {
  const rawEnv = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  };

  const parsed = envSchema.safeParse(rawEnv);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment variables');
  }

  return {
    apiUrl: parsed.data.VITE_API_BASE_URL,
    isDev: parsed.data.DEV,
    isProd: parsed.data.PROD,
  };
};

export const ENV = getEnv();
export type EnvConfig = typeof ENV;
