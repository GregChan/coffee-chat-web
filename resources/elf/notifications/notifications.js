var exports = module.exports = {};
var mail = require('../mail/mail.js');
var async = require('async');
var dbConn = require("../db/dbConn.js");
var matchNotificationTemplateId = "7e78367c-b094-4062-849d-296a8c3c5c74";
var feedbackNotificationTemplateId = "9ed4af6b-0b6e-499b-a18b-e66e8fae4358";

function doPromise(p, callback) {
	p.then(function(data) {
		callback(null, data);
	}).catch(function(reason) {
		callback(reason, null);
	});
}

function getUserInformationForMatchForUsers(userA, userB, callback) {
	async.parallel([
		function(callback) {
			var p = dbConn.getUser(userA);
			doPromise(p, callback);
		},
		function(callback) {
			var p = dbConn.getUser(userB);
			doPromise(p, callback);
		}
	], function(err, results) {
		if (err) {
			console.log(err);
		} else {
			callback({
				userA: results[0],
				userB: results[1]
			});
		}
	});
}

function getUserProfileForMatchForUsers(userA, userB, callback) {
	async.parallel([
		function(callback) {
			var p = dbConn.getUser(userA);
			doPromise(p, callback);
		},
		function(callback) {
			var p = dbConn.getUserPositions(userA);
			doPromise(p, callback);
		},
		function(callback) {
			var p = dbConn.getUser(userB);
			doPromise(p, callback);
		},
		function(callback) {
			var p = dbConn.getUserPositions(userB);
			doPromise(p, callback);
		}
	], function(err, results) {
		if (err) {
			console.log(err);
		} else {
			var userAProfile = results[0];
			userAProfile['positions'] = results[1];
			var userBProfile = results[2];
			userBProfile['positions'] = results[3];

			console.log(userAProfile);
			console.log(userBProfile);

			callback({
				userA: userAProfile,
				userB: userBProfile
			});
		}
	});
}

function getMatch(matchId, callback) {
	doPromise(dbConn.getMatch(matchId), callback);
}

// TODO: we should also overload this method with a matchId
exports.sendMatchNotification = function(userAId, userBId) {
	var formatData = function(match, to) {
		return {
			matchFirstName: match.firstName,
			matchLastName: match.lastName,
			matchProfilePic: match.profilePic,
			matchEmail: match.email,
			matchLinkedInProfile: match.linkedInProfile,
			emails: [to]
		}
	};

	getUserInformationForMatchForUsers(userAId, userBId, function(data) {
		mail.sendNotificationEmail(formatData(data.userA, data.userB.email), matchNotificationTemplateId);
		mail.sendNotificationEmail(formatData(data.userB, data.userA.email), matchNotificationTemplateId);
	});
}

exports.sendMatchNotificationFromJade = function(userAId, userBId) {
	console.log("Something something soemthing...");
	var formatData = function(match, to) {
		return {
			data: {
				match: match
			},
			emails: [to]
		};
	};

	console.log("Something something soemthing... 2");
	getUserProfileForMatchForUsers(userAId, userBId, function(data) {
		console.log("Something something soemthing... 3");
		mail.sendNotificationEmailFromJadeTemplate(formatData(data.userA, data.userB.email), 'match-notification.jade', 'You have a new CoffeeChat Match!');
		mail.sendNotificationEmailFromJadeTemplate(formatData(data.userB, data.userA.email), 'match-notification.jade', 'You have a new CoffeeChat Match!');
	});
}

exports.sendMatchAcceptNotificationFromJade = function(userAId, userBId) {
	console.log("Something something soemthing...");
	var formatData = function(match, to) {
		return {
			data: {
				match: match
			},
			emails: [to]
		};
	};

	console.log("Something something soemthing... 2");
	getUserProfileForMatchForUsers(userAId, userBId, function(data) {
		console.log("Something something soemthing... 3");
		mail.sendNotificationEmailFromJadeTemplate(formatData(data.userA, data.userB.email), 'match-notification-accept.jade', 'Your Match has been Accepted!');
	});
}

exports.sendMatchDeclineNotificationFromJade = function(userAId, userBId) {
	console.log("Something something soemthing...");
	var formatData = function(match, to) {
		return {
			data: {
				match: match
			},
			emails: [to]
		};
	};

	console.log("Something something soemthing... 2");
	getUserProfileForMatchForUsers(userAId, userBId, function(data) {
		console.log("Something something soemthing... 3");
		mail.sendNotificationEmailFromJadeTemplate(formatData(data.userA, data.userB.email), 'match-notification-decline.jade', 'Your Match has been Declined!');
	});
}

exports.sendSignupConfirmationFromJade = function(firstName, email) {
	console.log("Going to send signup confirmation email to "+firstName);
	var formatData = function(firstName, to) {
		return {
			data: {
				user: {
					firstName:firstName
				}
			},
			emails: [to]
		};
	};
	mail.sendNotificationEmailFromJadeTemplate(formatData(firstName, email), 'signup-confirmation.jade', 'Hey there!');
}

exports.sendFeedbackNotification = function(matchId) {
	console.log('send email notification');
	getMatch(matchId, function(err, data) {
		console.log(data);
		// data.userA and data.userB are both ids returned by the getMatch end point
		getUserInformationForMatchForUsers(data.userA, data.userB, function(userData) {
			console.log(userData);
			var emailDataA = {};
			var emailDataB = {};
			for (var i = 0; i < 5; i++) {
				var urlA = process.env.BASE_URL + "/feedback?userId=" + userData.userA.userId + "&communityId=" + data.communityID + "&matchId=" + data.id + "&rating=" + (i * 10 + 1);
				var urlB = process.env.BASE_URL + "/feedback?userId=" + userData.userB.userId + "&communityId=" + data.communityID + "&matchId=" + data.id + "&rating=" + (i * 10 + 1);
				emailDataA['rating' + (i + 1)] = urlA;
				emailDataB['rating' + (i + 1)] = urlB;
			}
			emailDataA['emails'] = [userData.userA.email];
			emailDataB['emails'] = [userData.userB.email];
			mail.sendNotificationEmail(emailDataA, feedbackNotificationTemplateId);
			mail.sendNotificationEmail(emailDataB, feedbackNotificationTemplateId);
		});
	});
}

exports.sendFeedbackNotificationFromJade = function(matchId) {
	console.log('send email notification');
	getMatch(matchId, function(err, data) {
		var formatData = function(match, to) {
			return {
				data: {
					match: match
				},
				emails: [to]
			};
		};
		// data.userA and data.userB are both ids returned by the getMatch end point
		getUserProfileForMatchForUsers(data.userA, data.userB, function(userData) {
			console.log(userData);

			mail.sendNotificationEmailFromJadeTemplate(formatData(userData.userA, userData.userB.email), 'feedback-notification.jade', 'Rate your CoffeeChat Match!');
			mail.sendNotificationEmailFromJadeTemplate(formatData(userData.userB, userData.userA.email), 'feedback-notification.jade', 'Rate your CoffeeChat Match!');
		});
	});
}