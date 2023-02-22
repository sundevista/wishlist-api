import * as process from 'process';

export default () => ({
  database: {
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  },
  cors: {
    allowedOrigin: process.env.CORS_ALLOWED_ORIGIN,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  }
});
