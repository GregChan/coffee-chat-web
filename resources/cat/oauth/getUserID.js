var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");
var logger = require("../../../logger.js").getLogger();
var request = require('request');

var urlLinkedin = 'api.linkedin.com';
var urlBasicProfie = '/v1/people/~:(id,first-name,last-name,picture-urls::(original),email-address,industry,headline,specialties,positions,picture-url,public-profile-url)?format=json';

exports.path = 'cat/oauth/getUserID';

exports.postHandle = function(req, res) {
	logger.debug('oAuth/getUserId: userID: request received');
	console.log('oAuth/getUserId: body: ' + req.body.accessToken);
	req.accepts('application/json');
	var accessToken = req.body.accessToken;
	logger.debug('oAuth/getUserId: accessToken: ' + accessToken);
	getLinkedInBasicProfie(accessToken, res);
}

function getLinkedInBasicProfie(accessToken, res) {
	request({
		url: 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,picture-urls::(original),email-address,industry,headline,specialties,positions,picture-url,public-profile-url)',
		qs: {
			oauth2_access_token: accessToken,
			format: 'json'
		},
		method: 'GET'
	}, function(error, response, body) {
		if (!error || body != undefined) {
			var parsed = JSON.parse(body);
			if (parsed.id == undefined) {
				res.json({
					error: parsed.message
				});
			} else {
				createUserIfNotExist(parsed, accessToken, res);
			}
		} else {
			res.json({
				error: error
			});
		}
	});
}

function createUserIfNotExist(parsed, accessToken, res) {
	var p1 = dbConn.createUserIfNotExist(parsed, accessToken);
	return p1.then(
		function(val) {

			logger.debug("getUserID: get user id: " + val);
			res.json({
				user: val
			});
		}
	).catch(
		function(reason) {
			var obj = JSON.parse(reason)
			res.status(obj.error);
		}

	);
}

// exports.putHandle=function (req,res) {
// 	res.status(405).end(); // Method Not Allowed
// }

// exports.deleteHandle=function (req,res) {
// 	res.status(405).end(); // Method Not Allowed
// }

// exports.getHandle=function (req,res) {
// 	res.status(405).end(); // Method Not Allowed
// }