var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path = 'cat/user/community/:commID/match/current';

exports.getHandle = function(req, res) {
    var commID = req.params.commID;
    var userId = req.loginUserID;
    console.log('match/getCurrentMatches: getCurrentMatches: ' + userId);
    getCurrentMatches(userId,commID, res, req);
}

function getCurrentMatches(userId, commID, res, req) {
    var p1 = dbConn.getCurrentMatches(userId, commID);
    return p1.then(
        function(val) {
            console.log("getCurrentMatches: done ");
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