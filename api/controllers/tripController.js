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


// RUTA --> /v1/trips/search?q="keyword"&reverse="false|true"&startFrom="valor"&pageSize="tam"
exports.search_trips = function (req, res) {
  var query = {};
  // Check if the keyworkd param exists (keyword: req.query.keyword). If null, all trips are returned
  //query.keyword = req.query.keyword != null ? req.query.keyword : /.*/;

  // Find trip by keyword contained in tickers, titles or descriptions
  if (req.query.keyword) {
    query.$text = { $search: req.query.keyword };
  }

  var skip = 0;
  if (req.query.startFrom) {
    skip = parseInt(req.query.startFrom);
  }

  var limit = 0;
  if (req.query.pageSize) {
    limit = parseInt(req.query.pageSize);
  }

  var sort = "";
  if (req.query.reverse == "true") {
    sort = "-";
  }

  console.log("Query: " + query + " Skip:" + skip + " Limit:" + limit + " Sort:" + sort);

  Trip.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean()
    .exec(function (err, trips) {
      console.log('Start searching trips');
      if (err) {
        res.send(err);
      }
      else {
        res.json(trips);
      }
      console.log('End searching trips');
    });
};



exports.create_a_trip = function (req, res) {
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

exports.create_a_trip_v2 = function (req, res) {
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
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(trip);
    }
  });
};

exports.read_a_trip_v2 = function (req, res) {
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
  //Only if the trip status is NOT PUBLISHED
  var id = req.params.tripId;

  Trip.findById(id, function (err, trip) {
    if (err) {
      res.status(500).send(err);
    } else {
      //Comprobar que el estado es no published
      if (trip.isPublished) {
        return res.status(500).send("Trip cacnnot be modified because it is published");
      } else {
        Trip.findByIdAndUpdate(id , req.body, { new: true, runValidators: true }, function (err, trip_np) {
          if (err) {
            console.log(err);
            if (err.name == 'ValidationError') {
              res.status(422).send(err);
            } else {
              res.status(500).send(err)
            }
          }
          else {
            res.json(trip_np);
          }
        });
      }
    }
  });
};

exports.update_a_trip_v2 = function (req, res) {
  //Only if the actor is a Manager and the trip status is NOT PUBLISHED
  console.log(JSON.stringify(req.body));
  var ticker = req.body.ticker;
  if (ticker != null) {
    res.sendStatus(409);
    return;
  } else {
    Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true, runValidators: true }, function (err, trip) {
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

};

exports.delete_a_trip = function (req, res) {
  //Only if the trip status is NOT PUBLISHED
  Trip.remove({ _id: req.params.tripId }, function (err, trip) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Trip successfully deleted' });
    }
  });
};

exports.delete_a_trip_v2 = function (req, res) {
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
  // COMPROBAR QUE ES UN MANAGER
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




