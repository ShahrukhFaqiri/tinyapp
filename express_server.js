const express = require('express');
const {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
} = require('./helpers');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: 'session',
    keys: ['12xcb890a8x'],
  })
);
app.set('view engine', 'ejs');

const urlDatabase = {
  b6UTxQ: {
    longURL: 'https://www.tsn.ca',
    userID: 'aJ48lW',
  },
  i3BoGr: {
    longURL: 'https://www.google.ca',
    userID: 'aJ48lW',
  },
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
  aJ48lW: {
    id: 'aJ48lW',
    email: 'userTest@gmail.com',
    password: '123',
  },
};

//HOME PAGE
app.get('/', (req, res) => {
  res.send(`Hello!`);
});

//LIST JSON OF DB
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//SUBMIT LONG URL
app.get('/urls/new', (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.redirect('/login');
  }
  const templatesVar = {
    user: users[req.session.user_id],
  };
  res.render('urls_new', templatesVar);
});

//LIST OF URLS
app.get('/urls', (req, res) => {
  let urls = urlsForUser(req.session.user_id, urlDatabase);
  const templateVars = {
    user: users[req.session.user_id],
    urls: urls,
  };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const randString = generateRandomString();
  urlDatabase[randString] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
  };
  return res.redirect(`/urls`);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
  };
  res.render('urls_show', templateVars);
});

//GO TO LONG URL
app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    let longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }
  res.status(404).send('Url does not exist');
});

//DELETE REQUEST
app.post('/urls/:shortURL/delete', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
      delete urlDatabase[req.params.shortURL];
      return res.redirect(`/urls`);
    }
  }
  res.status(401).send(`You don't own this URL!`);
});

//EDITING EXISTING LINK
app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  urlDatabase[shortURL].longURL = req.body.longURL;
  return res.redirect('/urls');
});

//USER LOGOUT
app.post('/logout', (req, res) => {
  req.session.user_id = null;
  return res.redirect('/urls');
});

//USER REGISTRATION PAGE
app.get('/register', (req, res) => {
  const templatesVar = {
    user: users[req.session.user_id],
  };
  res.render('registration', templatesVar);
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user_id = generateRandomString();
  if (!email || !password) {
    return res.status(404).send('Please fill both fields');
  }
  const userObject = getUserByEmail(email, users);
  if (!userObject) {
    users[user_id] = { id: user_id, email, hashedPassword };
    req.session.user_id = user_id;
    res.redirect('/urls');
  } else {
    return res.status(400).send('Duplicate Email');
  }
});

//LOGIN FEATURES
app.get('/login', (req, res) => {
  const templatesVar = {
    user: users[req.session.user_id],
  };
  res.render('login', templatesVar);
});

//USER LOGIN
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const userObject = getUserByEmail(email, users);
  if (!userObject) {
    return res.status(404).send('User not registered');
  } else {
    if (!bcrypt.compareSync(password, userObject.hashedPassword)) {
      return res.status(403).send('Incorrect Password');
    } else {
      req.session.user_id = userObject.id;
      res.redirect('/urls');
    }
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
