import {
  IsString,
  IsEmail,
  IsEnum,
  IsDate,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';

export enum PhishingStatus {
  PENDING = 'pending',
  SENDING = 'sending',
  CLICKED = 'clicked',
  FAILED = 'failed',
}

export class Phishing {
  @IsMongoId()
  @IsOptional()
  _id?: ObjectId;

  @IsString()
  trackId!: string;

  @IsEmail()
  email!: string;

  @IsEnum(PhishingStatus)
  status!: PhishingStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  clickedAt?: Date;

  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  sentAt?: Date;
}
