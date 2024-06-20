const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const newCommunication = new mongoose.Schema({
  to: { 
    type: String,
    required: true },
  subject: {
    type: String,
    required: true },
  body: {
    type: String, 
    required: true },
  date: { 
    type: Date, 
    default: Date.now }
});

newCommunication.plugin(findOrCreate);

module.exports = mongoose.model('Communication', newCommunication);
