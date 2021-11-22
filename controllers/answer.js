const express = require('express');
const { answer } = require('../models');

const router = express.Router();

router.put('/:answer_id/helpful', async (req, res) => {
  const { answer_id: answerId } = req.params;

  try {
    const result = await answer.addAnswerHelpfulById(answerId);
    if (!result.rowCount) {
      return res.status(400).send('No matching entries found.');
    }

    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

router.put('/:answer_id/report', async (req, res) => {
  const { answer_id: answerId } = req.params;

  try {
    const result = await answer.reportAnswerById(answerId);
    if (!result.rowCount) {
      return res.status(400).send('No matching entries found.');
    }
    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

module.exports = router;
