'use strict';
module.exports = function (app) {
  var sponsorShips = require('../controllers/sponsorShipController');
  var authController = require('../controllers/authController');

   /* ####################################################################################################################
                                          VERSIÓN 1 DE LA API SIN LA AUTENTICACIÓN
   ####################################################################################################################
*/

/**
 * Create a new sponsorship
 *  Required Role: none
 * 
 * @since sponsorships
 * @type get post delete
 * @url /v1/sponsoShips
 */
app.route('/v1/sponsorShips')
.get(sponsorShips.list_all_sponsorShips)
.post(sponsorShips.create_an_sponsorShip)
.delete(sponsorShips.delete_all_sponsorShips);


    /**
 * Pay an sponsorship
 *  Required Role: none
 * 
 * 
 * @section sponsorships
 * @type put
 * @url /v1/sponsorShips/:sponsorShipId/pay
 */

app.route('/v1/sponsorShips/:sponsorShipId/pay')
.put(sponsorShips.pay);

   /**
 * Configure a flat rate
 *  Required Role: none
 * 
 * 
 * @section sponsorships
 * @type put
 * @url /v1/sponsorShips/:sponsorShipId/flat_rate
 */

app.route('/v1/sponsorShips/:sponsorShipId/flat_rate')
.put(sponsorShips.configure_flat_rate);

/**
 * Get his or her sponsorships
 *  Required Role: none
 * 
 * Modify an sponsorship
 *  Required Role: none
 *
 * Modify the flat rate
 *  Requried Role: none
 * 
 * Delete an sponsorship
 *  Required Role: none

 * 
 * @section sponsorships
 * @type get put delete
 * @url /v1/sponsorShips/:sponsorShipId
 */

 app.route('/v1/sponsorShips/:sponsorShipId')
 .get(sponsorShips.read_an_sponsorShip)
 .put(sponsorShips.update_an_sponsorShip)
 .delete(sponsorShips.delete_an_sponsorShip);






 /* ####################################################################################################################
                                          VERSIÓN 2 DE LA API CON LA AUTENTICACIÓN
   ####################################################################################################################
*/

/**
 * Get all sponsorships
 *  Required Role: Sponsor and only sponsorsips he/she manages
 * Post a new sponsorship:
 *  Required Role: Sponsor
 * Delete all sponsorships:
 *  Required Role: Sponsor and only sponsorsips he/she manages
 * 
 * @since sponsorships
 * @type get post delete
 * @url /v2/sponsoShips
 */
app.route('/v2/sponsorShips')
.get(authController.verifyUser(["SPONSOR"]),sponsorShips.list_all_sponsorShips_v2)
.post(authController.verifyUser(["SPONSOR"]),sponsorShips.create_an_sponsorShip_v2)
.delete(authController.verifyUser(["SPONSOR"]),sponsorShips.delete_all_sponsorShips_v2);


    /**
 * Pay an sponsorship
 *  Required Role: Sponsor and own the sponsorship
 * 
 * 
 * @section sponsorships
 * @type put
 * @url /v1/sponsorShips/:sponsorShipId/pay
 */

app.route('/v2/sponsorShips/:sponsorShipId/pay')
.put(authController.verifyUser(["SPONSOR"]), sponsorShips.pay_v2);

   /**
 * Configure a flat rate
 *  Required Role: Administrator
 * 
 * 
 * @section sponsorships
 * @type put
 * @url /v2/sponsorShips/:sponsorShipId/flat_rate
 */

app.route('/v2/sponsorShips/:sponsorShipId/flat_rate')
.put(authController.verifyUser(["ADMINISTRATOR"]),sponsorShips.configure_flat_rate);

/**
 * Get his or her sponsorships
 *  Required Role: Sponsor and owns the sponsorship
 *
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

 app.route('/v2/sponsorShips/:sponsorShipId')
 .get(authController.verifyUser(["SPONSOR"]),sponsorShips.read_an_sponsorShip)
 .put(authController.verifyUser(["SPONSOR"]),sponsorShips.update_an_sponsorShip_v2)
 .delete(authController.verifyUser(["SPONSOR"]),sponsorShips.delete_an_sponsorShip_v2);


};

