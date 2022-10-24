const express = require('express');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');
const Dentist = require('./models/dentist');
const User = require('./models/user');
const Bookmark = require('./models/bookmark');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authToken = require('./middleware/authToken');

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

app.get('/dentist/:id', async (req, res) => {
  const { id } = req.params;

  // find dentist based on id
  let dentist = await Dentist.findById(id);
  res.status(200).json({ dentist });
});

// function that genereates JWT tokens
const creatToken = (_id, name) => {
  return jwt.sign({ _id, name }, process.env.SECRET);
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

// bookmarks
// create a bookmark, store in user
app.post('/bookmark', authToken, async (req, res) => {
  // id, title, address
  const { id, title, address } = req.body;

  // create bookmark
  const bookmark = new Bookmark({ _id: id, title, address });
  await bookmark.save();

  // get current user
  const { user } = req;

  // store bookmark in current user
  user.bookmarks.push(bookmark);
  await user.save();
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
