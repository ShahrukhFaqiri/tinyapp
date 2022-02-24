const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur',
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk',
  },
};

const generateRandomString = () => {
  //Randomly Generated string/number of 6 length;
  return Math.random().toString(20).substr(2, 6);
};

//Welcome Page
app.get('/', (req, res) => {
  res.send(`Hello!`);
});

//LIST JSON OF DB
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//SUBMIT LONG URL
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

//LIST OF URLS
app.get('/urls', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']],
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const randString = generateRandomString();
  urlDatabase[randString] = req.body.longURL;
  return res.redirect(`/urls`);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render('urls_show', templateVars);
});

//GO TO LONG URL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  return res.redirect(longURL);
});

//DELETE REQUEST
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  return res.redirect(`/urls`);
});

//EDITING EXISTING LINK
app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
  return res.redirect('/urls');
});

//USER LOGIN
// app.post('/login', (req, res) => {
//   const { username } = req.body;
//   res.cookie('username', username);
//   return res.redirect('/urls');
// });

//USER LOGOUT
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  return res.redirect('/urls');
});

//USER REGISTRATION PAGE
app.get('/register', (req, res) => {
  res.render('registration');
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const user_id = generateRandomString();
  if (!email || !password) {
    return res.status(404).send('Please fill both fields');
  }

  for (const userId in users) {
    console.log(users[userId].email);
    if (users[userId].email === email) {
      return res.status(400).send('Duplicate Email');
    } else if (users[userId].email !== email) {
      users[user_id] = { user_id, email, password };
      res.cookie('user_id', user_id);
    }
  }
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
