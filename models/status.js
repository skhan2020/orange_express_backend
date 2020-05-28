const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const statusSchema = new Schema({
  type: {
    type: Number, 
    required: true
  },
  todo: {
    type:Schema.Types.ObjectId,
    ref: 'Todo'
  }
},
  {timestamps: true}
);

module.exports = mongoose.model('Status', statusSchema);