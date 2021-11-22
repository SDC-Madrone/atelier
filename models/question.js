const db = require('../db');

module.exports.getQuestionsByProductId = async (questionId, page, count) => {
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
            FROM answers WHERE answers.question_id = questions.id and reported=false
        ) as answer
      ) AS answers
      FROM questions WHERE product_id=$1 AND reported=false
      ORDER BY questions.date_written DESC
      LIMIT $2
      OFFSET (($3 - 1) * $2)`;
  const queryValues = [questionId, count, page];
  const result = await db.query(queryText, queryValues);
  return result;
};

module.exports.setQuestionHelpfulById = async (questionId) => {
  const queryText = `
    UPDATE questions
    SET helpful = helpful + 1
    WHERE id=$1`;
  const queryValues = [questionId];
  const result = await db.query(queryText, queryValues);
  return result;
};

module.exports.reportQuestionById = async (questionId) => {
  const queryText = `
    UPDATE questions
    SET reported = true
    WHERE id=$1`;
  const queryValues = [questionId];
  const result = await db.query(queryText, queryValues);
  return result;
};
