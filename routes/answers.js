const express = require('express');
const db = require('../db');

const router = express.Router();

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

router.put('/:answer_id/report', (req, res, next) => {
  const { answer_id: answerId } = req.params;
  const queryText = `
    UPDATE answers
    SET reported = true
    WHERE id=$1`;
  const queryValues = [answerId];
  db.query(queryText, queryValues)
    .then(() => {
      res.status(204).send();
    })
    .catch(() => res.status(400).send());
});

module.exports = router;
