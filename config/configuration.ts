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
  cors: {
    allowedOrigin: process.env.CORS_ALLOWED_ORIGIN,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  },
});
