import { Inject, Injectable } from '@nestjs/common';
import { SearchQueryDto } from './phishing';
import { Phishing } from './phishing.schema';
import { Db } from 'mongodb';

@Injectable()
export class PhishingService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

  async create(createDto: Phishing): Promise<Phishing> {
    const entity = await this.db.collection('Phishing').insertOne(createDto);

    return {
      ...createDto,
      _id: entity.insertedId
    }
  }

  async findAll(filter: Partial<Document>, pagination: SearchQueryDto): Promise<Document[]> {
    return this.db.collection<Document>('Phishing')
      .find(filter)
      .limit(pagination.limit || -1)
      .skip(pagination.skip || 0)
      .toArray();
  }
}
