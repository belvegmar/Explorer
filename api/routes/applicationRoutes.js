'use strict';
module.exports = function (app) {
   var applications = require('../controllers/applicationController');

   /**
* Get all applications
*    RequiredRoles: Manager
*    
* Post an application
*    RequiredRoles: Administrator

* @section trips
* @type post get  
* @url /v1/trips
*/
   app.route('/v1/applications')
      .get(applications.list_all_applications)
      .post(applications.create_an_application)
      .delete(applications.delete_all_applications);



   /**
     * Get an aplication giving applicationId
     *    RequiredRole: Manager  
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
     * Change application status 
     *    RequiredRole: Manager  
     * @section applications
     * @type put
     * @url /v1/applications/:applicationId/status
     * @param {string} status
    */
   app.route('/v1/applications/:applicationId/new_status')
      .put(applications.change_status);

   /**
     * Apply for an applicagtion 
     *    RequiredRole: Explorer  
     * @section applications
     * @type put
     * @url /v1/applications/:applicationId/apply
    */
   app.route('/v1/applications/:applicationId/apply')
      .put(applications.apply);

   /**
      * Get application made by status
      *    RequiredRole: Explorer  
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



}