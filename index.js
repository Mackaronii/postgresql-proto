const db = require("./queries");

const express = require("express");
const app = express();
var bodyParser = require("body-parser");
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const path = require("path");
const { brotliDecompress } = require("zlib");
const PORT = process.env.PORT || 8000;

const {SHA256} = require("./SHA256_v3");
const users = []; // REPLACE THIS LATER
const flash = require('express-flash')
const session = require('express-session')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('passport')
 
const initializePassport = require('./config/passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

app
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// GET homepage
app.get("/", (req, res) => res.render("pages/index"));

// GET all surveys
app.get("/surveys", async (req, res) => {
  try {
    const surveys = await db.getSurveys();
    res.render("pages/surveys", { surveys: surveys });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// GET all questions for a particular survey and present survey for user to answer
app.get("/surveys/:id", async (req, res) => {
  try {
    const survey = await db.getSurveyById(req, res);
    const questions = await db.getQuestions(req, res);
    console.log(questions);
    surveyname = survey[0].surveyname;
    res.render("pages/answer-survey", {
      surveyname: surveyname,
      questions: questions,
    });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// POST request to post user answers
app.post("/surveys/:id", urlencodedParser, async (req, res) => {
  try {
    const answers = await db.postAnswers(req, res);
    const surveyId = req.params.surveyId;
    console.log(answers);
    res.render("pages/answer-submitted", {
      answers: answers,
    });
    //res.render("pages/create-questions", { surveyId: surveyId });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// PATCH survey to be closed
app.patch("/surveys/:id", urlencodedParser, async (req, res) => {
  try {
    await db.closeSurveyById(req, res);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Render survey results for a particular survey
app.get("/surveys/:id/results", async (req, res) => {
  try {
    // Get the survey
    const survey = await db.getSurveyById(req, res);
    // Get the questions for the survey
    
    const surveyQuestions = await db.getSurveyQuestionsById(req, res);
    // Get the submitted answers for each question
    for (const question of surveyQuestions) {
      req.params.questionid = question.questionid;
      question["answers"] = await db.getSurveyAnswersByQuestionId(req, res);
    }
    // console.log(survey);
    console.log(surveyQuestions);
    res.render("pages/survey-results", {
      survey: survey[0],
      surveyResults: surveyQuestions,
    });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Render "Create new survey" page
app.get("/create-survey", (req, res) => res.render("pages/create-survey"));

// POST request to post a survey
app.post("/create-survey", urlencodedParser, async (req, res) => {
  try {
    const newSurvey = await db.createSurvey(req, res);
    console.log("test");
    req.params.surveyId = newSurvey;
    const surveyId = req.params.surveyId;
    const surveyId2 = surveyId[0].surveyid
    
    console.log(req.body.questionOrder);
    

    //res.redirect(301, "/");
    
    
    const newQuestions = await db.createQuestions(req, res, surveyId2);
    //res.render("pages/create-questions", { newSurvey: newSurvey });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Render "Create new question" page
app.get("/create-questions", (req, res) =>
  res.render("pages/create-questions")
);

// POST request to post a question
app.post("/create-questions", urlencodedParser, async (req, res) => {
  try {
    const newQuestion = await db.createQuestions(req, res);
   
    res.redirect(301, "/");
    // res.render("pages/create-questions", { surveyId: surveyId });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// GET Login page
app.get("/login", (req, res) =>
  res.render("pages/login")
);

// GET Register page
app.get("/register", (req, res) =>
  res.render("pages/register")
);

app.post('/register', async (req, res) => {
  try {
    // Need to make it so that registration checkks for existing accounts first
    const hash = await SHA256(req.body.password);
    users.push({
	  id: users.length,
      username: req.body.username,
      password: hash
    });
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
});

app.post('/login', passport.authenticate('local', {
   successRedirect: '/',
   failureRedirect: '/login',
   failureFlash: true
}))

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
