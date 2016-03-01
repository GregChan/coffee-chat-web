var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path = 'cat/user/community/:commID/update';

exports.postHandle = function(req, res) {
    var commID = req.params.commID;
    var userId = req.cookies.userID;
    console.log('user/updateUserProfileForCommunity: updateUserProfileForCommunity: ' + userId);
    updateUserProfileForCommunity(userId, commID, res, req);
}

function updateUserProfileForCommunity(userId, commID, res, req) {
    var survey = req.body;
    console.log('user/updateUserProfileForCommunity: survey: ' + survey.data);
    var p1 = dbConn.updateUserProfileForCommunity(userId, commID, survey.data);
    return p1.then(
        function(val) {
            console.log("updateUserProfileForCommunity: done ");
            res.json({
                status: 'success',
                url: '/'
            });
        }
    ).catch(
        function(reason) {
            var obj = JSON.parse(reason)
            res.status(obj.error).end();
        }
    );
    return;
}