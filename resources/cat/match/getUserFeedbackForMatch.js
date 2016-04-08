var exports = module.exports = {};
var dbConn = require('../../elf/db/dbConn.js');

exports.path = 'cat/user/community/feedback/:commID/:matchID/query';

exports.getHandle = function(req, res) {
     var commID = req.params.commID;
    var matchID = req.params.matchID;
    var userId = req.loginUserID;
    getUserFeedbackForMatch(userId, commID,matchID, res);
}

function getUserFeedbackForMatch(userID, commID, matchID,res) {
    var p1 = dbConn.getUserFeedbackForMatch(userID, commID,matchID);
    return p1.then(
        function(data) {
            res.json(data);
        }
    ).catch(
        function(reason) {
            var obj = reason;
            res.status(obj.error).end();
        }
    );
    return;
}