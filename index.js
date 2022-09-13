const express = require('express');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');
const Dentist = require('./models/dentist');
const User = require('./models/user');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.urlencoded({ extended: true }));

// connect to database
connectDB().catch(console.dir);

// get all dentists
app.get('/dentists', async (req, res) => {
  // destructure zipcode
  const { zipcode } = req.query;

  // if there IS a zipcode, find dentist by zipcode
  // otherwise, no zipcode = no query = find all dentists
  let dentists = zipcode
    ? await Dentist.find({ 'address.zipcode': zipcode })
    : await Dentist.find();

  // only res.json(data) if there is actually data in dentists arr
  dentists.length > 0 ? res.json(dentists) : res.send('Cannot find anything');
});

// register a new user
app.post('/signup', async (req, res) => {
  // destructure data from req.body
  const { email, name, password } = req.body;

  // hash password
  const hash = await bcrypt.hash(password, 12);

  // save user data hashed password
  const user = new User({ email, name, password: hash });
  await user.save();
  res.redirect('/');
});

// login a user
app.post('/signin', async (req, res) => {
  const { email, name, password } = req.body;

  // check if email exists in db
  const user = await User.findOne({ email });
  // user will either be a value or null
  // depending on the existence of email

  const validatePassword = await bcrypt.compare(password, user.password);
  if (validatePassword) {
    res.send('Successfully logged in');
  } else {
    res.send('No one! Wrong password')
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
