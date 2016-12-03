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
	"yesno_35790422":2
}

function calculate_score(response, type){
	var score = 0;
	var method = answers[type];
	for(i in questions){
		question_id = questions[i];
		if (response[question_id] in method[question_id]){
			weight = weights[question_id];
			score += weight;
		}
		// hack-y way of getting questions to rank lower if need be-- important for "dealbreakers"
		if(question_id == "list_35790302_choice" && response[question_id] == "I'm not at all" && (type == "IUD" || type == "Sponge" || type == "Ring" || type == "Cap")){
			score = score - 5;
		}
		
		if(question_id == "dropdown_35790400" && response[question_id] != "None" && (type == "Pill" || type == "Shot")){
			score = score - 20;
		}
	}
	console.log(type + " " + score);
	return score;
};

router.get('/results', function(req,res,next) {
	/* make get request for most recent typeform */
	var max_type = "";
	request('https://api.typeform.com/v1/form/qCjOnG?key=6ba04dc17d625daf2b48d2d44f2c76c99f21444b&order_by[]=date_submit,desc&offset=0&limit=1',function (error, response, body) {
		if (!error && response.statusCode == 200) {
			result = JSON.parse(body);
			console.log(JSON.stringify(result, null, 4));
			var max = 0;
			var key_list = Object.keys(answers);
			for (key_index in key_list){
				type = key_list[key_index];
				var score = calculate_score(result.responses[0].answers, type);
				if (score > max){
					max = score;
					max_type = type;
				}
			}
			res.render('results', options.options[max_type]);
		}
	})
});

module.exports = router;