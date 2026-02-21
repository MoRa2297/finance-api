import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  graphqlPlayground: process.env.NODE_ENV !== 'production',
  corsOrigins: process.env.CORS_ORIGINS ?? '',
}));
