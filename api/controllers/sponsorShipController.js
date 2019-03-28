'use strict';
/*---------------SPONSOR SHIP----------------------*/
var mongoose = require('mongoose'),
  SponsorShip = mongoose.model('SponsorShips');
var authController = require('./authController');

exports.list_all_sponsorShips = function (req, res) {
  if (req.query.sponsorId) {
    SponsorShip.find({ sponsor: req.query.sponsorId }, function (err, sponsorShips) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(sponsorShips);
      }
    });
  } else {
    SponsorShip.find({}, function (err, sponsorShips) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(sponsorShips);
      }
    });
  }
};

exports.list_all_sponsorShips_v2 = async function (req, res) {
  //Only show the sponsorships of the Sponsor authenticated
  var idToken = req.headers['idToken'];
  var authenticatedUserId = await authController.getUserId(idToken);

  SponsorShip.find({ sponsor: authenticatedUserId }, function (err, sponsorShips) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(sponsorShips);
    }
  });
};

exports.create_an_sponsorShip = function (req, res) {
  var new_sponsorShip = new SponsorShip(req.body);
  new_sponsorShip.save(function (err, sponsorShip) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err)
      }
    }
    else {
      res.json(sponsorShip);
    }
  });
};

exports.create_an_sponsorShip_v2 = async function (req, res) {
  var new_sponsorShip = new SponsorShip(req.body);
  var idToken = req.headers['idToken'];

  var authenticatedUserId = await authController.getUserId(idToken);
  new_sponsorShip.sponsor = authenticatedUserId;
  new_sponsorShip.save(function (err, sponsorShip) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err)
      }
    }
    else {
      res.json(sponsorShip);
    }
  });
};

exports.read_an_sponsorShip = function (req, res) {
  //Comprobar que es el SPONSOR que posee el sponsorship  
  SponsorShip.findById(req.params.sponsorShipId, function (err, sponsorShip) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(sponsorShip);
    }
  });
};

exports.read_an_sponsorShip_v2 = async function (req, res) {
  //Comprobar que es el SPONSOR que posee el sponsorship 
  var idToken = req.headers['idToken'];
  var authenticatedUserId = await authController.getUserId(idToken);

  SponsorShip.findById(req.params.sponsorShipId, function (err, sponsorShip) {
    if (err) {
      res.send(err);
    }
    else {
      if (sponsorShip.sponsor != authenticatedUserId) {
        res.status(401).send("The sponsor does not owns the sponsorship");
      } else {
        res.json(sponsorShip);
      }

    }
  });
};

exports.update_an_sponsorShip = function (req, res) {
  SponsorShip.findOneAndUpdate({ _id: req.params.sponsorShipId }, req.body, { new: true }, function (err, sponsorShip) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err)
      }
    }
    else {
      res.json(sponsorShip);
    }
  });
};

exports.update_an_sponsorShip_v2 = async function (req, res) {
  //Comprobar que es el SPONSOR que posee el sponsorship  
  var idToken = req.headers['idToken'];
  var authenticatedUserId = await authController.getUserId(idToken);

  SponsorShip.findById(req.params.sponsorShipId, function (err, sponsorship) {
    if (sponsorship.sponsor != authenticatedUserId) {
      res.status(401).send("The sponsor does not owns the sponsorship");
    } else {
      SponsorShip.findOneAndUpdate({ _id: req.params.sponsorShipId }, req.body, { new: true }, function (err, sponsorShip) {
        if (err) {
          if (err.name == 'ValidationError') {
            res.status(422).send(err);
          } else {
            res.status(500).send(err)
          }
        }
        else {
          res.json(sponsorShip);
        }
      });
    }
  });
};
exports.delete_an_sponsorShip_v2 = function (req, res) {
  var idToken = req.headers['idToken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  //Comprobar que es el SPONSOR que posee el sponsorship  
  SponsorShip.findById(req.params.sponsorShipId, function (err, sponsorship) {
    if (sponsorship.sponsor != authenticatedUserId) {
      res.status(401).send("The sponsor does not owns the sponsorship");
    } else {
      SponsorShip.remove({ _id: req.params.sponsorShipId }, function (err, sponsorShip) {
        if (err) {
          res.send(err);
        }
        else {
          res.json({ message: 'SponsorShip successfully deleted' });
        }
      });
    }
  });
};

exports.delete_an_sponsorShip = async function (req, res) {
  SponsorShip.remove({ _id: req.params.sponsorShipId }, function (err, sponsorShip) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'SponsorShip successfully deleted' });
    }
  });
};


exports.pay = function (req, res) {
  SponsorShip.findByIdAndUpdate(req.params.sponsorShipId, { isPaid: true }, { new: true }, function (err, sponsorShip) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err)
      }
    }
    else {
      res.json(sponsorShip);
    }
  })
};

exports.configure_flat_rate = function (req, res) {
  SponsorShip.findByIdAndUpdate(req.params.sponsorShipId, { flatRate: req.body.flatRate }, { new: true }, function (err, sponsorShip) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err)
      }
    }
    else {
      res.json(sponsorShip);
    }
  })
};


exports.pay_v2 = async function (req, res) {
  //Only can pay sponsorships he/she manages
  var idToken = req.headers['idToken'];
  var authenticatedUserId = await authController.getUserId(idToken);

  SponsorShip.findById(req.params.sponsorShipId, function (err, sponsorship) {
    if (sponsorship.sponsor != authenticatedUserId) {
      res.status(401).send("The sponsor does not owns the sponsorship");
    } else {
      SponsorShip.findByIdAndUpdate(req.params.sponsorShipId, { isPaid: true }, { new: true }, function (err, res) {
        if (err) {
          if (err.name == 'ValidationError') {
            res.status(422).send(err);
          } else {
            res.status(500).send(err)
          }
        }
        else {
          res.json(sponsorShip);
        }
      });
    }
  });

};

exports.delete_all_sponsorShips = function (req, res) {
  SponsorShip.remove({}, function (err, sponsorShip) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'SponsorShips successfully deleted' });
    }
  });
};

exports.delete_all_sponsorShips_v2 = async function (req, res) {
  //Only can delete his or her sponsorships
  var idToken = req.headers['idToken'];
  var authenticatedUserId = await authController.getUserId(idToken);

  SponsorShip.remove({ sponsor: authenticatedUserId }, function (err, sponsorShip) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'SponsorShips successfully deleted' });
    }
  });
};


