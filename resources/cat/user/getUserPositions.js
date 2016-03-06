var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path='cat/user/:userId/positions';

exports.getHandle=function (req,res) {
	console.log('user/{userID}/positions: userID: request received');
	var userId =req.params.userId;
	console.log('user/{userID}/positions: userID: ' + req.params.userId);
	getUserPositions(userId,res);
}

function getUserPositions(userId,res)
{
	var p1 = dbConn.getUserPositions(userId);
	return p1.then(
        function(data)
        {
           console.log("getUserPositions: then: "+ data);
           res.json(data);
        }
    ).catch(
        function(reason) {
            console.log('Error');
            res.sendStatus(400);
        }
    );
	return;
}