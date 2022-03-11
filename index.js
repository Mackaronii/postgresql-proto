const db = require("./queries");

const express = require("express");
const app = express();
const path = require("path");
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
    const survey = await db.getSurveyNameById(req, res);
    const questions = await db.getQuestions(req, res);
    res.render("pages/questions", {
      survey: survey,
      questions: questions,
    });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// POST request
app.post("/create-surveys", async (req, res) => {
  try {
    const result = await db.createSurvey(1, 4, "ish", true);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
