var express = require('express');
var router = express.Router();
var request = require('request');

/* GET quiz listing. */
router.get('/', function(req, res, next) {
  res.render('quiz');
});

/* uid: qCjOnG
api key:6ba04dc17d625daf2b48d2d44f2c76c99f21444b */

router.get('/results', function(req,res,next) {
	/* make get request for most recent typeform */
	request('https://api.typeform.com/v1/form/qCjOnG?key=6ba04dc17d625daf2b48d2d44f2c76c99f21444b&order_by[]=date_submit,desc&offset=0&limit=1',function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.stringify(JSON.parse(body), null, 4));
		}
	})
	res.render('results');
});

module.exports = router;