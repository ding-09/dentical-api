const mongoose = require('mongoose');
const { Schema } = mongoose;

const dentistSchema = new Schema({
  title: String,
  dentist: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipcode: {
      type: String,
      enum: ['93301']
    }
  },
  phone: String,
});

const Dentist = mongoose.model('dentist', dentistSchema, 'dentists');

module.exports = Dentist;