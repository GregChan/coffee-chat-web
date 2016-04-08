var exports = module.exports = {},
	sendgrid = require('sendgrid')('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'),
	mail = require('../../elf/mail/mail.js');

var sendTemplate = function(to, from, subject, templateId, substitutions, callback) {
	var email = new sendgrid.Email();
	email.setTos(to);
	email.setFrom(from);
	email.setSubject(subject);
	email.setHtml('<p></p>');
	email.setSubstitutions(substitutions);

	email.setFilters({
		'templates': {
			'settings': {
				'enable': 1,
				'template_id': templateId,
			}
		}
	});

	sendgrid.send(email, callback);
}

exports.sendEMail = function(to, from, subject, body, callback) {
	var email = new sendgrid.Email();
	email.setTos([to]);
	email.setFrom(from);
	email.setText(body);
	email.setSubject(subject);
	sengrid.send(email, callback);
}

exports.sendTemplate = function(to, from, subject, templateId, substitutions, callback) {
	sendTemplate(to, from, subject, templateId, substitutions, callback);
}

exports.sendNotificationEmail = function(data, templateId) {
	var substitutions = {};
	if (data) {

		keys = Object.keys(data);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];

			if (key != 'emails') {
				var d = [];

				for (var j = 0; j < 1; j++) {
					d.push(data[key]);
				}

				substitutions['-' + key + '-'] = d;
			}
		}
	}
	console.log(data.emails);
	console.log(substitutions);

	sendTemplate(
		data.emails,
		'no-reply@gocoffeechat.com',
		' ',
		templateId,
		substitutions || {},
		function(err, json) {
			console.log(json);
			if (err) {
				console.log(err);
			}
		});
}