import { Body, Controller, Get, Post, Req, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../decorators/public.decorator';
import { RequestWithUser } from './interface/requestWithUser.interface';
import { ValidationErrorFilter } from '../../exceptions/validation-error.filter';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Req() req: RequestWithUser): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @Public()
  @UseFilters(new ValidationErrorFilter())
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signup(createUserDto);
  }

  @Get('me')
  async me(@Req() req: RequestWithUser) {
    return req.user;
  }
}
