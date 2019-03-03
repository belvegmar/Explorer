'use strict';

/*---------------FINDER----------------------*/
var mongoose = require('mongoose'),
  Finder = mongoose.model('Finders');

/*exports.list_all_finders = function (req, res) {
  Finder.find(function (err, finders) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(finders);
    }
  });
};*/


exports.create_a_finder = function (req, res) {
  var new_finder = new Finder(req.body);
  new_finder.save(function (err, finder) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err)
      }
    }
    else {
      res.json(finder);
    }
  });
};


exports.read_a_finder = function (req, res) {
  Finder.findById(req.params.actorID, function (err, finder) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(finder);
    }
  });
};


exports.update_a_finder = function (req, res) {
  Finder.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, finder) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err)
      }
    }
    else {
      res.json(finder);
    }
  });
};

exports.search_trips = function(req,res){
  //Search trips by te criteria in the finder
};


/*exports.delete_a_finder = function (req, res) {
  Finder.remove({ _id: req.params.finderId }, function (err, finder) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Finder successfully deleted' });
    }
  });
};*/

/*exports.delete_all_finders = function (req, res) {
  Finder.remove({}, function (err, finder) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Finders successfully deleted' });
    }
  });
};*/



