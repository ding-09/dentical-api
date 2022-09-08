const mongoose = require('mongoose');
const { Schema } = mongoose;

const dentistSchema = new Schema({
  title: String,
  dentist: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipcode: String,
  },
  phone: String,
});

const Dentist = mongoose.model('dentist', dentistSchema, 'dentists');

module.exports = Dentist;
