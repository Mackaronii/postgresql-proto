CREATE TABLE survey
(surveyID SERIAL PRIMARY KEY,
 userID INTEGER NOT NULL,
 surveyName TEXT NOT NULL,
 isOpen BOOLEAN NOT NULL);


CREATE TABLE question
(questionID SERIAL PRIMARY KEY,
 surveyID INTEGER NOT NULL,
 questionOrder INTEGER NOT NULL,
 questionType TEXT NOT NULL,
 questionPrompt TEXT NOT NULL);


CREATE TABLE users
(userID SERIAL PRIMARY KEY,
 username TEXT NOT NULL);


CREATE TABLE answer
(answerID SERIAL PRIMARY KEY,
 surveyID INTEGER NOT NULL,
 questionID INTEGER NOT NULL,
 answerText TEXT NOT NULL);


ALTER TABLE question  
  ADD CONSTRAINT FK_question_TO_survey
    FOREIGN KEY (surveyID)
    REFERENCES survey(surveyID);

ALTER TABLE survey
  ADD CONSTRAINT FK_survey_TO_users
    FOREIGN KEY (userID)
    REFERENCES users(userID);

ALTER TABLE answer
  ADD CONSTRAINT FK_answer_TO_survey
    FOREIGN KEY (surveyID)
    REFERENCES survey(surveyID);

ALTER TABLE answer
  ADD CONSTRAINT FK_answer_TO_question
    FOREIGN KEY (questionID)
    REFERENCES question(questionID);