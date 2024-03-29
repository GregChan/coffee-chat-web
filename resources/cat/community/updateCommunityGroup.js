var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/community/:communityID/group/update/';

exports.postHandle = function(req, res) {
    console.log(exports.path);
    var communityID = req.communityID;
    updateCommunityGroup(communityID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function updateCommunityGroup(communityID, req, res) {
    var data = req.body;
    doPromise(dbConn.updateCommunityGroup(communityID, data), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}