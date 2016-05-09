var exports = module.exports = {},
	request = require('request'),
	async = require('async');

exports.path = 'admin/metrics';

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
			function(callback) {
				request({
					url: process.env.BASE_URL + '/cat/community/1/commanalytics',
					method: 'GET',
					headers: {
						'Cookie': 'userID=' + req.cookies.userID
					}
				}, function(error, response, body) {
					callback(error, JSON.parse(body));
				});
			},

			function(callback) {
				request({
					url: process.env.BASE_URL + '/cat/user/community/1/match/all',
					method: 'GET',
					headers: {
						'Cookie': 'userID=' + req.cookies.userID
					}
				}, function(error, response, body) {
					callback(error, JSON.parse(body));
				});
			},
		],
		function(err, results) {
			if (!err) {
				console.log(results[0]);
				var data = {
					users: results[0],
					metrics: results[1],
					matches: results[2],
				}

				res.render('admin-metrics', data);
			} else {
				res.sendStatus(500);
			}
		});
}