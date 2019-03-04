'use strict';
var mongoose = require('mongoose');


const StatisticsSchema = new mongoose.Schema({
    min: {
        type:Number,
        min: 0
    },
    max: {
        type:Number,
        min:0,
    },
    mean: {
        type: Number,
        min:0
    },
    std : {
        type: Number,
        min:0
    }
});


var DataWareHouseSchema = new mongoose.Schema({
  statisticsTripsManager: [StatisticsSchema],
  statisticsApplicationsTrips: [StatisticsSchema],
  statisticsPrice: [StatisticsSchema],
  ratioApplicationsStatus: [{
    type: Number,
    max: 1,
    min: 0
  }],
  avgPriceFinders: {
      type: Number,
      min:0
  },

  bottomKeyWords: [String],
  computationMoment: {
    type: Date,
    default: Date.now
  },
  rebuildPeriod: {
    type: String
  }
}, { strict: false });

DataWareHouseSchema.index({ computationMoment: -1 });

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema);
