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
    console.log('match/insertMatch: insertMatch: ' + userId);
    insertMatch(commID, res, req);
}

function insertMatch( commID, res, req) {
    console.log('match/autoMatch: commID: ' + commID);
    var p1 = dbConn.autoMatch(commID);
    return p1.then(
        function(val) {
            console.log("autoMatch: done ");
            res.json({
                status: 'success',
                url: '/'
            });
            // TODO: send notification email on match
        }
    ).catch(
        function(reason) {
            console.log("autoMatch: catch ");
            res.status(reason.error).json(reason);
            return;
        }
    );
    return;
}