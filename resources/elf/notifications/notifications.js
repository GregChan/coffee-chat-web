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

function getUserMatchInformation(userId, otherUserId, callback) {
    async.parallel([
        function(callback) {
            var p = dbConn.getUser(userId);
            doPromise(p, callback);
        },
        function(callback) {
            var p = dbConn.getUser(otherUserId);
            doPromise(p, callback);
        }
    ], function(err, results) {
        if (err) {
            console.log(err);
        } else {
        	callback({
        		user: results[0],
        		otherUser: results[1]
        	});
        }
    });
}

var templateIdString = "7e78367c-b094-4062-849d-296a8c3c5c74";

exports.sendMatchNotification = function(userId, otherUserId) {
	getUserMatchInformation(userId, otherUserId, function(data) {
		data.emails = [data.user.email];
		mail.sendTemplateNotification({
			user: data.otherUser,
			otherUser: data.user,
			emails: [data.otherUser.email]
		}, templateIdString);
		mail.sendTemplateNotification(data, templateIdString);
	});
}
