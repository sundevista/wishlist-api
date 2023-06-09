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
      'jwt.accessTokenExpirationTime',
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
}
