var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path='cat/user/:commID/addSurveyData';

exports.postHandle=function (req,res) {
    var commID =req.params.commID;
    var userId =req.loginUserID;
    console.log('user/addInterests: addSurveyData: '+ userId);
	addSurveyData(userId,commID,res, req);
}

function addSurveyData(userId,commID,res, req)
{
	var survey =req.body;
    console.log('user/addSurveyData: survey: '+ survey);
    var p1 = dbConn.addSurveyData(userId,commID, survey);
    return p1.then(
        function(val)
        {
           console.log("addSurveyData: done ");
           res.status(200).end();
        }
    ).catch(
        function(reason) {
            var obj=JSON.parse(reason)
            res.status(obj.error).end();
  
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

