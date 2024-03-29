var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/community/:communityID/users';

exports.getHandle = function(req, res) {
    console.log('cat/community/:communityID/users: communityID: request received');
    var communityID = req.communityID;
    console.log('cat/community/:communityID/users: communityID: ' + req.params.communityID);
    getCommunityUsers(communityID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function getCommunityUsers(communityID, req, res) {
    doPromise(dbConn.getCommunityUsers(communityID), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}