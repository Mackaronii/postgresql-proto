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
    const surveyId = req.params.id;
    const questions = await db.getQuestions(surveyId);
    console.log(questions);
    return res.send(questions);
    // res.render("pages/surveys", { surveys: surveys });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// POST request
app.post("/surveys", async (req, res) => {
  try {
    const result = await db.createSurvey();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
