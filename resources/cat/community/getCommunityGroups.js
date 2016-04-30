var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/community/:communityID/group';

exports.getHandle = function(req, res) {
    var communityID = req.communityID;
    getCommunityGroups(communityID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function getCommunityGroups(communityID, req, res) {
    doPromise(dbConn.getCommunityGroups(communityID), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}