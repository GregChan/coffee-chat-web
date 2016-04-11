var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path = 'cat/user/community/:commID/match/reject';

exports.postHandle = function(req, res) {
    var userId = req.loginUserID;
    console.log('match/rejectMatch: rejectMatch: ' + userId);
    rejectMatch(userId, res, req);
}

function rejectMatch(userId, res, req) {
    var matchId = req.body.matchID;
    console.log('match/rejectMatch: matchId: ' + matchId);
    var p1 = dbConn.updateMatchStatus(userId,matchId,4);
    return p1.then(
        function(val) {
            console.log("rejectMatch: done ");
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