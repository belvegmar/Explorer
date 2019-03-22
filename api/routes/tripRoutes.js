'use strict';
module.exports = function (app) {
    var trips = require('../controllers/tripController');
    var authController = require('../controllers/authController');

 


  /* ####################################################################################################################
                                          VERSIÓN 1 DE LA API sin LA AUTENTICACIÓN
     ####################################################################################################################
*/


   /**
 * Manage catalogue of trips: 
 * Post trips
 *    RequiredRoles: none     
 * Get trips 
 *    RequiredRoles: none
 * Delete all trips
 *    RequiredRoles:none  

 * @section trips
 * @type post get delete
 * @url /v1/trips
*/
app.route('/v1/trips')
.get(trips.list_all_trips)
.post(trips.create_a_trip)
.delete(trips.delete_all_trips)


/**
* Search trips by a key word contained in tickers, titles or descriptions
* Get trips depending on params
*    RequiredRoles: none 
*
* @section trips
* @type get
* @url /v1/trips/search
* @param {string} startFrom
* @param {string} pageSize
* @param {string} reverse (true|false)
* @param {string} keyword //in ticker, title or description
*/
app.route('/v1/trips/search')
.get(trips.search_trips);

/**
* Manage individual trips: 
* Put a trip or update it
*    RequiredRoles: none
*    tripStatus --> NOT PUBLISHED
* Delete a trip
*    RequiredRoles: none
*    tripStatus --> NOT PUBLISHED
* 
* Get a trip
*    RequiredRoles: none

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
*     RequiredRole: none
      isPublished:true
      not started
      does not have any accepted applications

* @section trips
* @type put 
* @url /v1/trips/:tripId/cancel
*/
app.route('/v1/trips/:tripId/cancel')
.put(trips.cancel_trip);





  /* ####################################################################################################################
                                          VERSIÓN 2 DE LA API CON LA AUTENTICACIÓN
     ####################################################################################################################
*/

    /**
 * Manage catalogue of trips: 
 * Post trips
 *    RequiredRoles: MANAGER    
 * Get trips 
 *    RequiredRoles: MANAGER
 * Delete trips
 *    RequiredRoles: MANAGER

 * @section trips
 * @type post get  
 * @url /v2/trips
*/
    app.route('/v2/trips')
        .get(authController.verifyUser(["MANAGER"]), trips.list_all_trips)
        .post(authController.verifyUser(["MANAGER"]), trips.create_a_trip)
        .delete(authController.verifyUser(["MANAGER"]),trips.delete_all_trips)


    /**
 * Manage individual trips: 
 * Put a trip or update it
 *    RequiredRoles: Manager
 *      tripStatus --> NOT PUBLISHED
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
 * @url /v2/trips/:tripId
*/
    app.route('/v2/trips/:tripId')
        .get(authController.verifyUser(["MANAGER"]),trips.read_a_trip)
        .put(authController.verifyUser(["MANAGER"]),trips.update_a_trip)
        .delete(trips.delete_a_trip);


//     /**
// * Cancel a trip 
// *     RequiredRole: MANAGER

// * @section trips
// * @type put 
// * @url /v1/trips/:tripId/cancel
// */
//     app.route('/v1/trips/:tripId/cancel')
//         .put(trips.cancel_trip);

//     /**
// * Search trips by a key word contained in tickers, titles or descriptions
// * Get trips depending on params
// *    RequiredRoles: any 
// *
// * @section trips
// * @type get
// * @url /v1/trips/search
// * @param {string} startFrom
// * @param {string} pageSize
// * @param {string} reverse (true|false)
// * @param {string} keyword //in ticker, title or description
// */
//     app.route('/v1/search_trips')
//         .get(trips.search_trips);





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