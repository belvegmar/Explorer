var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  mongoose = require('mongoose'),
  Actor = require('./api/models/actorModel'),
  Application = require('./api/models/applicationModel'),
  Finder = require('./api/models/finderModel'),
  SponsorShip = require('./api/models/sponsorShipModel'),
  Trip = require('./api/models/tripModel'),
  DataWareHouse = require('./api/models/dataWareHouseModel'),
  DataWareHouseTools = require('./api/controllers/dataWareHouseController'),
  bodyParser = require('body-parser'),
  admin = require('firebase-admin'),
  serviceAccount = require('./explorer-2de26-firebase-adminsdk-clzsc-8724263a2a.json');

var cors = require('cors');

// MongoDB URI building
var mongoDBUser = process.env.mongoDBUser || "myUser";
var mongoDBPass = process.env.mongoDBPass || "myUserPassword";
var mongoDBCredentials = (mongoDBUser && mongoDBPass) ? mongoDBUser + ":" + mongoDBPass + "@" : "";

var mongoDBHostname = process.env.mongoDBHostname || "localhost";
var mongoDBPort = process.env.mongoDBPort || "27017";
var mongoDBName = process.env.mongoDBName || "ACME-Explorer";

var mongoDBURI = "mongodb://" + mongoDBCredentials + mongoDBHostname + ":" + mongoDBPort + "/" + mongoDBName;



mongoose.connect(mongoDBURI, {
    reconnectTries: 10,
    reconnectInterval: 500,
    poolSize: 10, // Up to 10 sockets
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // skip trying IPv6
    useNewUrlParser: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var adminConfig = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://explorer-2de26.firebaseio.com"
};
admin.initializeApp(adminConfig);

var routesActors = require('./api/routes/actorRoutes');
var routesApplications = require('./api/routes/applicationRoutes'); 
var routesFinders = require('./api/routes/finderRoutes');
var routesSponsorShips = require('./api/routes/sponsorShipRoutes');
var routesTrips = require('./api/routes/tripRoutes');
var routesDataWareHouse = require('./api/routes/dataWareHouseRoutes');
var routesLogin = require('./api/routes/loginRoutes');


routesActors(app);
routesApplications(app);
routesFinders(app);
routesSponsorShips(app);
routesTrips(app);
routesDataWareHouse(app);
routesLogin(app);

DataWareHouseTools.createDataWareHouseJob();


console.log("Connecting DB to: " + mongoDBURI);
mongoose.connection.on("open", function (err, conn) {
    app.listen(port, function () {
        console.log('ACME-Explorer RESTful API server started on: ' + port);
    });
});

mongoose.connection.on("error", function (err, conn) {
    console.error("DB init error " + err);
});

