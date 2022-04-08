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
 * GET survey questions by surveyId.
 *
 * @param {id} req
 * @param {*} res
 * @returns the survey given its surveyId
 */
const getSurveyQuestionsById = async function (req, res) {
  const surveyId = req.params.id;
  const sql = format("SELECT * FROM question WHERE surveyId = %L", surveyId);
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
 * GET survey results by surveyId.
 *
 * @param {id} req
 * @param {*} res
 * @returns
 */
const getSurveyResultsById = async function (req, res) {
  const surveyId = req.params.id;
  const sql = format(
    `SELECT * FROM survey
    INNER JOIN question ON survey.surveyid = question.surveyid
    INNER JOIN answer ON question.questionid = answer.questionid
    WHERE survey.surveyId = %L
    ORDER BY question.questionorder`,
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
 * PATCH survey to be closed by surveyId.
 *
 * @param {id} req
 * @param {*} res
 * @returns
 */
const closeSurveyById = async function (req, res) {
  const surveyId = req.params.id;
  const isOpen = req.body.isOpen;
  const sql = format(
    "UPDATE survey SET isopen = %L WHERE surveyId = %L",
    isOpen,
    surveyId
  );
  console.log(sql);
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

/**
 * GET all answers for a given question by its questionId.
 *
 * @param {questionid} req
 * @param {*} res
 * @returns all answers for a question
 */
const getSurveyAnswersByQuestionId = async function (req, res) {
  const questionId = req.params.questionid;
  const sql = format("SELECT * FROM answer WHERE questionid = %L", questionId);
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
  let tuples = [];
  for (const questionId in surveyResults) {
    const answerText = surveyResults[questionId];
    tuples.push(format("(%s, %s, %L)", surveyId, questionId, answerText));
    console.log("tuple entry:" + tuples[tuples.length - 1]);
  }
  const sql =
    "INSERT INTO answer (surveyID, questionID, answerText) VALUES " +
    tuples.join(", ");
  console.log("sql: " + sql);
  const client = await pool.connect();
  return client
    .query(sql)
    .then((results) => {
      console.table(results.rows);
    })
    .catch((e) => console.error(e))
    .finally(() => client.release());
};

const createSurvey = async function (req, res) {
  // Extract user input from request body
  const newSurvey = {
    userId: req.body.userId,
    surveyName: req.body.surveyName,
    isOpen: true,
  };
  // Construct SQL query
  const sql = format(
    "INSERT INTO survey (userID, surveyName, isOpen) VALUES (%s, %L, %L) RETURNING surveyID",
    newSurvey.userId,
    newSurvey.surveyName,
    newSurvey.isOpen
  );
  console.log(sql);
  // Return query as promise
  const client = await pool.connect();
  return client
    .query(sql)
    .then((results) => {
      console.table(results.rows);
      console.log(`New survey created [ID=${results.rows[0].surveyid}]`);
      console.log('results1');
      console.log(results.rows);
      console.log('results2');
      return results.rows;
    })
    .catch((e) => console.error(e))
    .finally(() => client.release());
};
/**
 * 
 const createQuestions = async function ( req, res, surveyId ) {
  // Extract user input from request body
  console.log( surveyId + 'ish' );
  const newQuestion = {
    surveyId: surveyId,
    questionOrder: req.body.questionOrder,
    questionType: req.body.questionType,
    questionPrompt: req.body.questionPrompt,
    minRange: req.body.minRange,
    maxRange: req.body.maxRange,
    options: req.body.options
  };
  console.log( '1' );
  // Construct SQL query
  const sql = format(
    "INSERT INTO question (surveyID, questionOrder, questionType, questionPrompt, minRange, maxRange, options) VALUES (%L, %L, %L, %L,%L, %L,%L) RETURNING questionID",
    newQuestion.surveyId,
    newQuestion.questionOrder,
    newQuestion.questionType,
    newQuestion.questionPrompt,
    newQuestion.minRange,
    newQuestion.maxRange,
    newQuestion.options

  );
  console.log( '2' );
  console.log( sql );
  // Return query as promise
  const client = await pool.connect();
  return client
    .query( sql )
    .then( ( results ) => {
      console.table( results.rows );
      console.log( New question created [ID=${results.rows[0].questionid}] );
      return results.rows;
    } )
    .catch( ( e ) => console.error( e ) )
    .finally( () => client.release() );
};

 */
const createQuestions = async function (req, res, surveyId) {
  // Extract user input from request body
  const newQuestion = {
    surveyId: surveyId,
    questionOrder: req.body.questionOrder,
    questionType: req.body.questionType,
    questionPrompt: req.body.questionPrompt,
    minRange: req.body.minRange,
    maxRange: req.body.maxRange,
    options: req.body.options
  };
  // Construct SQL query
  const sql = format(
    "INSERT INTO question (surveyID, questionOrder, questionType, questionPrompt, minRange, maxRange, options) VALUES (%L, %L, %L, %L, %L, %L, %L) RETURNING questionID",
    newQuestion.surveyId,
    newQuestion.questionOrder,
    newQuestion.questionType,
    newQuestion.questionPrompt,
    newQuestion.minRange,
    newQuestion.maxRange,
    newQuestion.options
  );
  console.log(sql);
  // Return query as promise
  const client = await pool.connect();
  return client
    .query(sql)
    .then((results) => {
      console.table(results.rows);
      console.log('test1')
      console.log(`New question created [ID=${results.rows[0].questionid}]`);
      console.log('test2')
      return results.rows;
    })
    .catch((e) => console.error(e))
    .finally(() => client.release());
};

module.exports = {
  getSurveys,
  getSurveyById,
  getSurveyQuestionsById,
  getSurveyResultsById,
  closeSurveyById,
  getQuestions,
  getSurveyAnswersByQuestionId,
  postAnswers,
  createSurvey,
  createQuestions,
};
