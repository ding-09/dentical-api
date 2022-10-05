const express = require('express');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');
const Dentist = require('./models/dentist');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

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
  dentists.length > 0
    ? res.json(dentists)
    : res.json({ message: "Can't find anything" });
});

// function that genereates JWT tokens
const creatToken = (_id, name) => {
  return jwt.sign({ _id, name }, process.env.SECRET, { expiresIn: '1h' });
};

// register a new user
app.post('/signup', async (req, res) => {
  try {
    // destructure data from req.body
    const { email, name, password } = req.body;

    // hash password
    const hash = await bcrypt.hash(password, 12);

    // save user data hashed password
    const user = new User({ email, name, password: hash });
    await user.save();
    const token = creatToken(user._id, user.name);
    res.status(200).json({ name, token });
  } catch (e) {
    res.status(400).send('email already exists');
  }
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
    const token = creatToken(user._id, user.name);
    res.status(200).json({ name: user.name, token });
  } else {
    res.status(400).send({ error: 'invalid credentials' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
