var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path = 'cat/user/community/:commID/match/feedback';

exports.postHandle = function(req, res) {
    var userId = req.loginUserID;
    console.log('match/feedbackMatch: feedbackMatch: ' + userId);
    feedbackMatch(userId, res, req);
}

function feedbackMatch(userId, res, req) {
    var matchId = req.body.matchID;
    console.log('match/feedbackMatch: matchId: ' + matchId);
    var p1 = dbConn.updateMatchStatus(userId,matchId,4);
    return p1.then(
        function(val) {
            console.log("feedbackMatch: done ");
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