const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config);

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
};
