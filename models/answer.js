const db = require('../db');

module.exports.getAnswersByQuestionId = async (questionId, page, count) => {
  const queryText = `
      SELECT
        answers.id AS answer_id,
        answers.body AS body,
        to_timestamp(answers.date_written/1000) AS date,
        answers.answerer_name AS answered_name,
        answers.helpful AS helpfulness,
        array(SELECT url FROM photos WHERE photos.answer_id=answers.id) as photos
      FROM answers WHERE question_id=$1 AND reported=false
      ORDER BY answers.date_written DESC
      LIMIT $2
      OFFSET (($3 - 1) * $2)`;
  const queryValues = [questionId, count, page];
  const result = await db.query(queryText, queryValues);
  return result;
};

module.exports.addAnswerHelpfulById = async (answerId) => {
  const queryText = `
    UPDATE answers
    SET helpful = helpful + 1
    WHERE id=$1`;
  const queryValues = [answerId];
  const result = await db.query(queryText, queryValues);
  return result;
};

module.exports.reportAnswerById = async (answerId) => {
  const queryText = `
    UPDATE answers
    SET reported = true
    WHERE id=$1`;
  const queryValues = [answerId];
  const result = await db.query(queryText, queryValues);
  return result;
};
