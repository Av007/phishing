import { UUID } from 'crypto';
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

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
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;
}
