import {
  Body,
  Controller,
  Headers,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TypeOrmValidationErrorFilter } from '../utils/exceptions/type-orm-validation-error.filter';

import { AuthService } from './auth.service';
import { SWAGGER_AUTH_SUMMARY } from './auth.constants';
import { CreateUserDto } from '../models/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { UserWithTokensDto } from '../models/user/dto/user-with-tokens.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UserData } from '../models/user/decorator/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: SWAGGER_AUTH_SUMMARY.REGISTRATION })
  @ApiCreatedResponse({ type: UserWithTokensDto })
  @ApiBody({ type: CreateUserDto })
  @ApiBearerAuth('JWT')
  @UseFilters(TypeOrmValidationErrorFilter)
  @Post('registration')
  public async registration(
    @Body() createUserDto: CreateUserDto,
    @Headers() headers: string,
  ): Promise<UserWithTokensDto> {
    return this.authService.registration(createUserDto, headers['user-agent']);
  }

  @ApiOperation({ summary: SWAGGER_AUTH_SUMMARY.LOGIN })
  @ApiCreatedResponse({ type: UserWithTokensDto })
  @ApiBody({ type: LoginDto })
  @Post('login')
  public async login(
    @Body() loginData: LoginDto,
    @Headers() headers: string,
  ): Promise<UserWithTokensDto> {
    return this.authService.login(loginData, headers['user-agent']);
  }

  @ApiOperation({ summary: SWAGGER_AUTH_SUMMARY.LOGOUT })
  @ApiBody({ type: LogoutDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  public async logout(
    @Body() logoutDto: LogoutDto,
    @UserData('userId') userId: string,
    @UserData('accessToken') accessToken: string,
  ): Promise<void> {
    return this.authService.logout(userId, accessToken, logoutDto.refreshToken);
  }

  @ApiOperation({ summary: 'check' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('check')
  public async check(
    @UserData('userId') userId: string,
    @UserData('accessToken') accessToken: string,
  ): Promise<string> {
    return userId + ' === ' + accessToken;
  }
}
