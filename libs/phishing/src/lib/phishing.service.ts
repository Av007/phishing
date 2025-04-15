import { Db, ObjectId, WithId } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';
import { SearchQueryDto } from './phishing';
import { Phishing } from './phishing.schema';

@Injectable()
export class PhishingService {
  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

  async create(createDto: Phishing): Promise<Phishing> {
    const entity = await this.db.collection('Phishing').insertOne(createDto);

    return {
      ...createDto,
      _id: entity.insertedId,
    };
  }

  async update(phishing: Phishing): Promise<void> {
    await this.db
      .collection<Phishing>('Phishing')
      .updateOne(
        { trackId: phishing.trackId },
        { $set: { status: phishing.status } }
      );
  }

  async find(id: string): Promise<WithId<Phishing> | null> {
    return this.db
      .collection<Phishing>('Phishing')
      .findOne({ _id: new ObjectId(id) });
  }

  async findByTrackId(trackId: string): Promise<WithId<Phishing> | null> {
    return this.db
      .collection<Phishing>('Phishing')
      .findOne({ trackId });
  }

  async findAll(
    filter: Partial<Document>,
    pagination: SearchQueryDto,
  ): Promise<Document[]> {
    return this.db
      .collection<Document>('Phishing')
      .find(filter)
      .skip(Number(pagination.skip) || 0)
      .limit(Number(pagination.limit) || 0)
      .toArray();
  }
}
