'use strict';
module.exports = function(app) {
	var store = require('../controllers/storeController');

  // Data Storage routes

  /**
	 * Bad option: Put a large json with documents from a file into a collection of mongoDB
	 *
	 * @section store
	 * @type post
	 * @url /v1/store/insertMany
     * @param {string} mongooseModel  //mandatory
	 * @param {string} sourceFile   //mandatory
	 * Sample 1: http://localhost:8080/v1/store/insertMany?dbURL=mongodb://myUser:myUserPassword@localhost:27017/ACME-Explorer&mongooseModel=Actors&sourceFile=C:/Users/marin/OneDrive/Documentos/MASTER/SaaS/actores.json
  */
  app.route('/v1/store/insertMany')
 		.post(store.store_json_insertMany);

  /**
	 * Put a large json with documents from a file into a collection of mongoDB
	 *
	 * @section store
	 * @type post
	 * @url /v1/store/fs
	 * @param {string} dbURL       //mandatory
     * @param {string} collection  //mandatory
	 * @param {string} sourceURL   //mandatory
	 * @param {string} batchSize   //optional
	 * @param {string} parseString //optional
	 * Sample 1: http://localhost:8080/v1/store/fs?dbURL=mongodb://myUser:myUserPassword@localhost:27017/ACME-Explorer&collection=test&batchSize=10000&parseString=rows.*&sourceFile=C:/Users/marin/OneDrive/Documentos/MASTER/SaaS/many_npm.json
	 * Sample 2: http://localhost:8080/v1/store/fs?dbURL=mongodb://myUser:myUserPassword@localhost:27017/ACME-Explorer&collection=actors&batchSize=10000&parseString=rows.*&sourceFile=C:/Users/marin/OneDrive/Documentos/MASTER/SaaS/many_actores.json
	 * Sample 3: http://localhost:8080/v1/store/fs?dbURL=mongodb://myUser:myUserPassword@localhost:27017/ACME-Explorer&collection=actors&batchSize=10000&parseString=*&sourceFile=C:/Users/marin/OneDrive/Documentos/MASTER/SaaS/actores.json
  */
  app.route('/v1/store/fs')
		.post(store.store_json_fs);


  /**
	 * Put a large json with documents from an URL into a collection of mongoDB
	 *
	 * @section store
	 * @type post
	 * @url /v1/store/url
	 * @param {string} dbURL       //mandatory
     * @param {string} collection  //mandatory
	 * @param {string} sourceURL   //mandatory
	 * @param {string} batchSize   //optional
	 * @param {string} parseString //optional
	 * Sample 1: http://localhost:8080/v1/store/url?dbURL=mongodb://myUser:myUserPassword@localhost:27017/ACME-Explorer&collection=actors&batchSize=100&parseString=rows.*&sourceURL=https://drive.google.com/uc?export=download%26id=166OpKbV1GYozSFt7nZwx6h7xBdd_cN8-
	 * Sample 2: http://localhost:8080/v1/store/url?dbURL=mongodb://myUser:myUserPassword@localhost:27017/ACME-Explorer&collection=actors&batchSize=100&parseString=*&sourceURL=https://drive.google.com/uc?export=download%26id=1Rii6CIvOkyLVamFtEeKZ--9dWnTxCXe9
	 * Sample 3: http://localhost:8080/v1/store/url?dbURL=mongodb://myUser:myUserPassword@localhost:27017/ACME-Explorer&collection=test&batchSize=100&parseString=rows.*&sourceURL=https://drive.google.com/uc?export=download%26id=15RB_KErHnldGjYCfeyGjxdN_Be_7UeO7
  */
  app.route('/v1/store/url')
 		.post(store.store_json_url);
};