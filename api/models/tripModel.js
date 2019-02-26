'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Actor = require('./actorModel')

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
    type: String,
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
    type: Boolean
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



exports.search_trips = function(req, res) {
  //In further version of the code we will:
  //1.- control the authorization in order to include deleted trips in the results if the requester is an Administrator.
  //2.- use indexes to search keywords in 'name', 'description' or 'sku'.
  var query = {};
  //Checking if itemName is null or not. If null, all items are returned.
  query.name = req.query.tripName!=null ? req.query.tripName : /.*/;

  if(req.query.categoryId){
    query.category=req.query.categoryId;
  }
  
  if(req.query.deleted){
    query.deleted = req.query.deleted;
  }

  var skip=0;
  if(req.query.startFrom){
    skip = parseInt(req.query.startFrom);
  }
  var limit=0;
  if(req.query.pageSize){
    limit=parseInt(req.query.pageSize);
  }

  var sort="";
  if(req.query.reverse=="true"){
    sort="-";
  }
  if(req.query.sortedBy){
    sort+=req.query.sortedBy;
  }

  console.log("Query: "+query+" Skip:" + skip+" Limit:" + limit+" Sort:" + sort);

  Item.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(function(err, item){
    console.log('Start searching items');
    if (err){
      res.send(err);
    }
    else{
      res.json(item);
    }
    console.log('End searching items');
  });
};




module.exports = mongoose.model('Stages', StageSchema);
module.exports = mongoose.model('Trips', TripSchema);
