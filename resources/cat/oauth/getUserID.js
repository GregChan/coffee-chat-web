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
	getLinkedInBasicProfie(accessToken, res,1);
}

function getLinkedInBasicProfie(accessToken, res, num) {
	request({
		url: 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,picture-urls::(original),email-address,industry,headline,specialties,positions,picture-url,public-profile-url)',
		qs: {
			oauth2_access_token: accessToken,
			format: 'json'
		},
		method: 'GET'
	}, function(error, response, body) {
		console.log(error);
		if (!error || body != undefined) {
			var parsed = JSON.parse(body);
			if (parsed.id == undefined) {
				logger.debug('failed to getBasicProfie: '+body);
				var obj = {
					type:num,
					data:accessToken
				}
				dbConn.logError(obj);
				if(num<3) // retry (twice) to pull user info from LinkedIn
				{
					setTimeout(function() {
						logger.debug('cat/oauth/getUserID.getLinkedInBasicProfie: sleep before retrying ');
						 getLinkedInBasicProfie(accessToken,res,num+1);
					}, 1000*num); //sleep for 1s / 2s before the second / third try.	
				}
				else
				{
					res.json({
						error: parsed.message
					});
				}
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
			res.send(reason);
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