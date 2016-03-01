var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path = 'cat/user/community/:commID/match/accept';

exports.postHandle = function(req, res) {
    var userId = req.cookies.userID;
    console.log('match/acceptMatch: acceptMatch: ' + userId);
    acceptMatch(userId, res, req);
}

function acceptMatch(userId, res, req) {
    var matchId = req.body.matchID;
    console.log('match/acceptMatch: matchId: ' + matchId);
    var p1 = dbConn.updateMatchStatus(userId,matchId,2);
    return p1.then(
        function(val) {
            console.log("acceptMatch: done ");
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