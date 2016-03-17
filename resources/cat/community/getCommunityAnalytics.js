var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/community/:communityID/analytics/';

exports.getHandle = function(req, res) {
    // console.log('cat/community/:communityID/users: communityID: request received');
    var communityID = req.params.communityID;
    // console.log('cat/community/:communityID/users: communityID: ' + req.params.communityID);
    getCommunityAnalytics(communityID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function getCommunityAnalytics(communityID, req, res) {
    doPromise(dbConn.getCommunityAnalytics(communityID), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}