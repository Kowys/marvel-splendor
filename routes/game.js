var express = require('express');
var sql = require('../sql_queries');

var router = express.Router();

/* GET game state. */
router.get('/', function(request, response, next) {
	sql.assertDBAndTables();
	response.render('interface', { title: 'Marvel Splendor', layout: "interface_layout"});
});

/* GET count from DB. */
router.get('/get-counter', async function(request, response, next) {
	var permCount = await sql.getCurrentPermCounter();
	var params = {};
	params.count = permCount;

	response.send(params);
});

/* POST to DB. */
router.post('/increment-counter', function(request, response, next) {
	sql.incrementPermCounter(request.body.increment)
	response.json({success: true});
});

module.exports = router;
