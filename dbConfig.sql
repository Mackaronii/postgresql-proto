CREATE TABLE survey
(surveyID INTEGER NOT NULL,
 userID INTEGER NOT NULL,
 surveyName TEXT NOT NULL,
 isOpen BOOLEAN NOT NULL,
 PRIMARY KEY (surveyID));


CREATE TABLE question
(questionID INTEGER NOT NULL,
 surveyID INTEGER NOT NULL,
 questionOrder INTEGER NOT NULL,
 questionType TEXT NOT NULL,
 questionPrompt TEXT NOT NULL,
 PRIMARY KEY (questionID));


CREATE TABLE users
(userID INTEGER NOT NULL,
 username TEXT NOT NULL,
 PRIMARY KEY (userID));


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