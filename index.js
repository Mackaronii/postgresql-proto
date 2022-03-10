const db = require("./queries");

const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8000;

app
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs");

// GET request
app.get("/", (req, res) => res.render("pages/index"));

app.get("/surveys", async (req, res) => {
  try {
    const surveys = await db.getSurveys();
    console.log(surveys);
    res.render("pages/surveys", { surveys: surveys });
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
