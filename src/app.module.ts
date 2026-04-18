import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from '@prisma-client/prisma.module';
import { AuthModule } from '@auth/auth.module';
import { LookupModule } from '@lookup/lookup.module';
import { AppResolver } from './app.resolver';
import { CategoryModule } from '@category/category.module';
import { BankAccountModule } from '@bank-account/bank-account.module';
import { CardAccountModule } from '@card-account/card-account.module';
import { TransactionCoreModule } from '@transaction-core/transaction-core.module';
import { TransactionModule } from '@transaction/transaction.module';
import { RecurringModule } from '@recurring/recurring.module';
import { SchedulerModule } from '@scheduler/scheduler.module';
import { HealthModule } from './health/health.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: configService.get<boolean>('app.graphqlPlayground'),
        context: ({ req }) => ({ req }),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    LookupModule,
    CategoryModule,
    BankAccountModule,
    CardAccountModule,
    TransactionCoreModule,
    TransactionModule,
    RecurringModule,
    SchedulerModule,
    HealthModule,
  ],
  providers: [
    AppResolver,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
