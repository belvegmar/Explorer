'use strict';
module.exports = function (app) {
  var sponsorShips = require('../controllers/sponsorShipController');

/**
 * Get his or her sponsorships
 *  Required Role: Sponsor
 * 
 * Modify an sponsorship
 *  Required Role: be te sponsor who own the sponsorship
 *
 * Modify the flat rate
 *  Requried Role: be an administrator
 * 
 * Delete an sponsorship
 *  Required Role: be te sponsor who own the sponsorship

 * 
 * @section sponsorships
 * @type get put delete
 * @url /v1/sponsorShips/:sponsorShipId
 */

 app.route('/v1/sponsorShips/:sponsorShipId')
 .get(sponsorShips.read_an_sponsorShip)
 .put(sponsorShips.update_an_sponsorShip)
 .delete(sponsorShips.delete_an_sponsorShip);


/**
 * Create a new sponsorship
 *  Required Role: Sponsor
 * 
 * @since sponsorships
 * @type post
 * @url /v1/sponsoShips
 */
  app.route('/sponsorShips')
    //.get(sponsorShips.list_all_sponsorShips)
    .post(sponsorShips.create_an_sponsorShip)
    //.delete(sponsorShips.delete_all_sponsorShips);

    /**
 * Pay an sponsorship
 *  Required Role: Sponsor and own the sponsorship
 * 
 * 
 * @section sponsorships
 * @type put
 * @url /v1/sponsorShips/:sponsorShipId/pay
 */

 app.route('/v1/sponsorShips/:sponsorShipId/pay')
 .put(sponsorShips.pay);


};

