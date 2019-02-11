'use strict';
module.exports = function (app) {
    var trips = require('../controllers/tripController');

    app.route('/trips')
        .get(trips.list_all_trips)
        .post(trips.create_a_trip);

    app.route('/trips/:tripId')
        .get(trips.read_a_trip)
        .put(trips.update_a_trip)
        .delete(trips.delete_a_trip);

    var stages = require('../controllers/tripController');

    app.route('/stages')
        .get(stages.list_all_stages)
        .post(stages.create_a_stage);

    app.route('/stages/:stageId')
        .get(stages.read_a_stage)
        .put(stages.update_a_stage)
        .delete(stages.delete_a_stage);
};