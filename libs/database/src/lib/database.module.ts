import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoClient, Db } from 'mongodb';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService): Promise<Db> => {
        try {
          const uri = configService.get<string>('DATABASE_URL', 'mongodb://127.0.0.1');
          const dbName = configService.get<string>('DATABASE_NAME', 'test');
          const client = await MongoClient.connect(uri);
          return client.db(dbName);
        } catch (e) {
          const error = e as Error;
          throw new Error(`MongoDB connection failed: ${error.message}`);
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
