'use strict';

/*---------------TRIP----------------------*/
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trips'),
  Application = mongoose.model('Applications');

exports.list_all_trips = function (req, res) {
  Trip.find(function (err, trips) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(trips);
    }
  });
};

exports.search_trips = function (req, res) {
  console.log("Ha entrado");
  var query = {};
  // Check if the keyworkd param exists (keyword: req.query.keyword). If null, all trips are returned
  query.keyword = req.query.keyword != null ? req.query.keyword : /.*/;


  // Find trip by keyword contained in tickers, titles or descriptions
  if (req.query.keyword) {
    query.$text = { $search: req.query.keyword };
  }




  //console.log("Query: "+query+" Skip:" + skip+" Limit:" + limit+" Sort:" + sort);

  Trip.find(query)
    .exec(function (err, item) {
      console.log('Start searching items');
      if (err) {
        res.send(err);
      }
      else {
        res.json(item);
      }
      console.log('End searching items');
    });
};


exports.display_dashboard_trip_manager = function (err, res) {
  // If there is a manager in the head, print dashboard for trips per manager

  // If there isnt manager, print dashboard for all trips

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
        _id: 0,
        min_trips: "$min",
        max_trips: "$max",
        avg_trips: "$avg",
        std_trips: "$std"
      }
    }
  ], function (err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
};


exports.display_dashboard_price = function (err, res) {
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
        min_price: "$min",
        max_price: "$max",
        avg_price: "$avg",
        std_price: "$std"
      }
    }
  ], function (err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });

};





exports.create_a_trip = function (req, res) {
  //Only if the actor is a Manager
  var new_trip = new Trip(req.body);
  new_trip.save(function (err, trip) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err)
      }
    }
    else {
      res.json(trip);
    }
  });
};


exports.read_a_trip = function (req, res) {
  //Only if the actor is a Manager 
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(trip);
    }
  });
};


exports.update_a_trip = function (req, res) {
  //Only if the actor is a Manager and the trip status is NOT PUBLISHED
  Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err)
      }
    }
    else {
      res.json(trip);
    }
  });
};

exports.delete_a_trip = function (req, res) {
  //Only if the actor is a Manager and the trip status is NOT PUBLISHED
  Trip.remove({ _id: req.params.tripId }, function (err, trip) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Trip successfully deleted' });
    }
  });
};

exports.cancel_trip = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.status(404).send(err);
    }
    else {
      //Comprobar que no ha empezado
      if (trip.startDate > Date.now()) {
        //Comprobar que no tiene solicitudes aceptadas
        //Buscar solicitudes cuyo campo "trip" coincida con el id del trip
        Application.find({ trip: trip._id, status: "ACCEPTED" }, function (err, applications) {
          if (err) {
            res.status(404).send(err);
          }
          else if (applications.length != 0) {
            res.send('No se puede cancelar porque hay solicitudes aceptadas para ese viaje');
          }
          else {
            Trip.updateOne({ "_id": req.params.tripId }, { $set: { "isCancelled": "true" } }, function (err, trip) {
              if (err) {
                if (err.name == 'ValidationError') {
                  res.status(422).send(err);
                } else {
                  res.status(500).send(err)
                }
              }
              else {
                res.json(trip);

              }
            });
          }
        });
      }
    }
  });


};
exports.delete_all_trips = function (req, res) {
  Trip.remove({}, function (err, trip) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Trips successfully deleted' });
    }
  });
};




/*---------------STAGE----------------------*/
// var mongoose = require('mongoose'),
//   Stage = mongoose.model('Stages');

// exports.list_all_stages = function(req, res) {
//   Stage.find({}, function(err, stages) {
//     if (err){
//       res.send(err);
//     }
//     else{
//       res.json(stages);
//     }
//   });
// };

// exports.create_a_stage = function(req, res) {
//   var new_stage = new Stage(req.body);
//   new_stage.save(function(err, stage) {
//     if (err){
//       if(err.name == 'ValidationError'){
//         res.status(422).send(err);
//       }else{
//         res.status(500).send(err)
//       }    }
//     else{
//       res.json(stage);
//     }
//   });
// };


// exports.read_a_stage = function(req, res) {
//   Stage.findById(req.params.stageId, function(err, stage) {
//     if (err){
//       res.send(err);
//     }
//     else{
//       res.json(stage);
//     }
//   });
// };

// exports.update_a_stage = function(req, res) {
//   Stage.findOneAndUpdate({_id: req.params.stageId}, req.body, {new: true}, function(err, stage) {
//     if (err){
//       if(err.name == 'ValidationError'){
//         res.status(422).send(err);
//       }else{
//         res.status(500).send(err)
//       }    }
//     else{
//       res.json(stage);
//   }
//   });
// };

// exports.delete_a_stage = function(req, res) {
//   Stage.remove({_id: req.params.stageId}, function(err, stage) {
//     if (err){
//       res.send(err);
//     }
//     else{
//       res.json({ message: 'Stage successfully deleted' });
//     }
//   });
// };

// exports.delete_all_stages = function(req, res) {
//   Stage.remove({}, function(err, stage) {
//     if (err){
//       res.send(err);
//     }
//     else{
//       res.json({ message: 'Stages successfully deleted' });
//     }
//   });
// };




