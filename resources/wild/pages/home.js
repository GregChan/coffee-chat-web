var exports = module.exports = {},
	request = require('request'),
	async = require('async'),
	fs = require('fs'),
	notifications = require('../../elf/notifications/notifications.js');

exports.path = '';

exports.getHandle = function(req, res) {
	if (req.communityID == null && req.loginUserID != null) {
		// res.render('index', {
		// 	curUser: req.loginUserID
		// });

		res.redirect('/survey');
	} else if (req.communityID != null && req.loginUserID != null) {
		async.parallel([
				function(callback) {
					request({
						url: process.env.BASE_URL + '/cat/user/' + req.loginUserID,
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
						url: process.env.BASE_URL + '/cat/user/' + req.loginUserID + '/community/1/match/history',
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
						url: process.env.BASE_URL + '/cat/user/' + req.loginUserID + '/community/1/useranalytics',
						method: 'GET',
						headers: {
							'Cookie': 'userID=' + req.cookies.userID
						}
					}, function(error, response, body) {
						callback(error, JSON.parse(body));
					});
				}
			],
			function(err, results) {
				var hasFilledOutSurvery = Object.keys(results[1]).length > 0;
				if (!err) {
					res.render('home', {
						curUser: results[0],
						curMatch: results[2],
						matchHist: results[3],
						metrics: results[4]
					});
				} else {
					res.render('index');
				}
				res.end();
			});
	} else {
		res.render('index');
		res.end();
	}
}