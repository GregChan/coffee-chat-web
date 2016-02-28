var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path = 'cat/user/community/:commID/match/all';

exports.getHandle = function(req, res) {
    var commID = req.params.commID;
    var userId = req.cookies.userID;
    if(userId != 91 && userId != 131 && userId != 151 && userId != 481 && userId != 491 && userId != 541 && userId != 551 && userId != 561)
    {   
        // TODO: a more appropriate access control -> admin of given community
        res.status(401).end();
    }
    console.log('match/getAllMatches: getAllMatches: ' + userId);
    getAllMatches(commID, res, req);
}

function getAllMatches(commID, res, req) {
    var p1 = dbConn.getAllMatches(commID);
    return p1.then(
        function(val) {
            console.log("getAllMatches: done ");
            res.json(val);
        }
    ).catch(
        function(reason) {
            var obj = JSON.parse(reason)
            res.status(obj.error).end();
        }
    );
    return;
}