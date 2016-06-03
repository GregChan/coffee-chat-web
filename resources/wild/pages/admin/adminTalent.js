var exports = module.exports = {},
	request = require('request'),
	async = require('async');

exports.path = 'admin/talent';

exports.getHandle = function(req, res) {
	async.parallel([
			function(callback) {
				request({
					url: process.env.BASE_URL + '/cat/community/' + req.communityID + '/users',
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
			console.log(err);
			if (!err) {
				var data = {
					users: results[0],
				};

				res.render('admin-talent', data);
			} else {
				res.render('admin-talent', {
					users: []
				});
			}
		});
}