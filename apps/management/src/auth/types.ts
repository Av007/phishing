import { UUID } from 'crypto';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export type AccessToken = {
  access_token: string;
};

export type LoginResponseDTO = AccessToken;

export type RegisterResponseDTO = AccessToken;

export type AccessTokenPayload = {
  userId: UUID;
  email: string;
};

export class RegisterRequestDto {
  @IsEmail()
  @MinLength(6)
  @MaxLength(50)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

