const db = require("./queries");

const express = require("express");
const app = express(); 
var bodyParser = require('body-parser');  
// Create application/x-www-form-urlencoded parser  
var urlencodedParser = bodyParser.urlencoded({ extended: false })  



const path = require("path");
const { nextTick } = require("process");
const PORT = process.env.PORT || 8000;

app
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs");

// GET all surveys
app.get("/", (req, res) => res.render("pages/index"));

app.get("/surveys", async (req, res) => {
  try {
    const surveys = await db.getSurveys();
    res.render("pages/surveys", { surveys: surveys });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// GET all questions for a particular survey
app.get("/surveys/:id", async (req, res) => {
  try {
    const survey = await db.getSurveyById(req, res);
    const questions = await db.getQuestions(req, res);
    surveyname = survey[0].surveyname;
    res.render("pages/questions", {
      surveyname: surveyname,
      questions: questions,
    });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// POST request to post a survey
app.post("/", urlencodedParser, async (req, res) => {
  try {
    alert("Survey created");
    const result = await db.createSurvey(req, res);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


app.listen(PORT, () => console.log(`Listening on ${PORT}`));
