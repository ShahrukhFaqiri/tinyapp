const { assert } = require('chai');

const {
  getUserByEmail,
  urlsForUser,
  generateRandomString,
} = require('../helpers.js');

const testDB = {
  b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'aJ48lW' },
  i3BoGr: { longURL: 'https://www.google.ca', userID: 'aJ48lW' },
  '4ee4gb': { longURL: '123.com', userID: 'i58842' },
};

const testUsers = {
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

describe('#getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const actual = getUserByEmail('user@example.com', testUsers);
    const expectedUserID = 'userRandomID';
    assert.deepEqual(actual, expectedUserID);
  });
  it('should return undefined if user doesnt exist', () => {
    const actual = getUserByEmail('123123123@example.com', testUsers);
    const expectedUserID = undefined;
    assert.equal(actual, expectedUserID);
  });
});

describe('#urlsForUser', () => {
  it('should return object with user data', () => {
    const actual = urlsForUser('i58842', testDB);
    const expected = { '4ee4gb': '123.com' };
    assert.deepEqual(actual, expected)
  })
});

describe('#generateRandomString', () => {
  it('should return undefined', function () {
    const actual = generateRandomString();
    const expectedOutput = 6;
    assert.equal(actual.length, expectedOutput);
  });
});
