var exports = module.exports = {};
var dbConn = require('../../elf/db/dbConn.js');

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path='cat/community/:commID/settings';

exports.getHandle = function (req,res) {
    var commID = req.params.commID;
    var userID = req.cookies.userID;
	getUserSurveyForCommunity(userID, commID, res, req);
}

function getUserSurveyForCommunity(userID, commID,res, req)
{
    console.log('getUserSurveyForCommunity ' + userID);
    var p1 = dbConn.getUserSurveyForCommunity(userID,commID);
    return p1.then(
        function(data)
        {
           console.log('getUserSurveyForCommunity: done');
           res.json(data);
        }
    ).catch(
        function(reason) {
            var obj=reason;
            res.status(obj.error).end();
        }
    );
    return;
}