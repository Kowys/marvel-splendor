var express = require('express');
var router = express.Router();

/* GET game state. */
router.get('/', function(req, res, next) {
  res.render('interface', { title: 'Marvel Splendor', layout: "interface_layout"});
});

module.exports = router;
