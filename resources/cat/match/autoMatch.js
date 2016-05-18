var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");
var notifications = require("../../elf/notifications/notifications.js");

exports.path = 'cat/user/community/:commID/match/automatch';

exports.postHandle = function(req, res) {
    var commID = req.communityID;
    var userId = req.loginUserID;
    // if(userId != 91 && userId != 131 && userId != 151 && userId != 481 && userId != 491 && userId != 541 && userId != 551 && userId != 561)
    // {   
    //     // TODO: a more appropriate access control -> admin of given community
    //     res.status(401).end();
    // }
    console.log('match/autoMatch: autoMatching community ' + commID);
    autoMatch(commID, res, req);
}

function autoMatch(commID, res, req) {
    console.log('match/autoMatch: commID: ' + commID);
    var p1 = dbConn.autoMatch(commID);
    return p1.then(
        function(val) {
            console.log("autoMatch: " + val.success);
            for (var i = 0; i < (val.matches).length; i++) {
                console.log("Sending match notification for users:", val.matches[i][0],val.matches[i][1]);
                notifications.sendMatchNotificationFromJade(val.matches[i][0], val.matches[i][1]);
            }
            res.json({
                status: 'success',
                url: '/'
            });
        }
    ).catch(
        function(reason) {
            console.log("autoMatch: catch ");
            res.status(reason.error).json(reason);
        }
    );
}