var exports = module.exports = {};
var request = require('request');

exports.path = 'feedback';

exports.getHandle = function(req, res) {
	var userId = req.loginUserID;
	var communityId = req['accessParams']['communityID'];
	var matchId = req['accessParams']['matchID'];
	var rating = req.query.rating;

	request({
		url: process.env.BASE_URL + '/cat/user/community/feedback/' + communityId + '/' + matchId + '/update',
		method: 'POST',
		json: true,
		body: {
			data: [{
				fieldID: 1,
				choices: [rating]
			}]
		},
		qs: {
			access: req.query.access
		}
	}, function(error, response, body) {
		console.log('request sent');
		if (error) {
			res.send("Something went wrong. Uh oh!");
			console.log("error\n" + error);
			console.log("response\n" + response);
			console.log("body\n" + body);
		} else {
			res.render('feedback');
		}
	});
}