'use strict';
module.exports = function (app) {
  var actors = require('../controllers/actorController');
  var authController = require('../controllers/authController');

  /**
 * Get actors 
 *    RequiredRoles: Administrator
 * Post an actor 
 *    RequiredRoles: None
 *    Can't be authenticated
 *    
 *
 * @section actors
 * @type get post
 * @url /v1/actors
 * @param {string} role (manager|administrator|explorer|sponsor) 
*/
  app.route('/v1/actors')
    .get(actors.list_all_actors)
    .post(actors.create_an_actor)
    .delete(actors.delete_all_actors);

  /**
* Get an actor (any role)
*    Required role: Administrator or be the proper actor
* Put an actor 
*    RequiredRoles: to be the proper actor and be authenticated
*    
* @section actors
* @type get post
* @url /v1/actors/:actorId
*/

  app.route('/v1/actors/:actorId')
    .get(actors.read_an_actor)
    .put(actors.update_an_actor)
    .delete(actors.delete_an_actor);

    /**
 * Change banned status of an actor
 *  Required role: Administrator
 * 
 * @section actors
 * @type put
 * @url /v1/actors/:actorId/ban
 * @param {Boolean} ban_status
 */
app.route('/v1/actors/:actorId/banned')
.put(actors.change_banned_status);


  /**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: any
	 *
	 * @section actors
	 * @type get put
	 * @url /v2/actors/:actorId
  */  
 app.route('/v2/actors/:actorId')
 .get(actors.read_an_actor)
 .put(authController.verifyUser(["ADMINISTRATOR","EXPLORER","MANAGER","SPONSOR"]),actors.update_an_actor_v2) 
};


     
