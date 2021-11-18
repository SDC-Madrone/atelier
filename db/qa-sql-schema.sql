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
  id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  product_id int NOT NULL,
  body varchar(1000) NOT NULL,
  date_written bigint NOT NULL,
  asker_name varchar(60) NOT NULL,
  asker_email text NOT NULL,
  reported boolean NULL DEFAULT false,
  helpful int NOT NULL DEFAULT 0
);

-- ---
-- Table 'answers'
--
-- ---

DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
  id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  question_id int NOT NULL,
  body varchar(1000) NOT NULL,
  date_written bigint NOT NULL,
  answerer_name varchar(60) NOT NULL,
  answerer_email text NOT NULL,
  reported boolean NOT NULL DEFAULT false,
  helpful int NOT NULL DEFAULT 0
);

-- ---
-- Table 'photos'
--
-- ---

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  answer_id int NOT NULL,
  url text NOT NULL
);


-- ---
-- Foreign Keys
-- ---

ALTER TABLE answers ADD FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE;
ALTER TABLE photos ADD FOREIGN KEY (answer_id) REFERENCES answers (id) ON DELETE CASCADE;