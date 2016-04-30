var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path = 'cat/user/community/:commID/match/insert';

exports.postHandle = function(req, res) {
    var commID = req.params.commID;
    var userId = req.loginUserID;
    if(userId != 91 && userId != 131 && userId != 151 && userId != 481 && userId != 491 && userId != 541 && userId != 551 && userId != 561)
    {   
        // TODO: a more appropriate access control -> admin of given community
        res.status(401).end();
    }
    console.log('match/insertMatch: insertMatch: ' + userId);
    insertMatch(commID, res, req);
}

function insertMatch( commID, res, req) {
    var users = req.body;
    console.log('match/insertMatch: users: ' + users.data);
    console.log('match/insertMatch: commID: ' + commID);
    var p1 = dbConn.insertMatchForCommunity(users.userA, users.userB, commID);
    return p1.then(
        function(val) {
            console.log("insertMatch: done ");
            res.json({
                status: 'success',
                url: '/'
            });
            // TODO: send notification email on match
        }
    ).catch(
        function(reason) {
            console.log("insertMatch: catch ");
            res.status(reason.error).json(reason);
            return;
        }
    );
    return;
}