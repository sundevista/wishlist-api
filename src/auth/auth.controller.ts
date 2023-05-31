import { Body, Controller, Get, Post, Req, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { RequestWithUser } from './interface/request-with-user.interface';
import { ValidationErrorFilter } from '../utils/exceptions/validation-error.filter';
import { CreateUserDto } from '../models/user/dto/create-user.dto';
import { LoginData } from './interface/login-data.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  async login(@Body() loginData: LoginData) {
    return this.authService.signin(loginData);
  }

  @Public()
  @UseFilters(new ValidationErrorFilter())
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Get('me')
  async me(@Req() req: RequestWithUser) {
    return req.user;
  }
}
