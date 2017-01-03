var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('map', { title: 'Health Centers Near You' });
});

module.exports = router;
