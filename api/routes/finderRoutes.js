'use strict';
module.exports = function (app) {
    var finders = require('../controllers/finderController');

    app.route('/finders')
        .get(finders.list_all_finders)
        .post(finders.create_a_finder);

    app.route('/finder/:finderId')
        .get(finders.read_a_finder)
        .put(finders.update_a_finder)
        .delete(finders.delete_a_finder);
};