var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");
var notifications = require("../../elf/notifications/notifications.js");

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
    var p1 = dbConn.updateMatchStatus(userId,matchId,3);
    return p1.then(
        function(val) {
            console.log("rejectMatch: done ");
            sendNotification(userId, matchId);
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

function sendNotification(userId, matchID ) {
    try{
        console.log('match/rejectMatch/sendNotification: matchId: ' + matchID);
        var p1 = dbConn.getMatchInfo(matchID);
        return p1.then(
            function(val) {
                var uid = val.userA;
                if(uid == userId)
                {
                    uid=val.userB;
                }
                notifications.sendMatchDeclineNotificationFromJade(userId, uid);
               
            }
        ).catch(
            function(reason) {
                 console.log('match/rejectMatch/sendNotification: failed: ' + reason.message);
            }
        );
        return;
    }
    catch(err)
    {
        console.log('match/rejectMatch/sendNotification - met error:  '+ err);
    }
}