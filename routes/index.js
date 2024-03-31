var express = require('express');
var sql = require('../mysql_queries');
var uuid = require('uuid');
var eventsRouter = require('./events');

var router = express.Router();
var conn = sql.createConn();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Marvel Splendor', layout: "index_layout"});
});

/* Create new game state in DB */
router.get('/new-game-state', function(request, response, next) {
	// Generate unique game ID
	var numPlayers = 2;
	var uniqueUrls = [];
	for (i = 1; i <= numPlayers; i++) {
		var uniqueUrl = uuid.v4();
		console.log('Unique URL:', uniqueUrl);
		uniqueUrls.push([uniqueUrl, i]);
	};

	// Create new game state in DB
	sql.newGameTable(conn, uniqueUrls, numPlayers);

	// Return unique ID to create game URL
	var params = {};
	params.uniqueUrls = uniqueUrls;
	response.send(params);
});

/* Retrieve current game state from DB */
router.get('/get-game-state', async function(request, response, next) {
	var data = await sql.retrieveGameTable(conn, request.query.url_id);
	console.log(`Num players: ${data.num_players}`)
	response.send(data);
});

/* Update DB with current game state */
router.post('/action-update', async function(request, response, next) {
	sql.insertNewAction(conn, request.body);
	console.log(`DB updated`);
	eventsRouter.sendEventsToAll("abc");
	response.send("Success");
});

/* GET count from DB. */
router.get('/get-counter', async function(request, response, next) {
	var permCount = await sql.getCurrentPermCounter(conn);
	var params = {};
	params.count = permCount;

	response.send(params);
});

/* POST to DB. */
router.get('/increment-counter', function(request, response, next) {
	sql.incrementPermCounter(conn, request.query.inc)
	response.json({success: true});
});

module.exports = router;
