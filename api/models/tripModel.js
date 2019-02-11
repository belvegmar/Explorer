'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StageSchema = new Schema({
  title: {
    type: String,
    required: 'Kindly enter the title of the Category'
  },
  description: {
    type: String,
    required: 'Kindly enter the description of the Category'
  },
  price: {
    type: Number,
    required: 'Kindly enter the stage price',
    min: 0
  }
}, { strict: false });


var TripSchema = new Schema({
  ticker: {
    type: String,
    required: 'Kindly enter the description'
  },
  title: {
    type: String,
    required: 'Kindly enter the description'
  },
  description: {
    type: String,
    required: 'Kindly enter the description'
  },
  price: {
    type: Number,
    required: 'Kindly enter the item price',
    min: 0
  },
  startDate: {
      type: Date,
      required: 'Kindly enter the start date'
  },
  requirements: [String],
  endDate: {
    type: Date,
    required: 'Kindly enter the end date'
  },
  picture: {
    data: Buffer, contentType: String
  },
  isCancelled: {
      type: Boolean
  },
  cancelationReason: {
      type: String
  },
  stages: [StageSchema]
},  { strict: false });

module.exports = mongoose.model('Stages', StageSchema);
module.exports = mongoose.model('Trips', TripSchema);
