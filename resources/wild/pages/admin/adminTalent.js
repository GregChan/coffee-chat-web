var exports = module.exports = {},
	request = require('request');

exports.path = 'admin/talent';

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
					callback(error, JSON.parse(body));
				});
			},
		],
		function(err, results) {
			if (!err) {
				console.log(results[0]);
				var data = {
					users: results[0],
				}

				res.render('admin-talent', data);
			} else {
				res.sendStatus(500);
			}
		});
}