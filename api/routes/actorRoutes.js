'use strict';
module.exports = function (app) {
  var actors = require('../controllers/actorController');
  var authController = require('../controllers/authController');


  /* ####################################################################################################################
                                          VERSIÓN 1 DE LA API sin LA AUTENTICACIÓN
     ####################################################################################################################
*/
  /**
 * Get actors 
 *    RequiredRoles: None
 * Post an actor 
 *    RequiredRoles: None
 *    If it is not authentication only Explorers can be created
 * Delete all actors
 *    
 *
 * @section actors
 * @type get post delete
 * @url /v1/actors
 * @param {string} role (manager|administrator|explorer|sponsor) 
*/
  app.route('/v1/actors')
    .get(actors.list_all_actors)
    .post(actors.create_an_actor)
    .delete(actors.delete_all_actors);


   /**
 * Change banned status of an actor 
 *  Required role: None
 * 
 * @section actors
 * @type put
 * @url /v1/actors/:actorId/ban
 * @param {string} ban_status
 */
app.route('/v1/actors/:actorId/banned')
.put(actors.change_banned_status);



  /**
* Get an actor (any role)
*    Required role: None
* Put an actor 
*    RequiredRoles: None
* Delete an actor
     RequiredRoles:None
*    
* @section actors
* @type get post delete
* @url /v1/actors/:actorId
*/

  app.route('/v1/actors/:actorId')
    .get(actors.read_an_actor)
    .put(actors.update_an_actor)
    .delete(actors.delete_an_actor);

 


/* ####################################################################################################################
                                          VERSIÓN 2 DE LA API CON LA AUTENTICACIÓN
   ####################################################################################################################
*/

  /**
 * Get actors 
 *    RequiredRoles: Administrator
 * Delete all actors
 *     RequiredRoles: Administrator
 * An authenticated user can't register again
 *    
 *
 * @section actors
 * @type get post delete
 * @url /v2/actors
 * @param {string} role (manager|administrator|explorer|sponsor) 
*/
app.route('/v2/actors')
.get(authController.verifyUser(["ADMINISTRATOR"]), actors.list_all_actors)
.delete(authController.verifyUser(["ADMINISTRATOR"]), actors.delete_all_actors);


   /**
 * Change banned status of an actor 
 *  Required role: Administrator
 * 
 * @section actors
 * @type put
 * @url /v2/actors/:actorId/ban
 * @param {string} ban_status
 */
app.route('/v2/actors/:actorId/banned')
.put(authController.verifyUser(["ADMINISTRATOR"]), actors.change_banned_status);

  /**
   * Put an actor
   *    RequiredRoles: to be the proper actor and be authenticated
   * Get an actor
   *    RequiredRoles: Administrator or be the proper actor
   * Delete an actor
   *    RequiredRoles: Administrator
	 *
	 * @section actors
	 * @type get put
	 * @url /v2/actors/:actorId
  */  
 app.route('/v2/actors/:actorId')
 .get(authController.verifyUser(["ADMINISTRATOR","EXPLORER","MANAGER","SPONSOR"]), actors.read_an_actor_v2)
 .put(authController.verifyUser(["ADMINISTRATOR","EXPLORER","MANAGER","SPONSOR"]),actors.update_an_actor_v2)
 .delete(authController.verifyUser(["ADMINISTRATOR"]), actors.delete_an_actor); 





};


     
