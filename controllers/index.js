const express = require('express');
const questionRouter = require('./question');
const answerRouter = require('./answer');

const router = express.Router();

router.use('/questions', questionRouter);
router.use('/answers', answerRouter);

module.exports = router;
