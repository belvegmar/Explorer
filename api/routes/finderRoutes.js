'use strict';
module.exports = function (app) {
    var finders = require('../controllers/finderController');

    /**
     *  Create a finder
     *  RequiredRoles: Explorer
     * 
     * @section finders
     * @type post
     * @url /v1/finders
     */

    app.route('/v1/finders')
        .post(finders.create_a_finder);

    /**
    * Get finder by Explorer id
    *    RequiredRoles: Explorer
    * Update a finder by Explorer id
    *    RequiredRoles: Explorer
    *
    * @section finders
    * @type get put
    * @url /v1/finders/:actorId
    */
    app.route('/v1/finders/:actorId')
        .get(finders.read_a_finder)
        .put(finders.update_a_finder);
    //.delete(finders.delete_a_finder);

    /**
     * Get the trips specified by the finder
     *  Requiredroles: Explorer
     * 
     * @section finders
     * @type get
     * @url /v1/finders/:actorId/search
     */
    app.route('/v1/finders/:actorId/search')
        .get(finders.search_trips);


 /**
* Display dashboard
*    RequiredRoles: Administrator 
*
* @section finders
* @type get
* @url /v1/finders/dashboard
*/
app.route('/v1/finders/dashboard')
.get(finders.display_dashboard);



};