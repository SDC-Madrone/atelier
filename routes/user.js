const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res, next) => {
  db.query('SELECT * from users', [], (err, result) => {
    console.log('received');
    if (err) {
      return next(err);
    }
    res.send(result.rows[0]);
  });
});

module.exports = router;
