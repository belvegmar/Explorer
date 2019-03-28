'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Trip = require('./tripModel');
var Actor = require('./actorModel')

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

  //If there is a trip id, validate if the TRIP exists
SponsorShipSchema.pre('validate', function (next) {
  var sponsorShip = this;
  var trip_id = sponsorShip.trip;
  if (trip_id) {
    Trip.findOne({ _id: trip_id }, function (err, result) {
      if (err) {
        return next(err);
      }
      else if (!result) {
        sponsorShip.invalidate('trip', `Trip id ${sponsorShip.trip} does not reference an existing trip`, sponsorShip.trip);
      }
      return next();
    });
  }

  else {
    return next();
  }
});



//If there is an actor id, validate if the ACTOR exists
SponsorShipSchema.pre('validate', function (next) {
  var sponsorShip = this;
  var actor_id = sponsorShip.sponsor;
  if (actor_id) {
    Actor.findById(actor_id , function (err, result) {
      if (err) {
        return next(err);
      }
      else if (result==null) {
        sponsorShip.invalidate('actor', `Actor id ${sponsorShip.explorer} does not reference an existing Actor`, sponsorShip.sponsor);
      }
      else if(result.role != "SPONSOR"){
        sponsorShip.invalidate('actor', `Actor id ${sponsorShip.explorer} does not reference an Sponsor`, sponsorShip.sponsor);
      }
      
      return next();
    });
  }

  else {
    return next();
  }
});


module.exports = mongoose.model('SponsorShips', SponsorShipSchema);
