import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';

export type RedisClient = Redis;

const redisFactory = async (
  configService: ConfigService,
): Promise<RedisClient> => {
  const { port, host } = configService.get('redis');
  return new Redis({ port, host });
};

export const redisProviders: Provider = {
  useFactory: redisFactory,
  inject: [ConfigService],
  provide: REDIS_CLIENT,
};
