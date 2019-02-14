'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SponsorShipSchema = new Schema({
  banner: {
    type: String,
    required: 'Kindly enter the banner'
  },
  link: {
    type: String,
    required: 'Kindly enter the link',
  },
  flatRate: {
    type: Number,
    required: 'Kindly enter the flat Rate',
    min: 0
  },
  trip: {
    type: Schema.Types.ObjectId,
    ref: 'Trip'
  }, 
  sponsor: {
    type: Schema.Types.ObjectId,
    ref: 'Actor'
  },

  isPaid: {
    type: Boolean
  }
},
  {
    strict: false
  });


module.exports = mongoose.model('SponsorShips', SponsorShipSchema);
