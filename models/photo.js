const format = require('pg-format');
const db = require('../db');

module.exports.create = (photos, answerId, client = db) => {
  const insertPhotos = photos.map((photo) => [answerId, photo]);
  const queryText = format(
    `
    INSERT INTO photos (answer_id, url)
    VALUES %L`,
    insertPhotos
  );
  return client.query(queryText);
};
