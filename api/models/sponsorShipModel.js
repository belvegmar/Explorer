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
    required: 'Kindly enter the flat Rate'
  },
  trip: {
      type: Schema.Types.ObjectId,
      ref: 'Trip'
  },
  strict: false });


module.exports = mongoose.model('Sponsor Ship', SponsorShipSchema);