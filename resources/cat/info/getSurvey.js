var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path='cat/info/:commID/getSurvey';

exports.getHandle=function (req,res) {
    var commID =req.params.commID;
	getSurvey(commID,res);
}

function getSurvey(commID,res)
{
	var p1 = dbConn.getSurvey(commID);
	return p1.then(
        function(val)
        {
           console.log("commID: then: "+ val);
           res.json(val);
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

