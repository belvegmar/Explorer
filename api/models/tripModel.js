'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Actor = require('./actorModel');


const generate = require('nanoid/generate');
const dateFormat = require('dateFormat');

var StageSchema = new Schema({
  title: {
    type: String,
    required: 'Kindly enter the title of the stage'
  },
  description: {
    type: String,
    required: 'Kindly enter the description of the stage'
  },
  price: {
    type: Number,
    required: 'Kindly enter the stage price',
    min: 0
  }
}, { strict: false });


var TripSchema = new Schema({
  ticker: {
    type: String
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
    type: Boolean,
    default: false,
    validate: [cancelledTripValidator, 'The trip is cancelled so there must be a reason why']
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'Actors',
    required: 'Kindly enter the manager'
  },
  cancelationReason: {
    type: String
  },
  stages: [StageSchema]
},
  { strict: false });



function dateValidator(value) {
  return this.startDate <= value;
}

//A trip may be cancelled, in which case the system must store the reason why
function cancelledTripValidator(value){
  if(value == true && this.cancelationReason == null){
    return false;
  }
}




var day = dateFormat(new Date(), "yymmdd")

TripSchema.pre('save', function (callback) {
  var new_trip = this;
  var price = 0;
  var stages = new_trip.stages;
  for (var i = 0; i < stages.length; i++) {
    price = price + stages[i].price;
  };

  new_trip.price = price;
  callback();
});

TripSchema.pre('findOneAndUpdate', function (next) {
  //The price is calcullated automatically by stages prices
  var stages = this._update.stages;
  var price = 0;
  for (var i = 0; i < stages.length; i++) {
    price = price + stages[i].price;
  };

  this.update({},{ $set:{price: price}});

  next();
});

TripSchema.pre('save', function (callback) {
  var new_trip = this;
  new_trip.ticker = [day, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-');
  callback();
});


//validate if the MANAGER exists
TripSchema.pre('validate', function (next) {
  var trip = this;
  var actor_id = trip.manager;
  if (actor_id) {
    Actor.findOne({ _id: actor_id }, function (err, result) {
      if (err) {
        return next(err);
      }
      if (!result) {
        trip.invalidate('actor', `Manager id ${trip.manager} does not reference an existing Manager`, trip.manager);
      }
      if (result.role != "MANAGER") {
        trip.invalidate('actor', `Actor id ${trip.manager} does not reference a Manager`, trip.manager);
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

TripSchema.index({ ticker: 'text', title: 'text', description: 'text'}, {weights: {ticker:10, title:5, description:1}});
TripSchema.index({ticker:1}, {unique:true});
TripSchema.index({ price: 1, startDate: -1, endDate: 1 }); //1 ascending,  -1 descending



module.exports = mongoose.model('Stages', StageSchema);
module.exports = mongoose.model('Trips', TripSchema);
