import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from '@prisma-client/prisma.module';
import { AuthModule } from '@auth/auth.module';
import { LookupModule } from '@lookup/lookup.module';
import { AppResolver } from './app.resolver';
import {CategoryModule} from "@category/category.module";
import {BankAccountModule} from "@bank-account/bank-account.module";
import {CardAccountModule} from "@card-account/card-account.module";

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
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
    CardAccountModule
  ],
  providers: [AppResolver],
})
export class AppModule {}
