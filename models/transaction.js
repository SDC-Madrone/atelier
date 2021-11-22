const db = require('../db');
const answer = require('./answer');
const photo = require('./photo');

module.exports.createAnswer = async (data, photos) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const answerResult = await answer.create(data, client);
    await photo.create(photos, answerResult.rows[0].id, client);
    return client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e; // we do want to create an exception for the controller to handle, so that it knows to send a 500
  } finally {
    client.release();
  }
};
