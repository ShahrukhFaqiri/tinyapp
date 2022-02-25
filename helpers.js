//RANDOM STRING
const generateRandomString = () => {
  return Math.random().toString(20).substr(2, 6);
};

//AUTH USER BY EMAIL
const getUserByEmail = (email, users) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return userId;
    }
  }
  return undefined;
};

//LOOPING THROUGH USER URL
const urlsForUser = (id, db) => {
  let userUrls = {};
  for (const key in db) {
    if (db[key].userID === id) {
      userUrls[key] = db[key].longURL;
    }
  }
  return userUrls;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
};
