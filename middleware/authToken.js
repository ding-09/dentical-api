const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authToken = async (req, res, next) => {
  const { authorization } = req.headers;

  // check if there is anything in headers first
  if (!authorization) {
    return res.status(401).send('Authorization token required');
  }

  // if there is a token, verify it
  const token = authorization.split(' ')[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    // set req.user to the user found by id from token
    req.user = await User.findById(_id);
    next();
  } catch (e) {
    console.log(e);
  }
};

module.exports = authToken;
