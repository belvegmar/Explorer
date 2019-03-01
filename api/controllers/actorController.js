'use strict';
/*---------------ACTOR----------------------*/
var mongoose = require('mongoose'),
  Actor = mongoose.model('Actors');

exports.list_all_actors = function (req, res) {
  // The actor must be administrator
  Actor.find({}, function (err, actors) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(actors);
    }
  });
};

exports.create_an_actor = function (req, res) {
  //Actor can be only created if the user is not registered in the system
  console.log(Date() + ": " + "POST /v1/actors");
  var new_actor = new Actor(req.body);
  new_actor.save(function (err, actor) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        console.log(Date() + ": " + err);
        res.status(500).send(err)
      }
    }
    else {
      console.log(Date() + ": " + "New actor with email: '" + actor.email + "' added.");
      res.status(201).json(actor);
    }
  });
};

exports.read_an_actor = function (req, res) {
  // The actor must be administrator or the proper actor
  console.log(Date() + ": " + "GET /v1/actors/:actorId");
  Actor.findById(req.params.actorId, function (err, actor) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      }
      else {
        console.log(Date() + ": " + err);
        res.status(500).send(err);
      }

    }
    else {
      res.status(200).json(actor);
    }
  });
};

exports.update_an_actor = function (req, res) {
  //The actor must be the proper actor
  console.log(Date() + ": " + "PUT /v1/actors/:" + req.params.actorId);
  Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        console.log(Date() + ": " + err);
        res.status(500).send(err);
      }
    }
    else {
      console.log(Date() + ": " + "Actor with email:" + actor.email + "updated. ");
      res.status(200).json(actor);
    }
  });
};

exports.delete_an_actor = function (req, res) {
  Actor.remove({ _id: req.params.actorId }, function (err, actor) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: "Actor:" + actor + "successfully deleted" });
    }
  });
};

exports.change_banned_status = function(req,res){
  //Only Administrator
};

exports.delete_all_actors = function (req, res) {
  Actor.remove({}, function (err, actor) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Actors successfully deleted' });
    }
  });
};


exports.validate_an_actor = function (req, res) {
  //Check that the user is an Administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  console.log("Validating an actor with id: " + req.params.actorId)
  Actor.findOneAndUpdate({ _id: req.params.actorId }, { $set: { "validated": "true" } }, { new: true }, function (err, actor) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.json(actor);
    }
  });
};