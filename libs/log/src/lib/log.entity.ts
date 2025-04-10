import { IsString, IsDate, IsOptional } from 'class-validator';

export type LogDocument = Log;

export class Log {
  @IsString()
  message: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}
