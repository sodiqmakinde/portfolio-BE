'use strict';
const path = require('path');

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres');

  const ssl =
    env.bool('DATABASE_SSL', false) && {
      rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
    };

  const connections = {
    postgres: {
      connection: {
        connectionString: env('DATABASE_URL'),
        ssl,
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
      },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
