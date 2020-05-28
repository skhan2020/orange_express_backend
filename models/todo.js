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
    type: Number, 
    required: true
  },
  statusUpdatedTime: {
    type: Date, 
    required: true
  },
  projectedStartTime: {
    type: Date
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

