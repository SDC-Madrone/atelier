const db = require('../db');

module.exports.getAnswersByQuestionId = (
  questionId,
  page,
  count,
  client = db
) => {
  const queryText = `
      SELECT
        answers.id AS answer_id,
        answers.body AS body,
        to_timestamp(answers.date_written/1000) AS date,
        answers.answerer_name AS answerer_name,
        answers.helpful AS helpfulness,
        (
          SELECT json_agg(photo)
            FROM(
              SELECT
                photos.id,
                photos.url
              FROM photos where photos.answer_id=answers.id
            ) as photo
        ) as photos
      FROM answers WHERE question_id=$1 AND reported=false
      ORDER BY answers.date_written DESC
      LIMIT $2
      OFFSET (($3 - 1) * $2)`;
  const queryValues = [questionId, count, page];
  return client.query(queryText, queryValues); // delegates to db pool if no client provided
};

module.exports.addAnswerHelpfulById = (answerId, client = db) => {
  const queryText = `
    UPDATE answers
    SET helpful = helpful + 1
    WHERE id=$1`;
  const queryValues = [answerId];
  return client.query(queryText, queryValues); // delegates to db pool if no client provided
};

module.exports.reportAnswerById = (answerId, client = db) => {
  const queryText = `
    UPDATE answers
    SET reported = true
    WHERE id=$1`;
  const queryValues = [answerId];
  return client.query(queryText, queryValues); // delegates to db pool if no client provided
};

module.exports.create = (data, client = db) => {
  const { body, date, name, email, questionId } = data;
  const queryText = `
    INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id`;
  const queryValues = [questionId, body, date, name, email];
  return client.query(queryText, queryValues); // delegates to db pool if no client provided
};
