var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path = 'cat/user/community/:commID/match/history';

exports.getHandle = function(req, res) {
    var commID = req.params.commID;
    var userId = req.cookies.userID;
    console.log('match/getMatchHistory: getMatchHistory: ' + userId);
    getMatchHistory(userId,commID, res, req);
}

function getMatchHistory(userId, commID, res, req) {
    var p1 = dbConn.getMatchHistory(userId, commID);
    return p1.then(
        function(val) {
            console.log("getMatchHistory: done ");
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