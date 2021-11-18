const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const client = await db.getClient();
  let response;
  try {
    await client.query('BEGIN');
    const queryText =
      'INSERT INTO questions(body, asker_name, user_id) VALUES ($1, $2, $3) RETURNING id';
    response = await client.query(queryText, ['review2', 'bindman', 1]);
    const insertAnswerText =
      'INSERT INTO answers(question_id, body, answerer_name, user_id) VALUES ($1, $2, $3, $4) RETURNING id';
    const insertAnswerValues = [response.rows[0].id, 'answer2', 'ted', 1];
    response = await client.query(insertAnswerText, insertAnswerValues);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
    res.status(201).send();
  }
});

module.exports = router;
