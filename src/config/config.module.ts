import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { appConfig, jwtConfig, databaseConfig } from './index';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, jwtConfig, databaseConfig],
            envFilePath: '.env',
        }),
    ],
    exports: [NestConfigModule],
})
export class ConfigModule {}
