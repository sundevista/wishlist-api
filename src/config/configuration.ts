import * as process from 'process';

export default () => ({
  database: {
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  }
});
