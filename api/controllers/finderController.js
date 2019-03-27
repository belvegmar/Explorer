'use strict';

/*---------------FINDER----------------------*/
var mongoose = require('mongoose'),
  Finder = mongoose.model('Finders'),
  Trip = mongoose.model('Trips');
var authController = require('./authController');

exports.list_all_finders = function (req, res) {
  Finder.find(function (err, finders) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(finders);
    }
  });
};

exports.delete_all_finders = function (req, res) {
  Finder.remove({}, function (err, finder) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Finders successfully deleted' });
    }
  });
};


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

exports.create_a_finder_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  var new_finder = new Finder(req.body);
  new_finder.explorer = authenticatedUserId;
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
  Finder.findOne({explorer:req.params.actorId}, function (err, finder) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(finder);
    }
  });
};

exports.read_a_finder_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Finder.findById(req.params.actorId, function (err, finder) {
    if (err) {
      res.send(err);
    }
    else {
      if(!(finder.explorer == authenticatedUserId)){
        res.json(401).send('The finder does not belongs to the authenticated user');
      }else{
        res.json(finder);
      }
    }
  });
};

exports.delete_a_finder = function (req, res) {
  Finder.remove({ explorer: req.params.actorId }, function (err, finder) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: "Finder:" + finder + "successfully deleted" });
    }
  });
};


exports.update_a_finder = function (req, res) {
  Finder.findOneAndUpdate({ explorer: req.params.actorId }, req.body, { new: true }, function (err, finder) {
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

exports.update_a_finder_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Finder.findOneAndUpdate({ explorer: req.params.actorId }, req.body, { new: true }, function (err, finder) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err)
      }
    }
    else {
      if(authenticatedUserId!=finder.explorer){
        res.json(401).send('The finder does not belongs to the authenticated user');
      }else{
        res.json(finder);
      }

    }
  });
};

exports.search_trips = function(req,res){
  //Search trips by te criteria in the finder
  var query = {};
  
  // Find trip by keyword contained in tickers, titles or descriptions
  function retrieveFinder(explorer, callback){
    Finder.findOne({explorer: explorer}, function(err, finder){
      query.price = {};
      query.startDate = {};
      query.endDate = {};
      if(finder.keyWord){
        query.$text = { $search: finder.keyWord };
      }
      if(finder.priceRange.minPrice){
        query.price.$gte = finder.priceRange.minPrice;
      }
      if(finder.priceRange.maxPrice){
        query.price.$lte = finder.priceRange.maxPrice;
      }
      if(finder.dateRange.start){
        query.startDate.$gte = finder.dateRange.start;
      }
      if(finder.dateRange.end){
        query.endDate.$lte = finder.dateRange.end;
      }
      callback(null, query);
    });
  }
  
  retrieveFinder(req.params.actorId, function(err, trips){
    if(err){
      console.log(err);
    }else{
      console.log(query);
      Trip.find(query)
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
    }

  });
  

  
};



exports.search_trips_v2 = async function(req,res){
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  //Search trips by te criteria in the finder
  var query = {};
  
  // Find trip by keyword contained in tickers, titles or descriptions
  function retrieveFinder(explorer, callback){
    Finder.findOne({explorer: explorer}, function(err, finder){
      query.price = {};
      query.startDate = {};
      query.endDate = {};
      if(finder.keyWord){
        query.$text = { $search: finder.keyWord };
      }
      if(finder.priceRange.minPrice){
        query.price.$gte = finder.priceRange.minPrice;
      }
      if(finder.priceRange.maxPrice){
        query.price.$lte = finder.priceRange.maxPrice;
      }
      if(finder.dateRange.start){
        query.startDate.$gte = finder.dateRange.start;
      }
      if(finder.dateRange.end){
        query.endDate.$lte = finder.dateRange.end;
      }
      callback(null, query);
    });
  }
  
  if(authenticatedUserId!=req.params.actorId){
    res.json(401).send('The finder does not belongs to the authenticated user');
  }else{
    retrieveFinder(req.params.actorId, function(err, trips){
      if(err){
        console.log(err);
      }else{
        Trip.find(query)
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
      }
  
    });
  }  
};


exports.delete_a_finder = function (req, res) {
  Finder.remove({ _id: req.params.actorId }, function (err, finder) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Finder successfully deleted' });
    }
  });
};

exports.delete_all_finders = function (req, res) {
  Finder.remove({}, function (err, finder) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Finders successfully deleted' });
    }
  });
};





