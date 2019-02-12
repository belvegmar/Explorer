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
    trip: {
      type: Schema.Types.ObjectId,
      ref: 'Trip'
    },
    explorer:{
      type: Schema.Types.ObjectId,
      ref:'Actor',
    }
  },
    { strict: false });
  
module.exports = mongoose.model('Applications', ApplicationSchema);
