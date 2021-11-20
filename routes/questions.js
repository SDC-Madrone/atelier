const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { product_id: productId } = req.query;
  const { page, count } = req.query;
  const queryText = `
      SELECT
        questions.id AS question_id,
        questions.body AS question_body,
        to_timestamp(questions.date_written/1000) AS question_date,
        questions.asker_name AS asker_name,
        questions.helpful AS question_helpfulness,
        questions.reported AS reported,
        (
          SELECT json_object_agg(id, answer)
              FROM (
                SELECT
                  answers.id AS id,
                  answers.body AS body,
                  to_timestamp(answers.date_written/1000) AS date,
                  answers.answerer_name AS answerer_name,
                  answers.helpful AS helpfulness,
                  array(SELECT url FROM photos WHERE photos.answer_id=answers.id) as photos
                FROM answers WHERE answers.question_id = questions.id
              ) as answer
        ) AS answers
      FROM questions WHERE product_id=$1 AND reported=false
      ORDER BY questions.date_written DESC
      LIMIT $2
      OFFSET (($3 - 1) * $2)`;
  const queryValues = [productId, count, page];
  await db
    .query(queryText, queryValues)
    .then((response) => {
      res.status(200).json({
        product_id: productId,
        page,
        count,
        results: response.rows,
      });
    })
    .catch(() => res.status(400).send());
});

router.put('/:question_id/helpful', (req, res, next) => {
  const { question_id: questionId } = req.params;
  const queryText = `
    UPDATE questions
    SET helpful = helpful + 1
    WHERE id=$1`;
  const queryValues = [questionId];
  db.query(queryText, queryValues)
    .then(() => {
      res.status(204).send();
    })
    .catch(() => res.status(400).send());
});
router.put('/:answer_id/helpful', (req, res, next) => {
  const { answer_id: answerId } = req.params;
  const queryText = `
    UPDATE answers
    SET helpful = helpful + 1
    WHERE id=$1`;
  const queryValues = [answerId];
  db.query(queryText, queryValues)
    .then(() => {
      res.status(204).send();
    })
    .catch(() => res.status(400).send());
});
module.exports = router;
