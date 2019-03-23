'use strict';
module.exports = function (app) {
   var applications = require('../controllers/applicationController');
   var authController = require('../controllers/authController');


  /* ####################################################################################################################
                                          VERSIÓN 1 DE LA API sin LA AUTENTICACIÓN
     ####################################################################################################################
*/


 /**
* Get all applications
*    RequiredRoles: none    
* Apply for an application
*    RequiredRoles: none  
* Delete all applications
*    RequiredRoles: none  
* @section trips
* @type post get delete
* @url /v1/trips
*/
app.route('/v1/applications')
.get(applications.list_all_applications)
.post(applications.create_an_application)
.delete(applications.delete_all_applications);

/**
* Get application made by status
*    RequiredRole: None  
* @section applications
* @type get
* @url /v1/applications/search
*/
app.route('/v1/applications/search')
.get(applications.search_by_status);


/**
* Change application status 
*    RequiredRole: None 
     Status can change from PENDING TO REJECTED OR FROM PENDING TO DUE
* @section applications
* @type put
* @url /v1/applications/:applicationId/change_status
* @param {string} status
*/
app.route('/v1/applications/:applicationId/change_status')
.put(applications.change_status);

/**
* Cancel an application
*    RequiredRole: None  
*    Status --> "PENDING" or "ACCEPTED"
* @section applications
* @type put
* @url /v1/applications/:applicationId/cancel
*/
app.route('/v1/applications/:applicationId/cancel')
.put(applications.cancel);


/**
* Pay an application
*    RequiredRole: None  
*    Status --> Must be "DUE" if the explorer wants to pay the application
* @section applications
* @type put
* @url /v1/applications/:applicationId/payment
*/
app.route('/v1/applications/:applicationId/payment')
.put(applications.pay_application);

/**
* Get an aplication giving applicationId
*    RequiredRole: none
* Modify an aplication giving applicationId
*     RequiredRole:none
* Delete an application
*     RequiredRole:none
* @section applications
* @type get, put delete
* @url /v1/applications/:applicationId
* @param {string} applicationId
*/
app.route('/v1/applications/:applicationId')
.get(applications.read_an_application)
.put(applications.update_an_application)
.delete(applications.delete_an_application);












  /* ####################################################################################################################
                                          VERSIÓN 2 DE LA API CON LA AUTENTICACIÓN
     ####################################################################################################################
*/

   /**
* Get all applications
*    RequiredRoles: Manager and only applications he/she manages
*    
* Apply for an application
*    RequiredRoles: Explorer
         The trip must be published and not started or cancelled

* @section trips
* @type post get  
* @url /v1/trips
*/
   app.route('/v2/applications')
      .get(authController.verifyUser(["MANAGER"]), applications.list_all_applications)
      .post(authController.verifyUser(["EXPLORER"]), applications.create_an_application_v2)


         /**
      * Get application made by status
      *    RequiredRole: Explorer  
      * @section applications
      * @type get
      * @url /v1/applications/search
     */
   app.route('/v2/applications/search')
   .get(authController.verifyUser(["EXPLORER"]),applications.search_by_status_v2);

//    /**
//      * Get an aplication giving applicationId
//      *    RequiredRole: Manager  
//      * @section applications
//      * @type get, put
//      * @url /v1/applications/:applicationId
//      * @param {string} applicationId
//     */
//    app.route('/v1/applications/:applicationId')
//       .get(applications.read_an_application)
//       .put(applications.update_an_application)
//       .delete(applications.delete_an_application);

   /**
     * Change application status 
     *    RequiredRole: Manager  
     * @section applications
     * @type put
     * @url /v1/applications/:applicationId/change_status
     * @param {string} status
    */
   app.route('/v1/applications/:applicationId/change_status')
      .put(authController.verifyUser(["MANAGER"]), applications.change_status_v2);


   /**
 * Pay an application
 *    RequiredRole: Explorer and the explorer who applies for the trip
 *    Status --> "DUE"
 * @section applications
 * @type put
 * @url /v2/applications/:applicationId/payment
*/
app.route('/v2/applications/:applicationId/payment')
.put(authController.verifyUser(["EXPLORER"]),applications.pay_application_v2);





   /**
 * Cancel an application
 *    RequiredRole: Explorer and the explorer who applies for the trip 
 *    Status --> "PENDING" or "ACCEPTED"
 * @section applications
 * @type put
 * @url /v1/applications/:applicationId/cancel
*/
   app.route('/v1/applications/:applicationId/cancel')
      .put(authController.verifyUser(["EXPLORER"]), applications.cancel_v2);






}