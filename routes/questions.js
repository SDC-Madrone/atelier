const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res, next) => {
  db.query('SELECT * from questions', [], (err, result) => {
    if (err) {
      return next(err);
    }
    res.send(result.rows[0]);
  });
});

module.exports = router;
