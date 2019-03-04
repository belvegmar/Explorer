'use strict';
module.exports = function (app) {
    var trips = require('../controllers/tripController');

    /**
 * Manage catalogue of trips: 
 * Post trips
 *    RequiredRoles: Manager 
 *    
 * Get trips 
 *    RequiredRoles: any

 * @section trips
 * @type post get  
 * @url /v1/trips
*/
    app.route('/v1/trips')
        .get(trips.list_all_trips)
        .post(trips.create_a_trip)
        .delete(trips.delete_all_trips)


    /**
 * Manage individual trips: 
 * Put a trip or update it
 *    RequiredRoles: Manager
 *      tripStatus --> NOT PUBLISHED
 *    RequiredRoles: Explorer
 *       Can cancel a trip if it is published but has not started and not have accepted applications
 *
 * 
 * Delete a trip
 *    RequiredRoles: Manager
 *    tripStatus --> NOT PUBLISHED
 * 
 * Get a trip
 *    RequiredRoles: Manager

 * @section trips
 * @type get put delete 
 * @url /v1/trips/:tripId
*/
    app.route('/v1/trips/:tripId')
        .get(trips.read_a_trip)
        .put(trips.update_a_trip)
        .delete(trips.delete_a_trip);


    /**
* Cancel a trip 
*     RequiredRole: MANAGER

* @section trips
* @type put 
* @url /v1/trips/:tripId/cancel
*/
    app.route('/v1/trips/:tripId/cancel')
        .put(trips.cancel_trip);

    /**
* Search trips by a key word contained in tickers, titles or descriptions
* Get trips depending on params
*    RequiredRoles: any 
*
* @section trips
* @type get
* @url /v1/trips/search
* @param {string} startFrom
* @param {string} pageSize
* @param {string} reverse (true|false)
* @param {string} keyword //in ticker, title or description
*/
    app.route('/v1/search_trips')
        .get(trips.search_trips);





    // var stages = require('../controllers/tripController');
    // app.route('/stages')
    //     .get(stages.list_all_stages)
    //     .post(stages.create_a_stage)
    //     .delete(stages.delete_all_stages);

    // app.route('/stages/:stageId')
    //     .get(stages.read_a_stage)
    //     .put(stages.update_a_stage)
    //     .delete(stages.delete_a_stage);

};