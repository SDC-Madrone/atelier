const db = require('../db');

module.exports.getQuestionsByProductId = (
  questionId,
  page,
  count,
  client = db
) => {
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
              (
                SELECT json_agg(photo)
                  FROM(
                    SELECT
                      photos.id,
                      photos.url
                    FROM photos where photos.answer_id=answers.id
                  ) as photo
              ) as photos
            FROM answers WHERE answers.question_id=questions.id and answers.reported=false ORDER BY answers.date_written DESC
        ) as answer
      ) AS answers
      FROM questions WHERE questions.product_id=$1 AND questions.reported=false
      ORDER BY questions.date_written DESC
      LIMIT $2
      OFFSET (($3 - 1) * $2)`;
  const queryValues = [questionId, count, page];
  return client.query(queryText, queryValues);
};

module.exports.addQuestionHelpfulById = (questionId, client = db) => {
  const queryText = `
    UPDATE questions
    SET helpful = helpful + 1
    WHERE id=$1`;
  const queryValues = [questionId];
  return client.query(queryText, queryValues);
};

module.exports.reportQuestionById = (questionId, client = db) => {
  const queryText = `
    UPDATE questions
    SET reported = true
    WHERE id=$1`;
  const queryValues = [questionId];
  return client.query(queryText, queryValues);
};

module.exports.create = (data, client = db) => {
  const { productId, body, date, name, email } = data;
  const queryText = `
    INSERT INTO questions (product_id, body, date_written, asker_name, asker_email)
    VALUES ($1, $2, $3, $4, $5)`;
  const queryValues = [productId, body, date, name, email];
  return client.query(queryText, queryValues);
};
