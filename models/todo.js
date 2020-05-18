const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  type: {
    type: String, 
    required: true
  },
  description: {
    type: String, 
    required: true
  },
  status: {
    type: String, 
    required: true
  },
  startTime: {
    type: Date
  },
  duration: {
    type: String
  },
  notes: {
    type: String
  },
  creator: {
    type:Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Todo', todoSchema);

