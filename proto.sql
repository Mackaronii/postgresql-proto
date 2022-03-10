DROP TABLE survey;

CREATE TABLE survey
    (survey_id INTEGER PRIMARY KEY,
     user_id INTEGER NOT NULL,
     survey_name VARCHAR NOT NULL,
     is_open BOOLEAN NOT NULL);