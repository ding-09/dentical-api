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

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
