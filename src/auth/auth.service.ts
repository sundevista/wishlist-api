import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../models/user/user.service';
import { USER_VALIDATION_REGEXPS } from '../models/user/user.constants';
import { CreateUserDto } from '../models/user/dto/create-user.dto';
import { User } from '../models/user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './token/token.service';
import { AuthCacheService } from './auth-cache.service';
import { UserWithTokensDto } from '../models/user/dto/user-with-tokens.dto';
import { plainToInstance } from 'class-transformer';
import { AUTH_VALIDATION_ERRORS } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
  ) {}

  public async registration(
    createUserDto: CreateUserDto,
    userAgent: string,
  ): Promise<UserWithTokensDto> {
    const user = await this.userService.createUser(createUserDto);
    const tokens = await this.tokenService.composeTokens(user.id);
    await this.tokenService.saveUserTokens(user.id, tokens, userAgent);
    return plainToInstance(UserWithTokensDto, { ...user, ...tokens });
  }

  public async login(
    loginDto: LoginDto,
    userAgent: string,
  ): Promise<UserWithTokensDto> {
    const { username, password } = loginDto;
    let user: User;

    if (USER_VALIDATION_REGEXPS.USER_EMAIL_PATTERN.test(username)) {
      user = await this.userService.findOneByEmail(username);
    } else {
      user = await this.userService.findOneByUsername(username);
    }

    if (!user) throw new UnauthorizedException();

    const passwordDecryption = await this.userService.isPasswordMatches(
      password,
      user.password,
    );

    if (!passwordDecryption)
      throw new BadRequestException(
        AUTH_VALIDATION_ERRORS.WRONG_CREDENTIALS_PROVIDED,
      );

    const tokens = await this.tokenService.composeTokens(user.id);
    await this.tokenService.saveUserTokens(user.id, tokens, userAgent);

    return plainToInstance(UserWithTokensDto, { ...user, ...tokens });
  }

  public async logout(
    userId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      await Promise.all([
        this.tokenService.deleteRefreshToken(refreshToken),
        this.authCacheService.removeAccessTokenFromRedis(userId, accessToken),
      ]);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
