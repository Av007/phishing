import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessToken, RegisterRequestDto } from './types';
import { LogService } from '@libs/log';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly logService: LogService,
  ) {}

  async validateUser(email: string, password: string): Promise<unknown> {
    const user = await this.userService.findOneByEmail(email);
    this.logService.debug(JSON.stringify(user));
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    this.logService.log(`Successfully authenticated`);

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(user: RegisterRequestDto): Promise<AccessToken> {
    const payload = { email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: RegisterRequestDto): Promise<void> {
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }

    await this.userService.create(user);
  }

  async me(req: { user: { email: string } }) {
    const email = req.user?.email;
    if (!email) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOneByEmail(email);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
