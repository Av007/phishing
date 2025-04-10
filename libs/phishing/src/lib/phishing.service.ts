import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '@libs/database';
import { SearchQueryDto } from './phishing';
import { Phishing } from './phishing.schema';

@Injectable()
export class PhishingService {
    constructor(@Inject() private databaseService: DatabaseService) {}

  async create(createDto: Phishing): Promise<Phishing> {
    const db = this.databaseService.getDb();
    const entity = await db.collection('Phishing').insertOne(createDto);

    return {
      ...createDto,
      _id: entity.insertedId
    }
  }

  async findAll(filter: Partial<Document>, pagination: SearchQueryDto): Promise<Document[]> {
    const db = this.databaseService.getDb();
    return db.collection<Document>('Phishing')
      .find(filter)
      .limit(pagination.limit || -1)
      .skip(pagination.skip || 0)
      .toArray();
  }
}
