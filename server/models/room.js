const mongoose = require('mongoose');

const Room = mongoose.model('Room', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  currentMedia:{
    type:String
  },
  currentMediaStartedAt:{
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  playList: [{
    type: String,
    minlength: 1,
    trim: true
  }]
});

module.exports = { Room };
