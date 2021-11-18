\c q_and_a;

\copy questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) from '/Users/adamklingbaum/Documents/coding/hack_reactor/sdc/sdc-madrone-api-qa/data/raw-data/questions.csv' delimiter ',' csv header;

SELECT setval(pg_get_serial_sequence('questions', 'id'), (SELECT MAX(id) FROM questions), true);

\copy answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) from '/Users/adamklingbaum/Documents/coding/hack_reactor/sdc/sdc-madrone-api-qa/data/raw-data/answers.csv' delimiter ',' csv header;
SELECT setval(pg_get_serial_sequence('answers', 'id'), (SELECT MAX(id) FROM answers), true);

\copy photos(id, answer_id, url) from '/Users/adamklingbaum/Documents/coding/hack_reactor/sdc/sdc-madrone-api-qa/data/raw-data/answers_photos.csv' delimiter ',' csv header;
SELECT setval(pg_get_serial_sequence('photos', 'id'), (SELECT MAX(id) FROM photos), true);
