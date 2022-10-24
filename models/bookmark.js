const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookmarkSchema = new Schema(
  {
    id: String,
    title: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipcode: String,
    },
  },
);

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
