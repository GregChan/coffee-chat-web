var exports = module.exports = {},
	sendgrid = require('sendgrid')('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');

exports.sendEMail = function(to, from, subject, body, callback) {
	var email = new sendgrid.Email();
	email.setTos([to]);
	email.setFrom(from);
	email.setText(body);
	email.setSubject(subject);
	sengrid.send(email, callback);
}

exports.sendTemplate = function(to, from, subject, templateId, substitutions, callback) {
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