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
* @section trips
* @type post get 
* @url /v1/trips
*/
app.route('/v1/applications')
.get(applications.list_all_applications)
.post(applications.create_an_application)
.delete(applications.delete_all_applications);


/**
* Change application status 
*    RequiredRole: None  
* @section applications
* @type put
* @url /v1/applications/:applicationId/change_status
* @param {string} status
*/
app.route('/v1/applications/:applicationId/change_status')
.put(applications.change_status);

/**
* Get an aplication giving applicationId
*    RequiredRole: none
* Modify an aplication giving applicationId
*     RequiredRole:none
* @section applications
* @type get, put
* @url /v1/applications/:applicationId
* @param {string} applicationId
*/
app.route('/v1/applications/:applicationId')
.get(applications.read_an_application)
.put(applications.update_an_application)
.delete(applications.delete_an_application);




/**
* Get application made by status
*    RequiredRole: None  
* @section applications
* @type get
* @url /v1/applications/:applicationId/search
*/
app.route('/v1/search_application_by_status')
.get(applications.search_by_status);

/**
* Pay an application with status DUE
*    RequiredRole: Explorer  
* @section applications
* @type get
* @url /v1/applications/:applicationId/search
*/
app.route('/v1/applications/:applicationId/search')
.put(applications.search_by_status);


/**
* Cancel an application
*    RequiredRole: Explorer  
*    Status --> "PENDING" or "ACCEPTED"
* @section applications
* @type put
* @url /v1/applications/:applicationId/cancel
*/
app.route('/v1/applications/:applicationId/cancel')
.put(applications.cancel);


/**
* Pay an application
*    RequiredRole: Explorer  
*    Status --> "DUE"
* @section applications
* @type put
* @url /v1/applications/:applicationId/payment
*/
app.route('/v1/applications/:applicationId/payment')
.put(applications.pay_application);




  /* ####################################################################################################################
                                          VERSIÓN 2 DE LA API CON LA AUTENTICACIÓN
     ####################################################################################################################
*/

   /**
* Get all applications
*    RequiredRoles: Manager
*    
* Apply for an application
*    RequiredRoles: Explorer

* @section trips
* @type post get  
* @url /v1/trips
*/
   app.route('/v2/applications')
      .get(authController.verifyUser(["MANAGER"]), applications.list_all_applications)
      .post(authController.verifyUser(["EXPLORER"]), applications.create_an_application)



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
      .put(authController.verifyUser(["MANAGEER"]), applications.change_status_v2);



//    /**
//       * Get application made by status
//       *    RequiredRole: Explorer  
//       * @section applications
//       * @type get
//       * @url /v1/applications/:applicationId/search
//      */
//    app.route('/v1/search_application_by_status')
//       .get(applications.search_by_status);

//    /**
//   * Pay an application with status DUE
//   *    RequiredRole: Explorer  
//   * @section applications
//   * @type get
//   * @url /v1/applications/:applicationId/search
//  */
//    app.route('/v1/applications/:applicationId/search')
//       .put(applications.search_by_status);


//    /**
//  * Cancel an application
//  *    RequiredRole: Explorer  
//  *    Status --> "PENDING" or "ACCEPTED"
//  * @section applications
//  * @type put
//  * @url /v1/applications/:applicationId/cancel
// */
//    app.route('/v1/applications/:applicationId/cancel')
//       .put(applications.cancel);


//    /**
//  * Pay an application
//  *    RequiredRole: Explorer  
//  *    Status --> "DUE"
//  * @section applications
//  * @type put
//  * @url /v1/applications/:applicationId/payment
// */
// app.route('/v1/applications/:applicationId/payment')
// .put(applications.pay_application);



}