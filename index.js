const express = require('express');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');
const mongoose = require('mongoose')
const { Schema } = mongoose;

const app = express();

// connect to database
connectDB().catch(console.dir);

// get all dentists
app.get('/dentists', async (req, res) => {
    const Dentist = mongoose.model('Dentist', new Schema({}), 'dentists')
    const dentists = await Dentist.find()
    res.status(200).json(dentists);
})

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
