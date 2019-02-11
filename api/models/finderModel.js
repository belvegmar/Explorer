'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PriceRangeSchema = new Schema({
    minPrice: {
        type: Number
    },
    maxPrice: {
        type: Number
    }
}, { strict: false });

var DateRangeSchema = new Schema({
    start: {
        type: Date
    },
    end: {
        type: Date
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

module.exports = mongoose.model('Finders', FinderSchema);
