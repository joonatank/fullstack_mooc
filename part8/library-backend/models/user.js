const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  hash : {
    type: String,
    required: true,
  },
  favoriteGenre: {
    type: String,
  }
})

module.exports = mongoose.model('User', schema)
