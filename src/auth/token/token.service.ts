import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { JwtSignOptionEnum } from './token.constants';
import { jwtTokensInterface } from './interfaces/tokens.interface';
import { RefreshToken } from './entities/refresh-token.entity';
import { AUTH_VALIDATION_ERRORS } from '../auth.constants';
import { AuthCacheService } from '../auth-cache.service';
import { PayloadTokenInterface } from './interfaces/payload-token.interface';

@Injectable()
export class TokenService {
  private [JwtSignOptionEnum.AccessToken]: JwtSignOptions;
  private [JwtSignOptionEnum.RefreshToken]: JwtSignOptions;

  constructor(
    @InjectRepository(RefreshToken)
    private tokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authCacheService: AuthCacheService,
  ) {
    this.configureJwtSignOptions();
  }

  public async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.tokenRepository.delete({ refreshToken });
  }

  public async findToken(refreshToken: string): Promise<RefreshToken> {
    return this.tokenRepository.findOne({ where: { refreshToken } });
  }

  public async saveRefreshToken(
    refreshToken: string,
    userId: string,
    userAgent: string,
  ): Promise<void> {
    await this.tokenRepository.save({ refreshToken, userId, userAgent });
  }

  public async updateRefreshTokenEntity(
    id: string,
    refreshToken: string,
  ): Promise<void> {
    await this.tokenRepository.update({ id }, { refreshToken });
  }

  private configureJwtSignOptions() {
    const {
      accessTokenSecret,
      accessTokenExpirationTime,
      refreshTokenSecret,
      refreshTokenExpirationTime,
    } = this.configService.get('jwt');

    this[JwtSignOptionEnum.AccessToken] = {
      secret: accessTokenSecret,
      expiresIn: accessTokenExpirationTime,
    };

    this[JwtSignOptionEnum.RefreshToken] = {
      secret: refreshTokenSecret,
      expiresIn: refreshTokenExpirationTime,
    };
  }

  public composeToken(
    userId: string,
    jwtSignOptionsName: JwtSignOptionEnum,
  ): string {
    return this.jwtService.sign({ userId }, this[jwtSignOptionsName]);
  }

  public composeAccessToken(userId: string): string {
    return this.composeToken(userId, JwtSignOptionEnum.AccessToken);
  }

  public composeRefreshToken(userId: string): string {
    return this.composeToken(userId, JwtSignOptionEnum.RefreshToken);
  }

  public async composeTokens(userId: string): Promise<jwtTokensInterface> {
    return {
      accessToken: this.composeAccessToken(userId),
      refreshToken: this.composeRefreshToken(userId),
    };
  }

  public async verifyToken(token: string): Promise<{ userId: string }> {
    return this.jwtService.verifyAsync(
      token,
      this[JwtSignOptionEnum.AccessToken],
    );
  }

  private async findAndVerifyToken(refreshToken: string): Promise<string> {
    const token = await this.findToken(refreshToken);

    if (!token)
      throw new BadRequestException(AUTH_VALIDATION_ERRORS.TOKEN_NOT_FOUND);

    return token.userId;
  }

  public async updateAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const userId = await this.findAndVerifyToken(refreshToken);
    const accessToken = this.composeAccessToken(userId);
    await this.authCacheService.saveAccessTokenToRedis(userId, accessToken);
    return { accessToken };
  }

  public async updateRefreshToken(
    refreshToken: string,
  ): Promise<jwtTokensInterface> {
    const userId = await this.findAndVerifyToken(refreshToken);
    const tokens = await this.composeTokens(userId);
    const oldRefreshTokenEntity = await this.findToken(refreshToken);

    await Promise.all([
      this.authCacheService.saveAccessTokenToRedis(userId, tokens.accessToken),
      this.updateRefreshTokenEntity(
        oldRefreshTokenEntity.id,
        tokens.refreshToken,
      ),
    ]);

    return tokens;
  }

  public async saveUserTokens(
    userId: string,
    tokens: jwtTokensInterface,
    userAgent: string,
  ): Promise<void> {
    const { accessToken, refreshToken } = tokens;

    await Promise.all([
      this.saveRefreshToken(refreshToken, userId, userAgent),
      this.authCacheService.saveAccessTokenToRedis(userId, accessToken),
    ]);
  }

  public decodeToken(token: string): PayloadTokenInterface {
    return this.jwtService.decode(token) as PayloadTokenInterface;
  }
}
