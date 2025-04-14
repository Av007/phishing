import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SearchQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(-1)
  @Type(() => Number)
  limit?: number = 0;
}

export class PhishingCreateDto {
  @IsString()
  emails!: string;
}
