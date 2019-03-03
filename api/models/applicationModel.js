'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Trip = require('./tripModel');
var Actor = require('./actorModel')
var ApplicationSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  status: [{
    type: String,
    required: 'Kindly enter the status',
    default: 'PENDING',
    enum: ['PENDING', 'REJECTED', 'DUE', 'ACCEPTED', 'CANCELLED']
  }],
  comments: [String],
  rejectedReason: {
    type: String
  },
  trip: {
    type: Schema.Types.ObjectId,
    ref: 'Trips'
  },
  explorer: {
    type: Schema.Types.ObjectId,
    ref: 'Actors',
  }
},
  { strict: false });

//If there is a trip id, validate if the TRIP exists
ApplicationSchema.pre('validate', function (next) {
  var application = this;
  var trip_id = application.trip;
  if (trip_id) {
    Trip.findOne({ _id: trip_id }, function (err, result) {
      if (err) {
        return next(err);
      }
      if (!result) {
        application.invalidate('trip', 'Trip id ${application.trip} does not reference an existing trip', application.trip);
      }
      return next();
    });
  }

  else {
    return next();
  }
});

//If there is an actor id, validate if the ACTOR exists and it's an EXPLORER
ApplicationSchema.pre('validate', function (next) {
  var application = this;
  var actor_id = application.explorer;
  if (actor_id) {
    Actor.findOne({ _id: actor_id }, function (err, result) {
      if (err) {
        return next(err);
      }
      if (!result) {
        application.invalidate('actor', 'Explorer id ${application.explorer} does not reference an existing Explorer', application.explorer);
      }
      if(result.role != "EXPLORER"){
        application.invalidate('actor', 'Actor id ${application.explorer} does not reference an Explorer', application.explorer);
      }
      
      return next();
    });
  }

  else {
    return next();
  }
});

// ######################################################################################
//                                      INDEXES
// ######################################################################################
ApplicationSchema.index({ explorer: 1, status: 'text' })


module.exports = mongoose.model('Applications', ApplicationSchema);
