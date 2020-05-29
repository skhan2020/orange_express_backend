const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String, 
    required: true
  },
  password: {
    type: String, 
    required: true
  },
  firstName: {
    type: String, 
    required: true
  },
  lastName: {
    type: String, 
    required: true
  },
  type: {
    type: String, 
    required: true
  },
  createdTodos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Todo'    // this is a mongoose feature that tells that we expect todos with ids
    }
  ]
},
{timestamps: true});

module.exports = mongoose.model('User', userSchema);