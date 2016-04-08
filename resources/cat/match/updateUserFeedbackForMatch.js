var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path = 'cat/user/community/feedback/:commID/:matchID/update';

exports.postHandle = function(req, res) {
    var commID = req.params.commID;
    var matchID = req.params.matchID;
    var userId = req.cookies.userID;
    console.log('updateUserFeedbackForMatch: updateUserFeedbackForMatch: ' + userId);
    updateUserFeedbackForMatch(userId, commID, matchID, res, req);
}

function updateUserFeedbackForMatch(userId, commID, matchID, res, req) {
    var match = req.body;
    console.log('updateUserProfileForCommunity: match: ' + match.data);
    var p1 = dbConn.updateUserFeedbackForMatch(userId, commID, matchID, match.data);
    return p1.then(
        function(val) {
            console.log("updateUserFeedbackForMatch: done ");
            res.json({
                status: 'success',
                url: '/'
            });
        }
    ).catch(
        function(reason) {
            var obj = JSON.parse(reason)
            res.status(obj.error);
            res.send(obj.message);
        }
    );
}