var exports = module.exports = {},
    request = require('request'),
    async = require('async'),
    fs = require('fs'),
    notifications = require('../../elf/notifications/notifications.js');

exports.path = '';

exports.getHandle = function(req, res) {
	notifications.sendFeedbackNotification(301);
    if (req.cookies.userID != undefined && req.cookies.userID != "undefined") {
		async.parallel([
				function(callback) {
					request({
						url: process.env.BASE_URL + '/cat/user/' + req.cookies.userID,
						method: 'GET',
						headers: {
							'Cookie': 'userID=' + req.cookies.userID
						}
					}, function(error, response, body) {
						callback(error, JSON.parse(body));
					});
				},
				function(callback) {
					request({
						url: process.env.BASE_URL + '/cat/user/community/1/profile',
						method: 'GET',
						headers: {
							'Cookie': 'userID=' + req.cookies.userID
						}
					}, function(error, response, body) {
						callback(error, JSON.parse(body));
					});
				},
				function(callback) {
					request({
						url: process.env.BASE_URL + '/cat/user/community/1/match/current',
						method: 'GET',
						headers: {
							'Cookie': 'userID=' + req.cookies.userID
						}
					}, function(error, response, body) {
						callback(error, JSON.parse(body));
					});
				},
				function(callback) {
					request({
						url: process.env.BASE_URL + '/cat/user/' + req.cookies.userID + '/community/1/match/history',
						method: 'GET',
						headers: {
							'Cookie': 'userID=' + req.cookies.userID
						}
					}, function(error, response, body) {
						callback(error, JSON.parse(body));
					});
				}
//				function(callback) {
//					request({
//						url: process.env.BASE_URL + '/cat/user/community/1/match/insert',
//						method: 'POST',
//						form: {
//							"userA": 131,
//							"userB": 151
//						},
//						headers: {
//							'Cookie': 'userID=' + req.cookies.userID
//						}
//					}, function(error, response, body) {
//						callback(error, JSON.parse(body));
//					});
//				}
			],
			function(err, results) {
			    var hasFilledOutSurvery = Object.keys(results[1]).length > 0;
				if (!err && hasFilledOutSurvery) {
					res.render('home', {
						curUser: results[0],
						curMatch: results[2],
						matchHist: results[3]
					});
				} else {
					res.render('index', {
						curUser: results[0]
					});
				}
				res.end();
			});
	} else {
        res.render('index');
        res.end();
    }
}