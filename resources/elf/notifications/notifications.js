var exports = module.exports = {},
	mail = require('../mail/mail.js');
	async = require('async');

var dbConn = require("../db/dbConn.js");

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function getUserMatchInformation(userA, userB, callback) {
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

var matchNotificationTemplateId = "7e78367c-b094-4062-849d-296a8c3c5c74";
var feedbackNotificationTemplateId = "9ed4af6b-0b6e-499b-a18b-e66e8fae4358";

exports.sendMatchNotification = function(userA, userB) {
	getUserMatchInformation(userA, userB, function(data) {
		data.emails = [data.user.email];
		mail.sendTemplateNotification({
			user: data.userB,
			otherUser: data.userA,
			emails: [data.userB.email]
		}, matchNotificationTemplateId);
		mail.sendTemplateNotification({
			user: data.userA,
			otherUser: data.userB,
			emails: [data.userA.email]
		}, matchNotificationTemplateId);
	});
}

exports.sendFeedbackNotification = function(matchId) {
	doPromise(dbConn.getMatch(matchId), function(err, data) {
		getUserMatchInformation(data.userA, data.userB, function(userData) {
			console.log(data);
			var emailDataA = {};
			var emailDataB = {};
			for (var i=0; i<5; i++){
				var urlA = process.env.BASE_URL + "/feedback?userId=" + userData.userA.userId
												+ "&communityId=" + data.communityID
												+ "&matchId=" + data.id
												+ "&rating=" + (i*10+1);
				var urlB = process.env.BASE_URL + "/feedback?userId=" + userData.userB.userId
												+ "&communityId=" + data.communityID
												+ "&matchId=" + data.id
												+ "&rating=" + (i*10+1);
				emailDataA['rating' + (i+1)] = urlA;
				emailDataB['rating' + (i+1)] = urlB;
			}
			mail.sendTemplateNotification({
				otherUser: emailDataA,
				emails: [userData.userA.email]
			}, feedbackNotificationTemplateId);

			mail.sendTemplateNotification({
				otherUser: emailDataB,
				emails: [userData.userB.email]
			}, feedbackNotificationTemplateId);
		});
	});

}