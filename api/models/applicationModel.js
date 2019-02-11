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
  comments: {
    type: String,
    required: 'Kindly enter the the comments'
  },
  rejectedReason: {
    type: String,
    required: 'Kindly enter the rejected reasons'
  },
  strict: false });


module.exports = mongoose.model('Application', ApplicationSchema);