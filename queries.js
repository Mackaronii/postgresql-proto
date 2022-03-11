const { Pool } = require("pg");
const format = require("pg-format");

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
    .finally(() => client.end());
};

const getQuestions = async function (surveyId) {
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
    .finally(() => client.end());
};

const createSurvey = (request, response) => {
  console.log(request.body);
  const { userId, surveyName, isOpen } = request.body;

  pool.query(
    "INSERT INTO survey (userId, surveyName, isOpen) VALUES ($1, $2, $3)",
    [userId, surveyName, isOpen],
    (error, result) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Survey added with ID: ${result.insertId}`);
    }
  );
};

module.exports = {
  getSurveys,
  getQuestions,
  createSurvey,
};
