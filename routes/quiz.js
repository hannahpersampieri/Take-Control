var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var answers_file = fs.readFileSync('data/answers.json');
var answers = JSON.parse(answers_file);
var options_file = fs.readFileSync('data/options.json');
var options = JSON.parse(options_file);

/* GET quiz listing. */
router.get('/', function(req, res, next) {
  res.render('quiz');
});

/* uid: qCjOnG
api key:6ba04dc17d625daf2b48d2d44f2c76c99f21444b */
/* QUESTION IDS CHANGE IF TYPEFORM IS CHANGED var longevity = "list_35790269_choice";
var insertion = "list_35790302_choice";
var hormones = "yesno_35790312";
var medications  = "dropdown_35790400";
var birth = "yesno_35790408";
var symptoms = "yesno_35790422";*/

var questions = ["list_35790269_choice","list_35790302_choice","yesno_35790312","dropdown_35790400", "yesno_35790408","yesno_35790422"];
var weights = {
	"list_35790269_choice":1,
	"list_35790302_choice":4,
	"yesno_35790312":3,
	"dropdown_35790400":6,
	"yesno_35790408": 5,
	"yesno_35790422":2,
}

function calculate_score(response, type){
	var score = 0;
	var method = answers[type];
	for(question_id in questions){
		if (response[question_id] in method[question_id]){
			weight = weights[question_id];
			score += weight;
		}
	}
	console.log(type + " " + score);
	return score;
};

router.get('/results', function(req,res,next) {
	/* make get request for most recent typeform */
	request('https://api.typeform.com/v1/form/qCjOnG?key=6ba04dc17d625daf2b48d2d44f2c76c99f21444b&order_by[]=date_submit,desc&offset=0&limit=1',function (error, response, body) {
		if (!error && response.statusCode == 200) {
			// TO_DO: process results and return what is best
			result = JSON.stringify(JSON.parse(body), null, 4);
			console.log(result);
			var max = 0;
			var max_type = "";
			for (type in Object.keys(answers)){
				var score = calculate_score(result.responses[0].answers, type);
				if (score > max){
					max = score;
					max_type = type;
				}
			}
		}
	})
	res.render('results', options[max_type]);
});

module.exports = router;