var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path = 'cat/user/community/:commID/match/rand';

exports.postHandle = function(req, res) {
    var commID = req.params.commID;
    var userId = req.loginUserID;
    if(userId != 91 && userId != 131 && userId != 151 && userId != 481 && userId != 491 && userId != 541 && userId != 551 && userId != 561)
    {   
        // TODO: a more appropriate access control -> admin of given community
        res.status(401).end();
    }
    console.log('match/rand: generate random match for: ' + userId);
    randMatch(commID,res,req);
}

function randMatch( commID, res,req) {
    var users = req.body;
    console.log('match/randMatch: users: ' + users);
    var p1 = dbConn.generateRandMatch(users.userID,commID);
    return p1.then(
        function(val) {
            console.log("randMatch: done ");
            res.json(val);
        }
    ).catch(
        function(reason) {
            console.log("randMatch: catch ");
            res.status(reason.error).json(reason);
            return;
        }
    );
    return;
}