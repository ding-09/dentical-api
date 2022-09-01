const express = require('express');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');

const app = express();

// connect to database
connectDB().catch(console.dir);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
