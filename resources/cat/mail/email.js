var exports = module.exports = {},
	mail = require('../../elf/mail/mail.js');
exports.path = 'cat/mail/email';

exports.postHandle = function(req, res) {
	var substitutions = {};
	if (req.body.substitutions) {

		keys = Object.keys(req.body.substitutions);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];

			var data = [];

			for (var j = 0; j < req.body.emails.length; j++) {
				data.push(req.body.substitutions[key]);
			}

			substitutions['-' + key + '-'] = data;
		}
	}
	console.log(substitutions);

	mail.sendTemplate(
		req.body.emails,
		'no-reply@gocoffeechat.com',
		' ',
		req.body.template,
		substitutions || {},
		function(err, json) {
			console.log(json);
			if (err) {
				console.log(err);
				res.send(err);
			}

			res.redirect('/email');
		});
}