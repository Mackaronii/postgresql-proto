const { Pool } = require("pg");
const format = require("pg-format");
const { user } = require("pg/lib/defaults");
// Load local .env file if running locally
var bodyParser = require('body-parser');  
// Create application/x-www-form-urlencoded parser  
var urlencodedParser = bodyParser.urlencoded({ extended: false })  

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


const createSurvey = async function (req, res) {
  const surveyId = req.body.surveyId;
  const userId = req.body.userId;
  const surveyName = req.body.surveyName;
  const isOpen = req.body.isOpen === "Y" ? true : false;
  console.log(isOpen)
  const sql = format("INSERT INTO survey (surveyID, userID, surveyName, isOpen) VALUES (%L, %L, %L, %L)", surveyId,userId, surveyName, isOpen);//                "SELECT * FROM question WHERE surveyId = %L", surveyId);
  console.log(sql);
  const client = await pool.connect();
  return client
    .query(sql)
    .then((results) => {
      console.table(results.rows);
      console.log('survey added with id: %s', surveyId);
      return results.rows;
    })
    .catch((e) => console.error(e +" he"))
    .finally(() => client.release());
};



module.exports = {
  getSurveys,
  getQuestions,
  createSurvey,
};
