var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/community/:communityID/group/:groupID/user/update';

exports.postHandle = function(req, res) {
    console.log(exports.path);
    var communityID = req.params.communityID;
    var groupID = req.params.groupID;
    updateGroupUser(communityID, groupID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function updateGroupUser(communityID, groupID, req, res) {
    var data = req.body;
    doPromise(dbConn.updateGroupUser(communityID, groupID, data), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}