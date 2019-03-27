
var async = require("async");
var mongoose = require('mongoose'),
  DataWareHouse = mongoose.model('DataWareHouse'),
  Trip = mongoose.model('Trips'),
  Application = mongoose.model('Applications');
  Finder = mongoose.model('Finders');

exports.list_all_indicators = function (req, res) {
  console.log('Requesting indicators');

  DataWareHouse.find().sort("-computationMoment").exec(function (err, indicators) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(indicators);
    }
  });
};

exports.last_indicator = function (req, res) {

  DataWareHouse.find().sort("-computationMoment").limit(1).exec(function (err, indicators) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(indicators);
    }
  });
};

var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

//'0 0 * * * *' una hora
//'*/30 * * * * *' cada 30 segundos
//'*/10 * * * * *' cada 10 segundos
//'* * * * * *' cada segundo
var rebuildPeriod = '0 0 * * * *';  //El que se usará por defecto
var computeDataWareHouseJob;

exports.rebuildPeriod = function (req, res) {
  console.log('Updating rebuild period. Request: period:' + req.query.rebuildPeriod);
  rebuildPeriod = req.query.rebuildPeriod;
  computeDataWareHouseJob.setTime(new CronTime(rebuildPeriod));
  computeDataWareHouseJob.start();

  res.json(req.query.rebuildPeriod);
};

function createDataWareHouseJob() {
  computeDataWareHouseJob = new CronJob(rebuildPeriod, function () {

    var new_dataWareHouse = new DataWareHouse();
    console.log('Cron job submitted. Rebuild period: ' + rebuildPeriod);
    async.parallel([
      computeStatisticsTripsManager,
      computeStatisticsApplicationsTrips,
      computeStatisticsPrice,
      computeRatioApplicationsStatus,
      computeAvgPriceFinders,
      computeBottomKeyWords
    ], function (err, results) {
      if (err) {
        console.log("Error computing datawarehouse: " + err);
      }
      else {
        console.log("Resultados obtenidos por las agregaciones: " + JSON.stringify(results));
        new_dataWareHouse.statisticsTripsManager = results[0];
        new_dataWareHouse.statisticsApplicationsTrips = results[1];
        new_dataWareHouse.statisticsPrice = results[2];
        new_dataWareHouse.ratioApplicationsStatus = results[3];
        new_dataWareHouse.avgPriceFinders = results[4];
        new_dataWareHouse.bottomKeyWords = results[5];
        new_dataWareHouse.rebuildPeriod = rebuildPeriod;

        new_dataWareHouse.save(function (err, datawarehouse) {
          if (err) {
            console.log("Error saving datawarehouse: " + err);
          }
          else {
            console.log("new DataWareHouse succesfully saved. Date: " + new Date());
          }
        });
      }
    });
  }, null, true, 'Europe/Madrid');
}

module.exports.createDataWareHouseJob = createDataWareHouseJob;

function computeStatisticsTripsManager(callback) {
  Trip.aggregate([
    {
      $group: {
        _id: "$manager",
        trips: { $sum: 1 }
      }
    }, {
      $group: {
        _id: null,
        min: { $min: "$trips" },
        max: { $max: "$trips" },
        avg: { $avg: "$trips" },
        std: { $stdDevPop: "$trips" }
      }
    }, {
      $project: {
        _id: 0
      }
    }
  ], function (err, res) {
    callback(err, res[0])
  });
};





function computeStatisticsApplicationsTrips(callback) {
  Application.aggregate([
    {
      $group: {
        _id: "$trip",
        appllications: { $sum: 1 }
      }
    }, {
      $group: {
        _id: null,
        min: { $min: "$appllications" },
        max: { $max: "$appllications" },
        avg: { $avg: "$appllications" },
        std: { $stdDevPop: "$appllications" }
      }
    }, {
      $project: {
        _id: 0
      }
    }
  ], function (err, res) {
    callback(err, res[0])
  });
};

function computeStatisticsPrice(callback) {
  Trip.aggregate([
    {
      $group: {
        _id: null,
        min: { $min: "$price" },
        max: { $max: "$price" },
        avg: { $avg: "$price" },
        std: { $stdDevPop: "$price" }
      }
    }, {
      $project: {
        _id: 0
      }
    }
  ], function (err, res) {
    callback(err, res[0])
  });
};


function computeRatioApplicationsStatus(callback) {
  Application.aggregate([
    {
      $facet: {
        applications: [{ $group: { _id: null, numapp: { $sum: 1 } } }],
        applicationsStatus: [{ $group: { _id: "$status", numappgroup: { $sum: 1 } } }]
      }
    },
    {
      $project: {
        _id: 0, ratio: {
          "$arrayToObject": {
            "$map": {"input": "$applicationsStatus", "as": "status",
             "in": {
                "k": "$$status._id",
                "v": { $divide: ["$$status.numappgroup", {$arrayElemAt : ["$applications.numapp",0]}] }
              }
            }
          }
        }
      }
    }], function (err, res) {
      if(res[0].ratio.ACCEPTED = "undefined"){
        res[0].ratio.ACCEPTED = 0;
      }else if(res[0].ratio.PENDING = "undefined"){
        res[0].ratio.PENDING = 0;
      }else if(res[0].ratio.REJECTED = "undefined"){
        res[0].ratio.REJECTED = 0;
      }else if(res[0].ratio.CANCELLED = "undefined"){
        res[0].ratio.CANCELLED = 0;
      }else if(res[0].ratio.DUE = "undefined"){
        res[0].ratio.DUE = 0;
      }
      callback(err, [res[0].ratio.PENDING, res[0].ratio.REJECTED, res[0].ratio.DUE, res[0].ratio.ACCEPTED, res[0].ratio.CANCELLED]);

    });
};


function computeAvgPriceFinders(callback) {
  Finder.aggregate([
    {
      $group: {
        _id: null,
        minPriceAvg: { $avg:  "$priceRange.minPrice" },
        maxPriceAvg: { $avg: "$priceRange.maxPrice" }
      }
    },
    {
      $project:
        { _id: 0 }
    }
  ], function (err, res) {
    if(res[0].minPriceAvg> res[0].maxPriceAvg){
      res[0] = 0
    }
    callback(err, res[0])
  });
};

function computeBottomKeyWords(callback){
  Finder.aggregate([
    { "$sortByCount": "$keyWord" },
    { "$limit": 10 },
    { $project: { keyWord: "$_id", _id: 0, count: "$count" } }
  ], function (err, res) {
    var keyWords = [];
    for (var kw in res){
      keyWords.push(res[kw]);
    }
    callback(err, keyWords)
  });
};

