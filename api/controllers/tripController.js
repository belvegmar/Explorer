'use strict';

/*---------------TRIP----------------------*/
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trips'),
  Application = mongoose.model('Applications');

var authController = require('./authController');



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

exports.create_a_trip_v2 = async function (req, res) {
  //The new trip must have the manager id, so it0s necessary de idToken
  var new_trip = new Trip(req.body);
  
  var idToken = req.headers['idToken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  new_trip.manager = authenticatedUserId;

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

exports.read_a_trip_v2 = async function (req, res) {
  var idToken = req.headers['idToken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  var id = req.params.tripId;

  Trip.findById(id, function (err, trip) {
    if (err) {
      res.send(err);
    }
    else if(trip.manager!=authenticatedUserId){
      return res.status(401).send("The manager does not manage the trip which is trying to read");
    }
    else {
      res.json(trip);
    }
  });
};



exports.update_a_trip = function (req, res) {
  //Check the status is NOT PUBLISHED
  
  var id = req.params.tripId;

  Trip.findOne({ _id: id }, function (err, trip) {
    if (err) {
      res.status(500).send(err);
    }
    if(!trip){
      res.status(404).send("Trip not found");
    }
    else {
      if (trip.isPublished) {
        return res.status(422).send("Validation error: Trip can't be modified because it is published");
      } else {
        Trip.findOneAndUpdate({ _id: id }, req.body, { new: true }, function (err, trip) {
          if (err) {
            if (err.name == "ValidationError") {
              res.status(422).send(err);
            } else {
              res.status(500).send(err);
            }
          }
          else {
            res.json(trip);
          }
        });
      }
    }
  });
};

exports.update_a_trip_v2 = async function(req,res){
  var id = req.params.tripId;

  var idToken = req.headers['idToken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  var id = req.params.tripId;

  Trip.findOne({ _id: id }, function (err, trip) {
    if (err) {
      res.status(500).send(err);
    }
    if(!trip){
      res.status(404).send("Trip not found");
    }
    else {
      if (trip.isPublished) {
        return res.status(422).send("Validation error: Trip can't be modified because it is published");
      } 
      else if (trip.manager != authenticatedUserId){
        return res.status(401).send("The manager does not manage the trip which is trying to update");
      }   
      else {
        Trip.findOneAndUpdate({ _id: id }, req.body, { new: true }, function (err, trip) {
          if (err) {
            if (err.name == "ValidationError") {
              res.status(422).send(err);
            } else {
              res.status(500).send(err);
            }
          }
          else {
            res.json(trip);
          }
        });
      }
    }
  });
};


exports.delete_a_trip = function (req, res) {
  //Check the status is NOT PUBLISHED
  

  Trip.findOne({ _id: id }, req.body, { new: true }, function (err, trip) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      if (trip.isPublished) {
        return res.status(422).send("Validation error: Trip can't be deleted because it is published");
      }
         
      else {
        Trip.findOneAndDelete({ _id: id }, function (err, trip) {
          if (err) {
            res.status(500).send(err);
          }
          else {
            res.json({message: "Trip succesfully deleted"});
          }
        });
      }
    }
  });
};

exports.delete_a_trip_v2 = async function (req, res) {
  //Only if the actor is a Manager, is his trip, and the trip status is NOT PUBLISHED

  var idToken = req.headers['idToken'];
  var authenticatedUserId = await authController.getUserId(idToken);

  var id = req.params.tripId;

  Trip.findOne({ _id: id }, req.body, { new: true }, function (err, trip) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      if (trip.isPublished) {
        return res.status(422).send("Validation error: Trip can't be deleted because it is published");
      } 
      else if (trip.manager != authenticatedUserId){
        return res.status(401).send("The manager does not manage the trip which is trying to delete");
      }
      else {
        Trip.findOneAndDelete({ _id: id }, function (err, trip) {
          if (err) {
            res.status(500).send(err);
          }
          else {
            res.json({message: "Trip succesfully deleted"});
          }
        });
      }
    }
  });
};

exports.cancel_trip = function (req, res) {

  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.status(404).send(err);
    }
    else {
      //Comprobar que no ha empezado y que está published
      if (trip.startDate > Date.now() && trip.isPublished) {
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
            Trip.updateOne({ "_id": req.params.tripId }, {new:true},{ $set: { "isCancelled": "true" } }, function (err, trip) {
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
      else{
        return res.status(422).send("Validation error: The trip can't be cancelled because it has started or is not published");
      }
    }
  });


};

exports.cancel_trip_v2 = async function (req, res) {
  // COMPROBAR QUE ES UN MANAGER
  var idToken = req.headers['idToken'];
  var authenticatedUserId = await authController.getUserId(idToken);

  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.status(404).send(err);
    }
    else {
      //Comprobar que no ha empezado y que está published
      if (trip.startDate > Date.now() && trip.isPublished) {
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
            Trip.updateOne({ "_id": req.params.tripId }, {new:true},{ $set: { "isCancelled": "true" } }, function (err, trip) {
              if (err) {
                if (err.name == 'ValidationError') {
                  res.status(422).send(err);
                } else {
                  res.status(500).send(err)
                }
              }
              else {
                if(trip.manager!=authenticatedUserId){
                  res.status(401).send("The manager does not manage the trip which is trying to cancel");
                }else{
                  res.json(trip);
                }
                

              }
            });
          }
        });
      }
      else{
        return res.status(422).send("Validation error: The trip can't be cancelled because it has started or is not published");
      }
    }
  });
};


exports.delete_all_trips = function (req, res) {
  //If authentication version, the actor must be a MANAGER
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




