const express = require('express');
const questionRouter = require('./questions');
const answerRouter = require('./answers');

const router = express.Router();

router.use('/questions', questionRouter);
router.use('/answers', answerRouter);

module.exports = router;
