const { Pool } = require("pg");
const format = require("pg-format");
const { user } = require("pg/lib/defaults");

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

const getSurveys = async function () {
  const client = await pool.connect();
  return client
    .query("SELECT * FROM survey")
    .then((results) => {
      //console.table(results.rows);
      return results.rows;
    })
    .catch((e) => console.error(e))
    .finally(() => client.release());
};

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

const createSurvey = async function (surveyId, userId, surveyName, isOpen) {
  console.log(request.body);
  const sql = format(
    "INSERT INTO survey (surveyID, userID, surveyName, isOpen) VALUES (%L, %L, %s, %L)",
    surveyId,
    userId,
    surveyName,
    isOpen
  ); //                "SELECT * FROM question WHERE surveyId = %L", surveyId);
  const client = await pool.connect();
  return client
    .query(sql)
    .then((results) => {
      console.table(results.rows);
      console.log("survey added with id: %s", surveyId);
      return results.rows;
    })
    .catch((e) => console.error(e))
    .finally(() => client.release());
};

module.exports = {
  getSurveys,
  getQuestions,
  createSurvey,
};
