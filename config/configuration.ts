import * as process from 'process';

export default () => ({
  postgres: {
    type: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  cors: {
    allowedOrigin: process.env.CORS_ALLOWED_ORIGIN,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpirationTime: +process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExpirationTime: +process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  },
});
