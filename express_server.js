const express = require('express');
const {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
} = require('./helpers');
const { urlDatabase, users } = require('./data');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 6767;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: 'session',
    keys: ['12xcb890a8x'],
  })
);
app.set('view engine', 'ejs');

//HOME PAGE
app.get('/', (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  return res.redirect('urls');
});

//LIST JSON OF DB *TEST*
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//SUBMIT LONG URL
app.get('/urls/new', (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  const templatesVar = {
    user: users[req.session.user_id],
  };
  res.render('urls_new', templatesVar);
});

//GETTING YOUR OWN URL, IF YOU DON'T OWN IT IT DISPLAYS AN ERROR
app.get('/urls/:shortURL', (req, res) => {
  if(!Object.keys(urlDatabase).includes(req.params.shortURL)){
    return res
    .status(401)
    .send(`The URL Doesn't exist.`);
  }

  if (req.session.user_id) {
    if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
      const templateVars = {
        user: users[req.session.user_id],
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL].longURL,
      };
      res.render('urls_show', templateVars);
    } else {
      return res
        .status(401)
        .send(`You don't own this URL, please login if you do.`);
    }
  } else {
    return res.status(404).send(`Please login`);
  }
});

//ANY USERS CAN GO TO URL
app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    let longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else {
    return res.status(404).send('Url does not exist');
  }
});

//DELETE URLS REQUEST MADE BY USER
app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.session.user_id) {
    if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
      delete urlDatabase[req.params.shortURL];
      return res.redirect(`/urls`);
    } else {
      return res.status(401).send(`You don't own this URL!`);
    }
  }
  return res.status(401).send(`Log in please`);
});

//DISPLAYS LIST OF URLS TO PAGE
app.get('/urls', (req, res) => {
  if (!req.session.user_id) {
    return res.send(`<h3>Please Login or Register to view this page!</h3> <a href='/login'>Login</a> <a href='/register'>Register</a>`)
  }
  let urls = urlsForUser(req.session.user_id, urlDatabase);
  const templateVars = {
    user: users[req.session.user_id],
    urls: urls,
  };
  res.render('urls_index', templateVars);
});

//MAKING A POST TO /URLS REDIRECTS TO THAT URL LINK
app.post('/urls', (req, res) => {
  if (!users[req.session.user_id]) {
    return res.redirect(`/login`);
  } else {
    const randString = generateRandomString();
    urlDatabase[randString] = {
      longURL: req.body.longURL,
      userID: req.session.user_id,
    };
    return res.redirect(`/urls/${randString}`);
  }
});

//EDITING EXISTING LINK
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.longURL;
  return res.redirect('/urls');
});

//USER LOGOUT && CLEAR COOKIES
app.post('/logout', (req, res) => {
  req.session = null;
  return res.redirect('/urls');
});

//REGISTRATION PAGE GET
app.get('/register', (req, res) => {
  const templatesVar = {
    user: users[req.session.user_id],
  };
  res.render('registration', templatesVar);
});

//REGISTRATION PAGE POST
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
  if (req.session.user_id) {
    return res.redirect('/urls');
  }
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
    if (!bcrypt.compareSync(password, users[userObject].hashedPassword)) {
      return res.status(403).send('Incorrect Password');
    } else {
      req.session.user_id = userObject;
      res.redirect('/urls');
    }
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
