'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PriceRangeSchema = new Schema({
    minPrice: {
        type: Number,
        min: 0
    },
    maxPrice: {
        type: Number,
        min: 0,
        validate:[priceValidator, 'Min price must be less than max price']
    }
}, { strict: false });

var DateRangeSchema = new Schema({
    start: {
        type: Date
    },
    end: {
        type: Date,
        validate: [dateValidator, 'Start Date must be less than End Date']
    }
}, { strict: false });


var FinderSchema = new Schema({
    keyWord: {
        type: String,
        required: 'Kindly enter the description'
    },
    priceRange: PriceRangeSchema,
    dateRange: DateRangeSchema,
    explorer: {
        type: Schema.Types.ObjectId,
        ref: 'Actor'
    }
}, { strict: false });

function dateValidator(value){
    return this.start <= value;
  }

function priceValidator(value){
    return this.minPrice<value;
}
//If there is an actor id, validate if the ACTOR exists and it's an EXPLORER
FinderSchema.pre('validate', function (next) {
    var finder = this;
    var actor_id = finder.explorer;
    if (actor_id) {
      Actor.findOne({ _id: actor_id }, function (err, result) {
        if (err) {
          return next(err);
        }
        if (!result) {
          finder.invalidate('actor', `Explorer id ${finder.explorer} does not reference an existing Explorer`, finder.explorer);
        }
        if(result.role != "EXPLORER"){
            finder.invalidate('actor', `Actor id ${finder.explorer} does not reference an Explorer, its role is ${result.role}`, finder.explorer);
        }
        
        return next();
      });
    }
  
    else {
      return next();
    }
  });
  





module.exports = mongoose.model('Finders', FinderSchema);
