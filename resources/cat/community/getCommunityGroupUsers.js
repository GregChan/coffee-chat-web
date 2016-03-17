var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/community/:communityID/group/:groupID/users';

exports.getHandle = function(req, res) {
    var communityID = req.params.communityID;
    var groupID = req.params.groupID;
    getCommunityGroupUsers(communityID, groupID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function getCommunityGroupUsers(communityID, groupID, req, res) {
    doPromise(dbConn.getCommunityGroupUsers(communityID, groupID), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}