\c q_and_a;

COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
From '/Users/adamklingbaum/Documents/coding/hack_reactor/sdc/sdc-madrone-api-qa/data/raw-data/questions.csv'
DELIMITER ','
csv header;




