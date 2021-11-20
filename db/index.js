const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config);

module.exports = {
  query: async (text, params) => {
    // const start = Date.now();
    const res = await pool.query(text, params);
    // const duration = Date.now() - start;
    // console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  },
  getClient: async () => {
    const client = await pool.connect();
    const { query } = client;
    const { release } = client;
    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!');
      console.error(
        `The last executed query on this client was: ${client.lastQuery}`
      );
    }, 5000);
    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };
    client.release = () => {
      clearTimeout(timeout);
      client.query = query;
      client.release = release;
      return release.apply(client);
    };
    return client;
  },
};
