'use strict';
module.exports = function (app) {
  var sponsorShips = require('../controllers/sponsorShipController');

  app.route('/sponsorShips')
    .get(sponsorShips.list_all_sponsorShips)
    .post(sponsorShips.create_an_sponsorShip)
    .delete(sponsorShips.delete_all_sponsorShips);

  app.route('/sponsorShips/:sponsorShipId')
    .get(sponsorShips.read_an_sponsorShip)
    .put(sponsorShips.update_an_sponsorShip)
    .delete(sponsorShips.delete_an_sponsorShip);
};

