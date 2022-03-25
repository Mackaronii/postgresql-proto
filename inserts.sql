--Insert a user
INSERT INTO users (username) VALUES ('Johnny');

--Insert a survey
INSERT INTO survey (userID, surveyName, isOpen) VALUES (1, 'Test Survey', true);

--Insert a question
INSERT INTO question (surveyID, questionOrder, questionType, questionPrompt) VALUES (1, 1, 'open-ended', 'Is this an open-ended question?');

--Insert an answer
INSERT INTO answer (surveyID, questionID, answerText) VALUES (1, 1, 'my answer');

--Insert many answers
INSERT INTO answer (surveyID, questionID, answerText) VALUES (1, 1, 'my answer to the 1st question'), (1, 2, 'my answer to the 2nd question');

--Open a survey by ID
UPDATE survey SET isopen = true WHERE surveyId = 10;

--Add an open ended question to a survey
INSERT INTO question (surveyID, questionOrder, questionType, questionPrompt, minRange, maxRange, options) VALUES (12, 4, 'open-ended', 'Where does the sky begin?', null, null, null);

--Add a number range question to a survey
INSERT INTO question (surveyID, questionOrder, questionType, questionPrompt, minRange, maxRange, options) VALUES (12, 5, 'number-range', 'How good is Arcane?', 1, 10, null);

--Add a multiple choice question to a survey
INSERT INTO question (surveyID, questionOrder, questionType, questionPrompt, minRange, maxRange, options) VALUES (12, 6, 'multiple-choice', 'Which restaurant sells the best iced coffee?', null, null, 'McDonald''s;Starbucks;Tim Hortons;Bridgehead');