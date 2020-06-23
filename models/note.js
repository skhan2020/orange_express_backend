const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  category: {
    type: String, 
    required: true
  },
  title: {
    type: String, 
    required: true
  },
  text: {
    type: String, 
    required: true
  },
  creator: {
    type:Schema.Types.ObjectId,
    ref: 'User'
  }
},
{timestamps: true});

module.exports = mongoose.model('Note', noteSchema);