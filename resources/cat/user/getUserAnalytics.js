var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/user/:userId/community/:commID/useranalytics/';

exports.getHandle = function(req, res) {
    // console.log('cat/user/:userId/users: userID: request received');
    var userID = req.params.userId;
    var commID = req.communityID;
    // console.log('cat/user/:userId/users: userID: ' + req.params.userId);
    getUserAnalytics(userID, commID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function getUserAnalytics(userID, commID, req, res) {
    doPromise(dbConn.getUserAnalytics(userID, commID), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}