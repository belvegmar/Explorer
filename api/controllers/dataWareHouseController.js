
var async = require("async");
var mongoose = require('mongoose'),
  DataWareHouse = mongoose.model('DataWareHouse'),
  Trip = mongoose.model('Trips'),
  Application = mongoose.model('Applications');

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
      //computeRatioApplicationsStatus,
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
        //new_dataWareHouse.ratioApplicationsStatus = results[3];
        new_dataWareHouse.avgPriceFinders = results[3];
        new_dataWareHouse.bottomKeyWords = results[4];
        //new_dataWareHouse.rebuildPeriod = rebuildPeriod;

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
    //console.log("computeStatisticsTripsManager:     "+res[0].statisticsTripsManager);
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




function computeAvgPriceFinders(callback) {
  Finder.aggregate([
    {
      $group: {
        _id: null,
        minPriceAvg: { $avg: { $arrayElemAt: ["$priceRange.minPrice", 0] } },
        maxPriceAvg: { $avg: { $arrayElemAt: ["$priceRange.maxPrice", 0] } }
      }
    },
    {
      $project:
        { _id: 0 }
    }
  ], function (err, res) {
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

