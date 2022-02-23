const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

const generateRandomString = () => { //Randomly Generated string of 6 length;
  return Math.random().toString(20).substr(2, 6)
};
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
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
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});
app.post('/urls', (req, res) => {
  const randString = generateRandomString();
  urlDatabase[randString] = req.body.longURL;
  res.redirect(`/urls`)

});

//DATA OF SHORT URL
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render('urls_show', templateVars);
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL)
});

//DELETE REQUEST
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls`)
})

//TEST
app.get('/hello', (req, res) => {
  res.send(`<html><body>Hello <b>World</b></body></html>\n`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
