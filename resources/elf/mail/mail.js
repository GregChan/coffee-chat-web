var exports = module.exports = {},
	sendgrid = require('sendgrid')('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'),
	fs = require('fs'),
	jade = require('jade'),
	path = require('path'),
	mail = require('../../elf/mail/mail.js'),
	juice = require('juice');

var coffeeChatEmail = 'no-reply@gocoffeechat.com';

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

var sendEmail = function(to, from, subject, body, callback) {
	var email = new sendgrid.Email();
	email.setTos(to);
	email.setFrom(from);
	email.setHtml(body);
	email.setSubject(subject);
	sendgrid.send(email, callback);
}

exports.sendEMail = function(to, from, subject, body, callback) {
	sendEmail(to, from, subject, body, callback);
}

exports.sendTemplate = function(to, from, subject, templateId, substitutions, callback) {
	sendTemplate(to, from, subject, templateId, substitutions, callback);
}

// TODO: abstract this to work with any jade template
exports.sendNotificationEmailFromJadeTemplate = function(data) {
	fs.readFile(path.join(__dirname, '../../../views/email-templates/match-notification.jade'), 'utf8', function(err, templateData) {

		if (err) {
			console.log('Error reading the template')
			console.log(err);
			// TODO: return error
			return;
		}

		fs.readFile(path.join(__dirname, '../../../views/email-templates/includes/styles.jade'), function(err, stylesData) {

			if (err) {
				console.log('Error reading the styles');
				console.log(err);
				// TODO: return error
				return;
			}
			var templateHtml = jade.compile(templateData)(data.data);
			var styleHtml = jade.compile(stylesData)();
			var inlineHtml = juice(styleHtml + templateHtml);
			console.log(inlineHtml);

			sendEmail(data.emails, coffeeChatEmail, ' ', inlineHtml, function(err, json) {
				if (err) {
					console.log(err);
					// TODO: return error
					return;
				}

				console.log(json);
			});
		});
	});
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
		coffeeChatEmail,
		' ',
		templateId,
		substitutions || {},
		function(err, json) {
			if (err) {
				console.log(err);
			}

			console.log(json);
		});
}