'use strict';
/*---------------SPONSOR SHIP----------------------*/
var mongoose = require('mongoose'),
  SponsorShip = mongoose.model('SponsorShips');

/*exports.list_all_sponsorShips = function(req, res) {
    SponsorShip.find({}, function(err, sponsorShips) {
        if (err){
          res.send(err);
        }
        else{
            res.json(sponsorShips);
        }
    });
};*/

exports.create_an_sponsorShip = function(req, res) {
  var new_sponsorShip = new SponsorShip(req.body);
  new_sponsorShip.save(function(err, sponsorShip) {
    if (err){
      if(err.name == 'ValidationError'){
        res.status(422).send(err);
      }else{
        res.status(500).send(err)
      }    }
    else{
      res.json(sponsorShip);
    }
  });
};

exports.read_an_sponsorShip = function(req, res) {
  //Comprobar que es el SPONSOR que posee el sponsorship  
  SponsorShip.findById(req.params.sponsorShipId, function(err, sponsorShip) {
    if (err){
      res.send(err);
    }
    else{
      res.json(sponsorShip);
    }
  });
};

exports.update_an_sponsorShip = function(req, res) {
    //TODO: Comprobar que es el SPONSOR que posee el sponsorship  
    SponsorShip.findOneAndUpdate({_id: req.params.sponsorShipId}, req.body, {new: true}, function(err, sponsorShip) {
        if (err){
          if(err.name == 'ValidationError'){
            res.status(422).send(err);
          }else{
            res.status(500).send(err)
          }        }
        else{
            res.json(sponsorShip);
        }
    });
};

exports.delete_an_sponsorShip = function(req, res) {
    //Comprobar que es el SPONSOR que posee el sponsorship  

    SponsorShip.remove({_id: req.params.sponsorShipId}, function(err, sponsorShip) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'SponsorShip successfully deleted' });
        }
    });
};

exports.pay = function(req,res){

};

/*exports.delete_all_sponsorShips = function(req, res) {
  SponsorShip.remove({}, function(err, sponsorShip) {
      if (err){
          res.send(err);
      }
      else{
          res.json({ message: 'SponsorShips successfully deleted' });
      }
  });
};*/


