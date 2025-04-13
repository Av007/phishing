import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginResponseDTO, RegisterRequestDto } from './types';
import { JwtGuard } from './guards/jwt.guard';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: RegisterRequestDto): Promise<LoginResponseDTO> {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() registerBody: RegisterRequestDto): Promise<string> {
    await this.authService.register(registerBody);
    return 'ok';
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@Request() req: any) {
    return this.authService.me(req);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req: Request & { logout: () => void }) {
    return req.logout();
  }
}
