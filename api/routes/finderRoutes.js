'use strict';
module.exports = function (app) {
    var finders = require('../controllers/finderController');
    var authController = require('../controllers/authController');

    /* ####################################################################################################################
                                          VERSIÓN 1 DE LA API SIN LA AUTENTICACIÓN
   ####################################################################################################################
*/


    /**
     * Get all finders
     *  RequiredRoles: None
     * Create a finder
     *  RequiredRoles: None
     * Delete all finders
     *  RequiredRoles: None
     * 
     * @section finders
     * @type post
     * @url /v1/finders
     */

    app.route('/v1/finders')
        .post(finders.create_a_finder)
        .delete(finders.delete_all_finders)
        .get(finders.list_all_finders)
        ;


          /**
     * Get the trips specified by the finder
     *  Requiredroles: None
     * 
     * @section finders
     * @type get
     * @url /v1/finders/:actorId/search
     */
    app.route('/v1/finders/search/:actorId')
    .get(finders.search_trips);
    /**
    * Get finder by Explorer id
    *    RequiredRoles: None
    * Update a finder by Explorer id
    *    RequiredRoles: None
    *
    * @section finders
    * @type get put
    * @url /v1/finders/:actorId
    */
    app.route('/v1/finders/:actorId')
        .get(finders.read_a_finder)
        .put(finders.update_a_finder)
        .delete(finders.delete_a_finder);

  


 /* ####################################################################################################################
                                          VERSIÓN 2 DE LA API CON LA AUTENTICACIÓN
   ####################################################################################################################
*/



            /**
     *  Create a finder
     *  RequiredRoles: Explorer
     * 
     * @section finders
     * @type post
     * @url /v2/finders
     */

    app.route('/v2/finders')
    .post(authController.verifyUser(["EXPLORER"]),finders.create_a_finder_v2);

/**
* Get finder by Explorer id
*    RequiredRoles: Explorer
* Update a finder by Explorer id
*    RequiredRoles: Explorer
*
* @section finders
* @type get put
* @url /v2/finders/:actorId
*/
app.route('/v2/finders/:actorId')
    .get(authController.verifyUser(["EXPLORER"]),finders.read_a_finder)
    .put(authController.verifyUser(["EXPLORER"]),finders.update_a_finder_v2)
    .delete(finders.delete_a_finder);

/**
 * Get the trips specified by the finder
 *  Requiredroles: Explorer
 * 
 * @section finders
 * @type get
 * @url /v1/search_trips_finder
 */
app.route('/v1/search_trips_finder')
    .get(authController.verifyUser(["EXPLORER"]),finders.search_trips_v2);






};