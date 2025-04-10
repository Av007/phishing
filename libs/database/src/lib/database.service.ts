import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private db: Db | null = null;
  private client: MongoClient;

  constructor(private readonly configService: ConfigService) {
    const uri =
      this.configService.get<string>('DATABASE_URL') ||
      'mongodb://localhost:27017';

    this.client = new MongoClient(uri);
  }

  async onModuleInit() {
    const uri =
      this.configService.get<string>('DATABASE_URL') ||
      'mongodb://localhost:27017';
    const dbName = this.configService.get<string>('DATABASE_NAME');

    this.client = new MongoClient(uri);
    await this.client.connect();
    this.db = this.client.db(dbName);
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return this.db;
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
