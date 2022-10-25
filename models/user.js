const mongoose = require('mongoose');
const { Schema } = mongoose;
const Bookmark = require('./bookmark');

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    index: { unique: true },
  },
  name: {
    type: String,
    required: [true, 'Please enter your full name'],
    minlength: [3, 'Full name cannot be under 3 characters'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password with at least 6 characters'],
    minlength: [6, 'Password cannot be under 6 character'],
  },
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Bookmark',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
