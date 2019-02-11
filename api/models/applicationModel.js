'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  status: [{
    type: String,
    required: 'Kindly enter the status',
    enum: ['PENGING', 'REJECTED', 'DUE', 'ACCEPTED', 'CANCELLED']
  }],
  comments: [String],
  rejectedReason: {
    type: String
  },
  strict: false });


module.exports = mongoose.model('Applications', ApplicationSchema);