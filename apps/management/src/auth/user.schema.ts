import { IsEmail, IsMongoId, IsOptional, IsString, MinLength, MaxLength, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';

export class User {
  @IsMongoId()
  @IsOptional()
  _id?: ObjectId;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;
}
