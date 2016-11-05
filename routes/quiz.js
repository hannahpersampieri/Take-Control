var express = require('express');
var router = express.Router();

/* GET quiz listing. */
router.get('/', function(req, res, next) {
  res.render('quiz');
});

router.get('/results', function(req,res,next) {
	res.render('results');
});

module.exports = router;