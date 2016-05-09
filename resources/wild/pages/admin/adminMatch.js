var exports = module.exports = {},
	request = require('request'),
	async = require('async');

exports.path = 'admin/match';

exports.getHandle = function(req, res) {
	async.parallel([
			function(callback) {
				request({
					url: process.env.BASE_URL + '/cat/community/1/users',
					method: 'GET',
					headers: {
						'Cookie': 'userID=' + req.cookies.userID
					}
				}, function(error, response, body) {
					if (response.statusCode == 200) {
						callback(error, JSON.parse(body));
					} else {
						callback(new Error("Error"), null);
					}
				});
			},
		],
		function(err, results) {
			if (!err) {
				console.log(results[0]);
				var data = {
					users: results[0],
				}

				res.render('admin-match', data);
			} else {
				res.sendStatus(500);
			}
		});
}