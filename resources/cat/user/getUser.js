var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path='cat/user/:userId/';

exports.getHandle=function (req,res) {
	console.log('user/getUser: userID: request received');
	var userId =req.params.userId;
	console.log('user/getUser: userId: '+ userId);
	getUser(userId,res);
}

function getUser(userId,res)
{
	var p1 = dbConn.getUser(userId);
	return p1.then(
        function(data)
        {
           console.log("getUser: then: "+ data);
           res.json(data);
        }
    ).catch(
        function(reason) {
            console.log('Error');
            var obj=JSON.parse(reason)
            res.status(obj.error);
  
        }
    );
	return;
}



// exports.putHandle=function (req,res) {
// 	res.status(405).end(); // Method Not Allowed
// }

// exports.deleteHandle=function (req,res) {
// 	res.status(405).end(); // Method Not Allowed
// }

// exports.postHandle=function (req,res) {
// 	res.status(405).end(); // Method Not Allowed
// }

