const express = require('express');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');
const Dentist = require('./models/dentist');

const app = express();

// connect to database
connectDB().catch(console.dir);

// get all dentists
app.get('/dentists', async (req, res) => {
  const { zipcode } = req.query;
  const dentists = await Dentist.find({ 'address.zipcode': zipcode });
  dentists.length > 0
    ? res.json(dentists)
    : res.send('Cannot find anything');
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
