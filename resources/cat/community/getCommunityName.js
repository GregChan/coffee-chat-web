var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/community/:communityID/name';

exports.getHandle = function(req, res) {
    console.log('cat/community/:communityID/name: communityID: request received');
    var communityID = req.communityID;
    console.log('cat/community/:communityID/name: communityID: ' + req.params.communityID);
    getCommunityName(communityID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function getCommunityName(communityID, req, res) {
    doPromise(dbConn.getCommunityName(communityID), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}