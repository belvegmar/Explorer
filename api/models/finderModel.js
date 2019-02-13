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
       // min: 0,
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
    priceRange: [PriceRangeSchema],
    dateRange: [DateRangeSchema]
}, { strict: false });


function dateValidator(value){
    return this.start <= value;
  }

function priceValidator(value){
    return this.minPrice<value;
}

/* FinderSchema.pre('update', function (callback) {
    var finder = this;
    // Break out if the password hasn't changed
    if (!finder.isModified('priceRange')) return callback();
  }); */

module.exports = mongoose.model('Finders', FinderSchema);
