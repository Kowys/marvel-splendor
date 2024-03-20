var express = require('express');
var sql = require('../mysql_queries');

var router = express.Router();
var conn = sql.createConn();

/* Render game interface for given instance. */
router.get('/:id', function(request, response, next) {
	var uniqueId = request.params.id;
	sql.assertDBAndTables(conn);
	response.render('interface', { title: 'Marvel Splendor', layout: "interface_layout"});
});

module.exports = router;
