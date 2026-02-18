import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma';
import { AuthModule } from './auth';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
