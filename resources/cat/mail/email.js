var exports = module.exports = {},
	mail = require('../../elf/mail/mail.js');
exports.path = 'cat/mail/email';

exports.postHandle = function(req, res) {
	console.log(req.body);
	if (req.body.name && req.body.email && req.body.template) {
		// process substitutions
		mail.sendTemplate(
			req.body.email,
			'noreplay@gocoffeechat.com',
			' ',
			req.body.template, 
			{},
			function(err, json) {
				console.log(json);
				if (err) {
					console.log(err);
					res.send(err);
				}

				res.redirect('/email');
			});
	}
}