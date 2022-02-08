const express = require('express');
const { question, answer, transaction } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const { product_id: productId } = req.query;
  const { page, count } = req.query;

  if (!productId) {
    return res.status(400).send('No product_id provided.');
  }

  try {
    const result = await question.getQuestionsByProductId(
      productId,
      page,
      count
    );

    result.rows.forEach((q) => {
      if (!q.answers) return;
      Object.keys(q.answers).forEach((a) => {
        q.answers[a].date = new Date(q.answers[a].date).toISOString();
      });
    });

    return res.status(200).json({
      product_id: productId,
      page: Number(page),
      count: Number(count),
      results: result.rows,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

router.get('/:question_id/answers', async (req, res) => {
  const { question_id: questionId } = req.params;
  const { page, count } = req.query;
  if (!questionId) {
    return res.status(400).send('No question_id provided.');
  }
  try {
    const result = await answer.getAnswersByQuestionId(questionId, page, count);

    return res.status(200).json({
      question: questionId,
      page: Number(page),
      count: Number(count),
      results: result.rows,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

router.put('/:question_id/helpful', async (req, res) => {
  const { question_id: questionId } = req.params;

  try {
    const result = await question.addQuestionHelpfulById(questionId);

    if (!result.rowCount) {
      return res.status(400).send('No matching entries found.');
    }

    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

router.put('/:question_id/report', async (req, res) => {
  const { question_id: questionId } = req.params;
  try {
    const result = await question.reportQuestionById(questionId);
    if (!result.rowCount) {
      return res.status(400).send('No matching entries found');
    }
    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

router.post('/', async (req, res) => {
  const { body, name, email, product_id: productId } = req.body;

  if (!(body && name && email && productId)) {
    return res.status(400).send('Incomplete request.');
  }

  const data = { body, name, email, productId };
  data.date = Date.now();

  try {
    await question.create(data);
    return res.status(201).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

router.post('/:question_id/answers', async (req, res) => {
  const { question_id: questionId } = req.params;
  const { body, name, email } = req.body;
  const { photos } = req.body;

  if (!(body && name && email)) {
    return res.status(400).send('Incomplete request');
  }

  const data = { body, name, email, questionId };
  data.date = Date.now();

  try {
    await transaction.createAnswer(data, photos);
    return res.status(201).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

module.exports = router;
