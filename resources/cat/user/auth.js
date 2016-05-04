var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");
var logger = require("../../../logger.js").getLogger();

exports.path = 'cat/user/auth';

exports.postHandle = function(req, res) {
	logger.debug('user/auth: userID: request received');
	console.log('user/auth: body: ' + req.body.email + ' ,' + req.body.pw);
	req.accepts('application/json');
	validateUser(req.body.email, req.body.pw, res);
}

function validateUser(email, pw, res) {
	var p1 = dbConn.validatePassword(email, pw);
	return p1.then(
		function(val) {
			logger.debug("user/auth: getUserID: get user id: " + val.userID);
			res.json(val);
		}
	).catch(
		function(reason) {
			logger.debug("user/auth: getUserID: invalid user");
			// var obj=JSON.parse(reason)
			res.sendStatus(500);
		}

	);
	return;
}