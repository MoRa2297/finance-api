import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { jwtConfig, databaseConfig } from './index';
import appConfig from '@config/app.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, databaseConfig],
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
