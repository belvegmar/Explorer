'use strict';

/*---------------APPLICATION----------------------*/
var mongoose = require('mongoose'),
  Application = mongoose.model('Applications');

exports.list_all_applications = function (req, res) {
  // The actor must be a MANAGER
  Application.find({}, function (err, applications) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(applications);
    }
  });
};

exports.create_an_application = function (req, res) {
  var new_application = new Application(req.body);
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
  Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true, runValidators:true }, function (err, application) {
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

exports.change_status = function(req,res){
  var applicationId = req.params.applicationId;
  var new_status = req.query.status;
  var rejected_reason = req.query.rejected_reason;
  //Comprobar que el estado es o DUE o ACCEPTED
  if (new_status=="DUE" || new_status=="ACCEPTED"){
    Application.find({_id: applicationId}, function(err, application){
      if(err){
        console.log(err);
        res.status(500).send(err);
      }
      else{
        if(application.length==0){
          res.status(400).send({message: 'There is not anny application with this id'});
        }
        var condition = (application[0].status == "PENDING" && new_status == "REJECTED" && rejected_reason!= null) || 
        (application[0].status == "PENDING" && new_status == "DUE");
        if(condition){
          Application.findOneAndUpdate({_id: applicationId}, {status: req.query.status, rejected_reason: req.query.rejected_reason}, {new:true}, function(err, application){
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
        
        else{
          console.log()
          res.status(400).send({message: `Status of application can't be changed because old status is ${application[0].status} and the new status is ${new_status} and rejected reason is ${rejected_reason}`})
        }
      }
    });

  }else{
    res.status(422).send("The new status must be DUE or ACCEPTED");
  }

  
};

exports.change_status_v2 = function(req,res){
  //Comprobar que el MANAGER que está intentando cambiar el estado de la solicitud ha publicado el trip de la solicitud
  var applicationId = req.params.applicationId;
  var new_status = req.query.status;
  var rejected_reason = req.query.rejected_reason;
  //Comprobar que el estado es o DUE o ACCEPTED
  if (new_status=="DUE" || new_status=="ACCEPTED"){
    Application.find({_id: applicationId}, function(err, application){
      if(err){
        console.log(err);
        res.status(500).send(err);
      }
      else{
        if(application.length==0){
          res.status(400).send({message: 'There is not anny application with this id'});
        }
        var condition = (application[0].status == "PENDING" && new_status == "REJECTED" && rejected_reason!= null) || 
        (application[0].status == "PENDING" && new_status == "DUE");
        if(condition){
          Application.findOneAndUpdate({_id: applicationId}, {status: req.query.status, rejected_reason: req.query.rejected_reason}, {new:true}, function(err, application){
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
        
        else{
          console.log()
          res.status(400).send({message: `Status of application can't be changed because old status is ${application[0].status} and the new status is ${new_status} and rejected reason is ${rejected_reason}`})
        }
      }
    });

  }else{
    res.status(422).send("The new status must be DUE or ACCEPTED");
  }

  
};


// /orderedTrips/search?explorer="explorerId"&reverse="false|true"&startFrom="valor"&pageSize="tam"
exports.search_by_status= function(req,res){
  //Explorer --> search applications mades by her or him grouped by status
  var query = {};

  if(req.query.explorer){
    query.explorer = req.query.explorer;
  }
  
  var skip = 0;
  if (req.query.startFrom){
    skip = parseInt(req.query.startFrom);
  }

  var limit = 0;
  if (req.query.pageSize){
    limit = parseInt(req.query.pageSize);
  }

  var sort="";
  if (req.query.reverse =="true"){
    sort="-";
  }
  sort = sort + "status";

  console.log("Query: "+query+" Skip:" + skip+" Limit:" + limit+" Sort:" + sort);

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

exports.pay_application = function(req,res){
  //Check that the status is "DUE"
  var applicationId = req.params.applicationId;
  Application.find({_id: applicationId}, function(err, application){
    if(err){
      console.log(err);
      res.status(500).send(err);
    }
    else{
      console.log(application[0].status);
      if(application[0].status=="DUE"){
        Application.findOneAndUpdate({_id: applicationId}, {status: "ACCEPTED", isPaid:true}, {new:true}, function(err, application){
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
        res.status(400).send({message: `Can't pay an application because the status is  ${application[0].status} and is not DUE`})
      }

    }
  })
  
};


exports.cancel = function(req,res){

};


