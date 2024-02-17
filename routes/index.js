var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Marvel Splendor', layout: "index_layout"});
});

module.exports = router;
