//RANDOM STRING
const generateRandomString = () => {
  return Math.random().toString(20).substr(2, 6);
};

//AUTH USER BY EMAIL
const getUserByEmail = (email , users) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return undefined;
};

//LOOPING THROUGH USER URL
const urlsForUser = (id, db) => {
  let userUrls = {};
  for (const url in db) {
    if (db[url].userID === id) {
      userUrls[url] = db[url].longURL;
    }
  }
  return userUrls;
};

module.exports = { 
  generateRandomString,
  getUserByEmail,
  urlsForUser
}