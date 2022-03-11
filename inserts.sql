--Insert a user
INSERT INTO users (userID, username) VALUES (1, 'Johnny');

--Insert a survey
INSERT INTO survey (surveyID, userID, surveyName, isOpen) VALUES (1, 1, 'Johnny''s Survey', true);

--Insert a question
INSERT INTO question (questionID, surveyID, questionOrder, questionType, questionPrompt) VALUES (1, 1, 1, 'open-ended', 'Is this an open-ended question?');

--Insert an answer
INSERT INTO answer (surveyID, questionID, answerText) VALUES (1, 1, 'my answer');

--Insert many answers
INSERT INTO answer (surveyID, questionID, answerText) VALUES (1, 1, 'my answer to the 1st question'), (1, 2, 'my answer to the 2nd question');