'use strict';

/*---------------APPLICATION----------------------*/
var mongoose = require('mongoose'),
  Application = mongoose.model('Applications'),
  Actor = mongoose.model('Actors'),
  Trip = mongoose.model('Trips');
var authController = require('./authController');

exports.list_all_applications = function (req, res) {
  //Para probar, hay que indicar por un query param el manager
  var authenticatedUserId = req.query.manager;

  //Buscar todos los trips de un manager
  function retrieveTripsOfManager(manager, callback){
    Trip.find({manager: manager}, function(err, trips){
      if (err) {
        res.send(err);
      }
      else {
        callback(null, trips);
      }

    });
  }
  retrieveTripsOfManager(authenticatedUserId, function(err, trips){
    if(err){
      console.log(err);
    }else{
      Application.find({trip: {$in: trips}}, function (err, applications) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(applications);
        }
      });
    }

  });
};

exports.list_all_applications_v2 = async function (req, res) {
  // The actor must be a MANAGER and only can view applications for the trips he/she manages
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  

  //Buscar todos los trips de un manager
  function retrieveTripsOfManager(manager, callback){
    Trip.find({manager: manager}, function(err, trips){
      if (err) {
        res.send(err);
      }
      else {
        callback(null, trips);
      }

    });
  }
  retrieveTripsOfManager(authenticatedUserId, function(err, trips){
    if(err){
      console.log(err);
    }else{
      Application.find({trip: {$in: trips}}, function (err, applications) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(applications);
        }
      });
    }

  });
};

exports.create_an_application = function (req, res) {
  //Requirements
  // the trip must be published, not started or cancelled
  var new_application = new Application(req.body);
  console.log(req.body);
  var trip_id = new_application.trip;
  console.log(trip_id);
  Trip.findById(trip_id, function (err, trip) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!trip.isPublished) {
        res.status(400).send("The application can't be created because the reference trip is not published");
      } else if (!(trip.startDate > Date.now())) {
        res.status(400).send("The application can't be created because the reference trip has already started");
      } else if (trip.isCancelled) {
        res.status(400).send("The application can't be created because the reference trip is cancelled");
      } else {
        new_application.save(function (err, application) {
          if (err) {
            if (err.name == 'ValidationError') {
              res.status(422).send(err);
            } else {
              res.status(500).send(err)
            }
          }
          else {
            res.json(application);
          }
        });
      }
    }
  });

};

exports.create_an_application_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  var new_application = new Application(req.body);
  new_application.explorer = authenticatedUserId;
  trip_id = new_application.trip;
  Trip.findById(trip_id, function (err, trip) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!trip.isPublished) {
        res.status(400).send("The application can't be created because the reference trip is not published");
      } else if (!(trip.startDate > Date.now)) {
        res.status(400).send("The application can't be created because the reference trip has already started");
      } else if (trip.isCancelled) {
        res.status(400).send("The application can't be created because the reference trip is cancelled");
      } else {
        new_application.save(function (err, application) {
          if (err) {
            if (err.name == 'ValidationError') {
              res.status(422).send(err);
            } else {
              res.status(500).send(err)
            }
          }
          else {
            res.json(application);
          }
        });
      }
    }
  });

};

exports.read_an_application = function (req, res) {
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(application);
    }
  });
};

exports.update_an_application = function (req, res) {
  Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true, runValidators: true }, function (err, application) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err)
      }
    }
    else {
      res.json(application);
    }
  });
};

exports.delete_an_application = function (req, res) {
  Application.remove({ _id: req.params.applicationId }, function (err, application) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Application successfully deleted' });
    }
  });
};


exports.delete_all_applications = function (req, res) {
  Application.remove({}, function (err, application) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Applications successfully deleted' });
    }
  });
};

exports.change_status = function (req, res) {
  var applicationId = req.params.applicationId;
  var new_status = req.query.status;

  var authenticatedUserId = req.query.manager;

  //Comprobar que el estado es o DUE o ACCEPTED
  if (new_status == "DUE" || new_status == "REJECTED") {
    Application.find({ _id: applicationId }, function (err, application) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      else {
        if (application.length == 0) {
          res.status(400).send({ message: 'There is not anny application with this id' });
        }
        var condition = (application[0].status == "PENDING" && new_status == "REJECTED" /*&& application[0].rejected_reason != null*/) ||
          (application[0].status == "PENDING" && new_status == "DUE");
        if (condition) {
          Application.findOneAndUpdate({ _id: applicationId }, { status: req.query.status}, { new: true }, function (err, application) {
            if (err) {
              if (err.name == 'ValidationError') {
                res.status(422).send(err);
              } else {
                res.status(500).send(err)
              }
            }
            else {
              Trip.findOne({_id:application.trip}, function(err,trip){
                if(err){
                  res.status(500).send(err);
                }else{
                  if (trip.manager!=authenticatedUserId){
                    res.status(401).send("The manager can't update the application because he/she does not manages the trip");
                  }else{
                    res.json(application);
                  }
                }
              })
            }
          });
        }

        else {
          console.log()
          res.status(400).send({ message: `Status of application can't be changed because old status is ${application[0].status} and the new status is ${new_status} and rejected reason is ${application[0].rejected_reason}` })
        }
      }
    });

  } else {
    res.status(422).send("The new status must be DUE or ACCEPTED");
  }


};

exports.change_status_v2 = async function (req, res) {
  //Comprobar que el MANAGER que está intentando cambiar el estado de la solicitud ha publicado el trip de la solicitud
  var applicationId = req.params.applicationId;
  var new_status = req.query.status;
  var rejected_reason = req.query.rejected_reason;

  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);

  //Comprobar que el estado es o DUE o ACCEPTED
  if (new_status == "DUE" || new_status == "ACCEPTED") {
    Application.find({ _id: applicationId }, function (err, application) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      else {
        if (application.length == 0) {
          res.status(400).send({ message: 'There is not anny application with this id' });
        }
        var condition = (application[0].status == "PENDING" && new_status == "REJECTED" && rejected_reason != null) ||
          (application[0].status == "PENDING" && new_status == "DUE");
        if (condition) {
          Application.findOneAndUpdate({ _id: applicationId }, { status: req.query.status, rejected_reason: req.query.rejected_reason }, { new: true }, function (err, application) {
            if (err) {
              if (err.name == 'ValidationError') {
                res.status(422).send(err);
              } else {
                res.status(500).send(err)
              }
            }
            else {
              Trip.findOne({_id:application.trip}, function(err,trip){
                if(err){
                  res.status(500).send(err);
                }else{
                  if (trip.manager!=authenticatedUserId){
                    res.status(401).send("The manager can't update the application because he/she does not manages the trip");
                  }else{
                    res.jason(application);
                  }
                }
              })
            }
          });
        }

        else {
          console.log()
          res.status(400).send({ message: `Status of application can't be changed because old status is ${application[0].status} and the new status is ${new_status} and rejected reason is ${rejected_reason}` })
        }
      }
    });

  } else {
    res.status(422).send("The new status must be DUE or ACCEPTED");
  }


};


// /orderedTrips/search?explorer="explorerId"&reverse="false|true"&startFrom="valor"&pageSize="tam"
exports.search_by_status = function (req, res) {
  //Explorer --> search applications mades by her or him grouped by status
  var query = {};


  if (req.query.explorer) {
    query.explorer = req.query.explorer;
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
  sort = sort + "status";

  console.log("Query: " + query + " Skip:" + skip + " Limit:" + limit + " Sort:" + sort);

  Application.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean()
    .exec(function (err, applications) {
      console.log('Start searching applications');
      if (err) {
        res.send(err);
      }
      else {
        res.json(applications);
      }
      console.log('End searching applications');
    });
};

// /orderedTrips/search?reverse="false|true"&startFrom="valor"&pageSize="tam"
exports.search_by_status_v2 = async function (req, res) {
  //Explorer --> search applications mades by her or him grouped by status
  var query = {};
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  query.explorer = authenticatedUserId;


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
  sort = sort + "status";

  console.log("Query: " + query + " Skip:" + skip + " Limit:" + limit + " Sort:" + sort);

  Application.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean()
    .exec(function (err, applications) {
      console.log('Start searching applications');
      if (err) {
        res.send(err);
      }
      else {
        res.json(applications);
      }
      console.log('End searching applications');
    });
};

exports.pay_application = function (req, res) {
  //Check that the status is "DUE"
  var applicationId = req.params.applicationId;
  Application.findOne({ _id: applicationId }, function (err, application) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      if (application.status == "DUE") {
        Application.findOneAndUpdate({ _id: applicationId }, { status: "ACCEPTED", isPaid: true }, { new: true }, function (err, application) {
          if (err) {
            if (err.name == 'ValidationError') {
              res.status(422).send(err);
            } else {
              res.status(500).send(err)
            }
          }
          else {
            res.json(application);
          }
        });
      }
      else {
        res.status(400).send({ message: `Can't pay an application because the status is  ${application[0].status} and is not DUE` })
      }

    }
  })

};

exports.pay_application_v2 = async function (req, res) {
  //Check that the status is "DUE" and the Explorer wants to pay an application he/she has made
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  var applicationId = req.params.applicationId;
  Application.findOne({ _id: applicationId }, function (err, application) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      if (application.status != "DUE") {
        res.status(400).send({ message: "Can't pay an application because the status is not DUE" });
      }
      else if (application.explorer != authenticatedUserId) {
        res.status(403).send({ message: "Can't pay an application because the Explorer does't apply this trip" });
      }
      else  {
        Application.findOneAndUpdate({ _id: applicationId }, { status: "ACCEPTED", isPaid: true }, { new: true }, function (err, application) {
          if (err) {
            if (err.name == 'ValidationError') {
              res.status(422).send(err);
            } else {
              res.status(500).send(err)
            }
          }
          else {
            res.json(application);
          }
        });
      }
    }
  });
};


exports.cancel = function (req, res) {
  //Check that the status is "ACCEPTED"
  var applicationId = req.params.applicationId;
  Application.findOne({ _id: applicationId }, function (err, application) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      if (application.status == "ACCEPTED" || application.status == "PENDING") {
        Application.findOneAndUpdate({ _id: applicationId }, { status: "CANCELLED" }, { new: true, runValidators: true }, function (err, application) {
          if (err) {
            if (err.name == 'ValidationError') {
              res.status(422).send(err);
            } else {
              res.status(500).send(err)
            }
          }
          else {
            res.json(application);
          }
        });
      }
      else {
        res.status(400).send({ message: `Can't cancel an application because the status is  ${application.status} and is not PENDING or ACCEPTED` })
      }

    }
  });

};

exports.cancel_v2 = async function (req, res) {
  //Check that the status is "ACCEPTED or PENDING"
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  var applicationId = req.params.applicationId;
  var applicationId = req.params.applicationId;
  Application.findOne({ _id: applicationId }, function (err, application) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      if(application.explorer!=authenticatedUserId){
        res.status(403).send({ message: "Can't cancel an application because the Explorer does't apply this trip" });
      }
      else if (application.status == "ACCEPTED" || application.status == "PENDING") {
        Application.findOneAndUpdate({ _id: applicationId }, { status: "CANCELLED" }, { new: true, runValidators: true }, function (err, application) {
          if (err) {
            if (err.name == 'ValidationError') {
              res.status(422).send(err);
            } else {
              res.status(500).send(err)
            }
          }
          else {
            res.json(application);
          }
        });
      }
      else {
        res.status(400).send({ message: `Can't cancel an application because the status is  ${application.status} and is not PENDING or ACCEPTED` })
      }

    }
  });

};

