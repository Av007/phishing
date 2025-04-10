import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import { AccessToken, RegisterRequestDto } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
  
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword as Omit<User, 'password'>;
  }

  async login(user: RegisterRequestDto): Promise<AccessToken> {
    const payload = { email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }

    await this.userService.create(user);
    return this.login(user);
  }
}
