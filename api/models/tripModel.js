'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const generate = require('nanoid/generate');
const dateFormat = require('dateFormat');

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
    required: 'Kindly enter the end date',
    validate: [dateValidator, 'Start Date must be less than End Date']
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



function dateValidator(value){
  return this.startDate <= value;
}



var day=dateFormat(new Date(), "yymmdd")

TripSchema.pre('save', function(callback){
  var new_trip=this;
  var date = new Date;

  new_trip.ticker = [day, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-')
  callback();
});



module.exports = mongoose.model('Stages', StageSchema);
module.exports = mongoose.model('Trips', TripSchema);
