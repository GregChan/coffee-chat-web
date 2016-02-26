var exports = module.exports = {};
var dbConn = require('../../elf/db/dbConn.js');

exports.path = 'cat/user/community/:commID/profile';

exports.getHandle = function(req, res) {
    var commID = req.params.commID;
    var userID = req.cookies.userID;
    getUserProfileForCommunity(userID, commID, res, req);
}

function getUserProfileForCommunity(userID, commID, res, req) {
    var p1 = dbConn.getUserProfileForCommunity(userID, commID);
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