DROP DATABASE IF EXISTS q_and_a;

CREATE DATABASE q_and_a;

\c q_and_a;
-- psql -U postgres < server/db/schema.sql

-- ---
-- Table 'questions'
--
-- ---
DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  question_body VARCHAR(1000) NOT NULL,
  question_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  question_helpfulness INTEGER NOT NULL DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  id_users INTEGER NOT NULL
);

-- ---
-- Table 'answers'
--
-- ---

DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
  answer_id SERIAL PRIMARY KEY,
  id_questions INTEGER NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date timestamp NOT NULL,
  helpfulness INTEGER NOT NULL DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT false,
  id_users INTEGER NOT NULL
);

-- ---
-- Table 'photos'
--
-- ---

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  photo_id SERIAL PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  `id_answers` INTEGER NOT NULL,
  PRIMARY KEY (`photo_id`)
);

-- ---
-- Table 'users'
--
-- ---

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL UNIQUE,
  PRIMARY KEY (`user_id`)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE questions ADD FOREIGN KEY (id_users) REFERENCES users (user_id) ON DELETE CASCADE;
ALTER TABLE answers ADD FOREIGN KEY (id_questions) REFERENCES questions (question_id) ON DELETE CASCADE;
ALTER TABLE answers ADD FOREIGN KEY (id_users) REFERENCES users (user_id) ON DELETE CASCADE;
ALTER TABLE photos ADD FOREIGN KEY (id_answers) REFERENCES answers (answer_id) ON DELETE CASCADE;