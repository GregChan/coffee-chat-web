var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path='cat/community/:commID/match-feedback';

exports.getHandle=function (req,res) {
    var commID =req.communityID;
	getCommunityFeedback(commID,res);
}

function getCommunityFeedback(commID,res)
{
	var p1 = dbConn.getCommunityFeedback(commID);
	return p1.then(
        function(data)
        {
           console.log("commID: then: "+ data);
           res.json(data);
        }
    ).catch(
        function(reason) {
            var obj=JSON.parse(reason)
            res.status(obj.error);
            res.end();
  
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

