const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  category: {
    type: String, 
    required: true
  },
  title: {
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
  projectedEndTime: {
    type: Date
  },
  notes: {
    type: String
  },
  tags: [{
    type: String
  }],
  creator: {
    type:Schema.Types.ObjectId,
    ref: 'User'
  }
},
{timestamps: true});

module.exports = mongoose.model('Todo', todoSchema);

