const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number
  },
  bookCount: {
    type: Number,
    required: true,
    min: 1
  }
})

module.exports = mongoose.model('Author', schema)