var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");
var notifications = require("../../elf/notifications/notifications.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path = 'cat/user/community/:commID/match/accept';

exports.postHandle = function(req, res) {
    var userId = req.loginUserID;
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
        console.log('match/acceptMatch/sendNotification: matchId: ' + matchID);
        var p1 = dbConn.getMatchInfo(matchID);
        return p1.then(
            function(val) {
                var uid = val.userA;
                if(uid == userId)
                {
                    uid=val.userB;
                }
                notifications.sendMatchAcceptNotificationFromJade(userId, uid);
               
            }
        ).catch(
            function(reason) {
                 console.log('match/acceptMatch/sendNotification: failed: ' + reason.message);
            }
        );
        return;
    }
    catch(err)
    {
        console.log('match/acceptMatch/sendNotification - met error:  '+ err);
    }
}