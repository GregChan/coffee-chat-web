var exports = module.exports = {};
var request = require('request');

exports.path = 'feedback';

exports.getHandle = function(req, res) {
	var userId = req.query.userId;
	var communityId = req.query.communityId;
	var matchId = req.query.matchId;
	var rating = req.query.rating;

	request({
		url: process.env.BASE_URL + 'cat/user/community/feedback/' + communityId
									+ '/' + matchId + '/update',
		method: 'POST',
		form: {
			"data": [{
				fieldId: 1,
				choices: [rating]
			}]
		},
		headers: {
			'Cookie': 'userID=' + userId
		}
	}, function(error, response, body) {
		if (error) {
			res.send("Something went wrong. Uh oh!");
			console.log("error\n" + error);
			console.log("response\n" + response);
			console.log("body\n" + body);
		} else {
			res.render('feedback', {
    			curUser: req.cookies.userID
    		});
		}
	});
	/* console.log("UserID: " + userId);
	console.log("communityId: " + communityId);
	console.log("matchId: " + matchId);
	console.log("rating: " + rating);
	*/

}