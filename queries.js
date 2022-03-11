const { Pool } = require("pg");
const format = require("pg-format");
const { user } = require("pg/lib/defaults");
var bodyParser = require("body-parser");
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Load local .env file if running locally
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/**
 * GET all surveys and join on the Users table to get the username of the surveyor.
 *
 * @returns all surveys with corresponding surveyor
 */
const getSurveys = async function () {
  const client = await pool.connect();
  return client
    .query(
      "SELECT * FROM survey INNER JOIN users ON survey.userId = users.userId ORDER BY surveyId"
    )
    .then((results) => {
      //console.table(results.rows);
      return results.rows;
    })
    .catch((e) => console.error(e))
    .finally(() => client.release());
};

/**
 * GET survey by surveyId.
 *
 * @param {id} req
 * @param {*} res
 * @returns the survey given its surveyId
 */
const getSurveyById = async function (req, res) {
  const surveyId = req.params.id;
  const sql = format(
    "SELECT * FROM survey WHERE surveyId = %L LIMIT 1",
    surveyId
  );
  const client = await pool.connect();
  return client
    .query(sql)
    .then((results) => {
      //console.table(results.rows);
      return results.rows;
    })
    .catch((e) => console.error(e))
    .finally(() => client.release());
};

/**
 * GET all questions for a given survey by its surveyId.
 *
 * @param {id} req
 * @param {*} res
 * @returns all questions of a survey
 */
const getQuestions = async function (req, res) {
  const surveyId = req.params.id;
  const sql = format(
    "SELECT * FROM question WHERE surveyId = %L ORDER BY questionOrder",
    surveyId
  );
  const client = await pool.connect();
  return client
    .query(sql)
    .then((results) => {
      //console.table(results.rows);
      return results.rows;
    })
    .catch((e) => console.error(e))
    .finally(() => client.release());
};

const postAnswers = async function (req, res) {
  const surveyId = req.params.id;
  const surveyResults = JSON.parse(JSON.stringify(req.body));
  for (const questionId in surveyResults) {
    const answer = surveyResults[questionId];
    const sql = format(
      "INSERT INTO answer (answerID, surveyID, questionID, answerText) VALUES (1, %s, %s, %L)",
      surveyId,
      questionId,
      answer
    );
    console.log(sql);
    // const client = await pool.connect();
    // return client
    //   .query(sql)
    //   .then((results) => {
    //     console.table(results.rows);
    //   })
    //   .catch((e) => console.error(e))
    //   .finally(() => client.release());
  }
};

const createSurvey = async function (req, res) {
  const surveyId = req.body.surveyId;
  const userId = req.body.userId;
  const surveyName = req.body.surveyName;
  const isOpen = req.body.isOpen === "Y" ? true : false;
  console.log(isOpen);
  const sql = format(
    "INSERT INTO survey (surveyID, userID, surveyName, isOpen) VALUES (%L, %L, %L, %L)",
    surveyId,
    userId,
    surveyName,
    isOpen
  ); //                "SELECT * FROM question WHERE surveyId = %L", surveyId);
  console.log(sql);
  const client = await pool.connect();
  return client
    .query(sql)
    .then((results) => {
      console.table(results.rows);
      console.log("survey added with id: %s", surveyId);
      return results.rows;
    })
    .catch((e) => console.error(e + " he"))
    .finally(() => client.release());
};

const createQuestions = async function (req, res) {
  const surveyId = req.body.surveyId;
  const questionId = req.body.questionId;
  const questionOrder = req.body.questionOrder;
  const questionType = req.body.questionType;
  const questionPrompt = req.body.questionPrompt;
  const sql = format(
    "INSERT INTO question (questionID, surveyID, questionOrder, questionType, questionPrompt) VALUES (%L, %L, %L, %L, %L)",
    questionId, surveyId, questionOrder, questionType, questionPrompt
  ); 
  console.log(sql);
  const client = await pool.connect();
  return client
    .query(sql)
    .then((results) => {
      console.table(results.rows);
      console.log("question added with id: %s", questionId);
      return results.rows;
    })
    .catch((e) => console.error(e + " he"))
    .finally(() => client.release());
};

module.exports = {
  getSurveys,
  getSurveyById,
  getQuestions,
  postAnswers,
  createSurvey,
  createQuestions,
};
