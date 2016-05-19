var exports = module.exports = {},
	async = require('async'),
	request = require('request');

exports.path = 'coffeeChat';

exports.getHandle = function(req, res) {
	if (req.loginUserID != null) {

		async.parallel([
            function(callback) {
               request({
						url: process.env.BASE_URL + '/cat/user/' + req.loginUserID,
						method: 'GET',
						headers: {
							'Cookie': 'userID=' + req.cookies.userID
						}
					}, function(error, response, body) {
						callback(error, JSON.parse(body));
					});
               }
         ],
		 function(err, results) {
				if (!err) {
					res.render('index', {
						curUser: results[0]
					});
				} else {
					res.render('index');
				}
				res.end();
			});
	}
	else {
		res.render('index');
		res.end();
	}
}