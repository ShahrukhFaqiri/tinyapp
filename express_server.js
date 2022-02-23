const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
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
    username: req.cookies["username"],
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const randString = generateRandomString();
  urlDatabase[randString] = req.body.longURL;
  res.redirect(`/urls`);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    username: req.cookies['username'],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render('urls_show', templateVars);
});

//GO TO LONG URL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//DELETE REQUEST
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});

//EDITING EXISTING LINK
app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
});

//USER LOGIN
app.post('/login', (req, res) => {
  const { username } = req.body
  res.cookie('username', username);
  res.redirect('/urls');
});

//USER LOGOUT
app.post('/logout', (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
