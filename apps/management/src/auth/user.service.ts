import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { LogService } from '@libs/log';
import { CreateUserDto, UpdateUserDto } from './types';

@Injectable()
export class UserService {
  private collectionName = 'Users';

  constructor(
    @Inject('DATABASE_CONNECTION') private db: Db,
    private readonly logService: LogService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const result = await this.db.collection(this.collectionName).insertOne({
      ...createUserDto,
      password: hashedPassword,
      createdAt: new Date(),
    });
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
