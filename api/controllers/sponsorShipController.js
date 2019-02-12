'use strict';
/*---------------SPONSOR SHIP----------------------*/
var mongoose = require('mongoose'),
  SponsorShip = mongoose.model('SponsorShips');

exports.list_all_sponsorShips = function(req, res) {
    SponsorShip.find({}, function(err, sponsorShips) {
        if (err){
          res.send(err);
        }
        else{
            res.json(sponsorShips);
        }
    });
};

exports.create_an_sponsorShip = function(req, res) {
  var new_sponsorShip = new SponsorShip(req.body);
  new_sponsorShip.save(function(err, sponsorShip) {
    if (err){
      res.send(err);
    }
    else{
      res.json(sponsorShip);
    }
  });
};

exports.read_an_sponsorShip = function(req, res) {
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
    SponsorShip.findOneAndUpdate({_id: req.params.sponsorShipId}, req.body, {new: true}, function(err, sponsorShip) {
        if (err){
            res.send(err);
        }
        else{
            res.json(sponsorShip);
        }
    });
};

exports.delete_an_sponsorShip = function(req, res) {
    SponsorShip.remove({_id: req.params.sponsorShipId}, function(err, sponsorShip) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'SponsorShip successfully deleted' });
        }
    });
};