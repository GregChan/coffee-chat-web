var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path='cat/user/addInterests';

exports.postHandle=function (req,res) {
    req.accepts('application/json');
	console.log('user/addInterests: request received');
	var userId =req.loginUserID;
	console.log('user/addInterests: userId: '+ userId);
	addInterests(userId,req,res);
}

function addInterests(userId,req,res)
{
    var industries =req.body.industries;
    console.log('user/addInterests: industries: '+ industries);
	var p1 = dbConn.addInterestIndustry(userId,industries);
	return p1.then(
        function(val)
        {
           console.log("addInterests: industry done ");
           addHobbies(userId,req,res);
        }
    ).catch(
        function(reason) {
            var obj=JSON.parse(reason)
            res.status(obj.error).end();
  
        }
    );
	return;
}

function addHobbies(userId,req,res)
{
    var hobbies =req.body.hobbies;
    console.log('user/addInterests: hobbies: '+ hobbies);
    var p1 = dbConn.addInterestHobby(userId,hobbies);
    return p1.then(
        function(val)
        {
           console.log("addInterests: hobby done ");
           addJobFeatures(userId,req,res);
        }
    ).catch(
        function(reason) {
            var obj=JSON.parse(reason)
            res.status(obj.error).end();;
  
        }
    );
    return;
}

function addJobFeatures(userId,req,res)
{
    var jobFeatures =req.body.jobFeatures;
    console.log('user/addInterests: jobFeatures: '+ jobFeatures);
    var p1 = dbConn.addInterestJobfeature(userId,jobFeatures);
    return p1.then(
        function(val)
        {
           console.log("addInterests: job feature done ");
           addSchool(userId,req,res);
        }
    ).catch(
        function(reason) {
            var obj=JSON.parse(reason)
            res.status(obj.error).end();;
  
        }
    );
    return;
}

function addSchool(userId,req,res)
{
    var schoolName = req.body.school;
    var gradYear = req.body.gradYear;
    console.log('user/addInterests: school: '+ schoolName+' '+gradYear);
    var p1 = dbConn.addSchool(userId,schoolName,gradYear);
    return p1.then(
        function(val)
        {
           console.log("addInterests: school done ");
           res.status(200).end();
        }
    ).catch(
        function(reason) {
            var obj=JSON.parse(reason)
            res.status(obj.error).end();;
  
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

