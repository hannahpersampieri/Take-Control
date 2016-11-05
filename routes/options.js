var express = require('express');
var router = express.Router();
var fs = require('fs');
var options_file = fs.readFileSync('data/options.json');
var options = JSON.parse(options_file);

/* GET options listing. */
router.get('/', function(req, res, next) {
  res.render('options', options);
});

module.exports = router;