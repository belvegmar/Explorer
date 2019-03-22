'use strict';
/*---------------ACTOR----------------------*/
var mongoose = require('mongoose'),
  Actor = mongoose.model('Actors');

var admin = require('firebase-admin');
var authController = require('./authController');

exports.list_all_actors = function (req, res) {
  // If authentication version, the actor must be administrator
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
  //Actor can be only created if there is not authentication and the new role is an EXPLORER
  var new_actor = new Actor(req.body);
  if(new_actor.role !="EXPLORER"){
    res.status(422).send("Only can be created an EXPLORER");

  }else {
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
  }
  
};


exports.read_an_actor = function (req, res) {
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

exports.read_an_actor_v2 = function (req, res) {
    // The actor must be administrator or the proper actor
  Actor.findById(req.params.actorId, async function (err, actor) {
    if (err) {
      res.status(500).send(err);

    }
    else {
      console.log('actor: '+actor);
      var idToken = req.headers['idtoken'];//WE NEED the FireBase custom token in the req.header['idToken']... it is created by FireBase!!
      if (actor.role.includes('MANAGER') || actor.role.includes('EXPLORER')|| actor.role.includes('SPONSOR')){
        var authenticatedUserId = await authController.getUserId(idToken);
        if (authenticatedUserId == req.params.actorId){
          Actor.findById(req.params.actorId,  function(err, actor) {
            if (err){
              res.send(err);
            }
            else{
              res.json(actor);
            }
          });
        } else{
          res.status(403); //Auth error
          res.send('The Actor is trying to read an Actor that is not himself!');
        }    
      } else if (actor.role.includes('ADMINISTRATOR')){
          Actor.findById(req.params.actorId, function(err, actor) {
            if (err){
              res.send(err);
            }
            else{
              res.json(actor);
            }
          });
      } else {
        res.status(405); //Not allowed
        res.send('The Actor has unidentified roles');
      }
    }
  });
};




exports.update_an_actor = function (req, res) {
  //The actor must be the proper actor
  console.log(Date() + ": " + "PUT /v1/actors/:" + req.params.actorId);
  Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true, runValidators:true }, function (err, actor) {
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
  //If authentication version, the actor must be an ADMINISTRATOR
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
  //If authentication version, the actor must be an ADMINISTRATOR
  var banned_status = req.query.ban_status;
  Actor.findOneAndUpdate({ _id: req.params.actorId }, {$set: {"banned": banned_status}}, { new: true, runValidators:true }, function (err, actor) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        console.log(Date() + ": " + err);
        res.status(500).send(err);
      }
    }
    else {
      console.log(Date() + ": " + "Actor with email:" + actor.email + "banned. ");
      res.status(200).json(actor);
    }
  });
};

exports.delete_all_actors = function (req, res) {
  //If authentication version, the actor must be an ADMINISTRATOR
  Actor.remove({}, function (err, actor) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Actors successfully deleted' });
    }
  });
};



exports.login_an_actor = async function(req, res) {
  console.log('starting login an actor');
  var emailParam = req.query.email;
  var password = req.query.password;
  Actor.findOne({ email: emailParam }, function (err, actor) {
      if (err) { res.send(err); }

      // No actor found with that email as username
      else if (!actor) {
        res.status(401); //an access token isn’t provided, or is invalid
        res.json({message: 'forbidden',error: err});
      }

      else if (actor.banned == true) {
        res.status(403); //an access token is valid, but requires more privileges
        res.json({message: 'The actor is banned',error: err});
      }
      else{
        // Make sure the password is correct
        //console.log('En actor Controller pass: '+password);
        actor.verifyPassword(password, async function(err, isMatch) {
          if (err) {
            res.send(err);
          }

          // Password did not match
          else if (!isMatch) {
            //res.send(err);
            res.status(401); //an access token isn’t provided, or is invalid
            res.json({message: 'Incorrect Password',error: err});
          }

          else {
              try{
                var customToken = await admin.auth().createCustomToken(actor.email);
              } catch (error){
                console.log("Error creating custom token:", error);
              }
              actor.customToken = customToken;
              console.log('Login Success... sending JSON with custom token');
              res.json(actor);
          }
      });
    }
  });
};

exports.update_an_actor_v2 = function(req, res) {
  //Explorer, Managers and Sponsors can update theirselves, administrators can update any actor
  Actor.findById(req.params.actorId, async function(err, actor) {
    if (err){
      res.send(err);
    }
    else{
      console.log('actor: '+actor);
      var idToken = req.headers['idtoken'];//WE NEED the FireBase custom token in the req.header['idToken']... it is created by FireBase!!
      if (actor.role.includes('MANAGER') || actor.role.includes('EXPLORER')|| actor.role.includes('SPONSOR')){
        var authenticatedUserId = await authController.getUserId(idToken);
        if (authenticatedUserId == req.params.actorId){
          Actor.findOneAndUpdate({_id: req.params.actorId}, req.body, {new: true}, function(err, actor) {
            if (err){
              res.send(err);
            }
            else{
              res.json(actor);
            }
          });
        } else{
          res.status(403); //Auth error
          res.send('The Actor is trying to update an Actor that is not himself!');
        }    
      } else if (actor.role.includes('ADMINISTRATOR')){
          Actor.findOneAndUpdate({_id: req.params.actorId}, req.body, {new: true}, function(err, actor) {
            if (err){
              res.send(err);
            }
            else{
              res.json(actor);
            }
          });
      } else {
        res.status(405); //Not allowed
        res.send('The Actor has unidentified roles');
      }
    }
  });

};
