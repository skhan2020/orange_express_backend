const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const videoSchema = new Schema({
  title: {
    type: String, 
    required: true
  },
  category: {
    type: String, 
    required: true
  },
  link: {
    type: String, 
    required: true
  },
  creator: {
    type:Schema.Types.ObjectId,
    ref: 'User'
  }
},
{timestamps: true});

module.exports = mongoose.model('Video', videoSchema);