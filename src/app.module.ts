import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from '@prisma-client/prisma.module';
import { AuthModule } from '@auth/auth.module';
import { LookupModule } from '@lookup/lookup.module';
import { CategoryModule } from '@category/category.module';
import { BankAccountModule } from '@bank-account/bank-account.module';
import { CardAccountModule } from '@card-account/card-account.module';
import { TransactionModule } from '@transaction/transaction.module';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProd =
          configService.get<string>('app.nodeEnv') === 'production';
        return {
          // In production use in-memory schema, in development write to disk
          autoSchemaFile: isProd ? true : 'src/schema.gql',
          sortSchema: true,
          playground: !isProd,
          context: ({ req }) => ({ req }),
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    LookupModule,
    CategoryModule,
    BankAccountModule,
    CardAccountModule,
    TransactionModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
