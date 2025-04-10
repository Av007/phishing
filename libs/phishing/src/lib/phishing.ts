import { Type } from "class-transformer";
import { IsArray, IsEmail, IsInt, IsOptional, Min } from "class-validator";

export class SearchQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}

export class PhishingCreateDto {
  @IsArray()
  @IsEmail({}, { each: true }) // validates each email in the array
  emails!: string[];
}
