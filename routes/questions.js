const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const client = await db.getClient();
  const { product_id, page, count } = req.query;
  let queryResult;
  try {
    await client.query('BEGIN');
    const queryText = `
      SELECT
        questions.id AS question_id,
        questions.body AS question_body,
        questions.date_written AS question_date,
        questions.asker_name AS asker_name,
        questions.helpful AS question_helpfulness,
        questions.reported AS reported,
        (
          SELECT json_object_agg(id, answer)
              FROM (
                SELECT
                  answers.id AS id,
                  answers.body AS body,
                  answers.date_written AS date,
                  answers.answerer_name AS answerer_name,
                  answers.helpful AS helpfulness,
                  array(SELECT url FROM photos WHERE photos.answer_id=answers.id) as photos
                FROM answers WHERE answers.question_id = questions.id
              ) as answer
        ) AS answers
      FROM questions WHERE product_id=$1 AND reported=false`;
    const queryValues = [product_id];
    queryResult = await client.query(queryText, queryValues);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    res.status(200).json({ product_id, results: queryResult.rows });
    client.release();
  }
});

module.exports = router;
