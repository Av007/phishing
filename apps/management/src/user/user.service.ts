import { Injectable } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { LogService } from '@libs/log';
import { DatabaseService } from '@libs/database';
import { CreateUserDto, UpdateUserDto } from './types';

@Injectable()
export class UserService {
  private collectionName = 'users';
  private db: Db;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logService: LogService
  ) {
    this.db = this.databaseService.getDb();
  }

  async create(createUserDto: CreateUserDto) {
    const result = await this.db.collection(this.collectionName).insertOne(createUserDto);
    this.logService.log(`User created: ${result.insertedId}`);
    return { _id: result.insertedId, ...createUserDto };
  }

  async findAll() {
    return this.db.collection(this.collectionName).find().toArray();
  }

  async findOne(id: string) {
    return this.db.collection(this.collectionName).findOne({ _id: new ObjectId(id) });
  }

  async findOneByEmail(email: string) {
    return this.db.collection(this.collectionName).findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const result = await this.db
      .collection(this.collectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateUserDto },
        { returnDocument: 'after' }
      );
    if (result.value) this.logService.log(`User updated: ${id}`);
    return result.value;
  }

  async remove(id: string) {
    const result = await this.db.collection(this.collectionName).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      this.logService.log(`User deleted: ${id}`);
      return true;
    }
    return false;
  }
}
