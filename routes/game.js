var express = require('express');
var sql = require('../mysql_queries');

var router = express.Router();
var conn = sql.createConn();

/* GET game state. */
router.get('/', function(request, response, next) {
	sql.assertDBAndTables(conn);
	response.render('interface', { title: 'Marvel Splendor', layout: "interface_layout"});
});

/* GET count from DB. */
router.get('/get-counter', async function(request, response, next) {
	var permCount = await sql.getCurrentPermCounter(conn);
	var params = {};
	params.count = permCount;

	response.send(params);
});

/* POST to DB. */
router.post('/increment-counter', function(request, response, next) {
	sql.incrementPermCounter(conn, request.body.increment)
	response.json({success: true});
});

module.exports = router;
