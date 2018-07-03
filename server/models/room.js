let mongoose = require('mongoose');

let Room = mongoose.model('Todo', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  currentMedia:{
    type:String
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
