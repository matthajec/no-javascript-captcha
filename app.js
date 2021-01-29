const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const generateChallenge = require('./utils/generateChallenge');
const app = express();

// SETTINGS
// ===============================================================================

app.set('view engine', 'ejs');
app.set('views', 'views');

// ROUTES
// ===============================================================================

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'verysecretstring',
  resave: false,
  saveUninitialized: false
}));

// ROUTES
// ===============================================================================

app.get('/', (req, res) => {
  const {
    lookingFor,
    urls,
    solution
  } = generateChallenge(); // ideally you'd have a system which generates random image URLs and a huge dataset, both of those are not present in this application

  req.session.solution = solution;

  res.render('index.ejs', {
    challenge: {
      lookingFor: lookingFor,
      images: urls
    },
    passedCaptcha: req.session.passedCaptcha
  });
});

app.post('/challenge', (req, res) => {
  let passedCaptcha = true;

  // check each challenge box and if the user missed one set passedChallenge to false, otherwise it will stay as it's initialized value, true
  req.session.solution.forEach((answer, index) => {
    const isChecked = req.body[index] === 'on' ? true : false;
    if (isChecked !== answer)
      passedCaptcha = false;
  });

  req.session.passedCaptcha = passedCaptcha;

  // make sure the session is saved before redirecting
  req.session.save(() => {
    res.redirect('/');
  });
});

app.post('/destroy-session', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// SERVER START
// ===============================================================================

app.listen(3000);