import * as process from 'process';

export default () => ({
  database: {
    config: {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true,
    },
  },
  cors: {
    allowedOrigin: process.env.CORS_ALLOWED_ORIGIN,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  },
  static: {
    source: './static',
    avatarDestination: './static/public/avatar',
  },
});
