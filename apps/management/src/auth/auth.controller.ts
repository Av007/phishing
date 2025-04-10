import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginResponseDTO, RegisterRequestDto, RegisterResponseDTO } from './types';
import { User } from '../user/user.schema';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: Request & { user: User }
  ): Promise<LoginResponseDTO> {
    if (!req.user) {
      throw new BadRequestException('Authentication failed');
    }

    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDto
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/logout')
  async logout(@Request() req: Request & {logout: () => void}) {
    return req.logout();
  }
}
