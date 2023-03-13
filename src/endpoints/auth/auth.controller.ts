import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from '../../decorators/public.decorator';
import { TokenPayload } from "./dto/token-payload";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req): Promise<{access_token: string}> {
    return this.authService.login(req.user);
  }

  @Get('me')
  async me(@Req() req): Promise<TokenPayload> {
    return req.user;
  }
}
