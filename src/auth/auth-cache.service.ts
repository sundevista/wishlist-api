import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisService } from '../core/redis/redis.service';
import { REDIS_CONSTANTS } from './auth.constants';

@Injectable()
export class AuthCacheService {
  private readonly tokenExpirationTime: number;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.tokenExpirationTime = this.configService.get(
      'jwt.refreshTokenExpirationTime',
    );
  }

  public async saveAccessTokenToRedis(
    userId: string,
    accessToken: string,
  ): Promise<void> {
    const multi = this.redisService.multi();
    await this.redisService.sAdd(
      `${REDIS_CONSTANTS.USER_TOKEN}:${userId}`,
      accessToken,
      multi,
    );
    await this.redisService.expire(
      `${REDIS_CONSTANTS.USER_TOKEN}:${userId}`,
      this.tokenExpirationTime,
      multi,
    );
    await this.redisService.exec(multi);
  }

  public async removeAccessTokenFromRedis(
    userId: string,
    accessToken: string,
  ): Promise<void> {
    await this.redisService.sRem(
      `${REDIS_CONSTANTS.USER_TOKEN}:${userId}`,
      accessToken,
    );
  }

  public async isAccessTokenExist(
    userId: string,
    accessToken: string,
  ): Promise<boolean> {
    const userAccessTokens = await this.redisService.sMembers(
      `${REDIS_CONSTANTS.USER_TOKEN}:${userId}`,
    );
    return userAccessTokens.some((token: string) => token === accessToken);
  }

  public async saveCodeToRedis(
    mail: string,
    randomNumber: string,
  ): Promise<void> {
    const multi = this.redisService.multi();

    await this.redisService.sAdd(
      `${REDIS_CONSTANTS.USER_CODE}:${mail}`,
      randomNumber,
      multi,
    );
    await this.redisService.expire(
      `${REDIS_CONSTANTS.USER_CODE}:${mail}`,
      REDIS_CONSTANTS.CODE_EXPIRATION_TIME,
      multi,
    );

    await this.redisService.exec(multi);
  }

  public async isCodeExist(
    mail: string,
    randomNumber: string,
  ): Promise<boolean> {
    const userCode = await this.redisService.sMembers(
      `${REDIS_CONSTANTS.USER_CODE}:${mail}`,
    );

    return userCode.some((code: string) => code === randomNumber);
  }

  public async removeCodeFromRedis(
    mail: string,
    randomCode: string,
  ): Promise<void> {
    await this.redisService.sRem(
      `${REDIS_CONSTANTS.USER_CODE}:${mail}`,
      randomCode,
    );
  }
}
