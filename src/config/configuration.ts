import * as process from 'process';

export default () => ({
  database: {
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  }
});
