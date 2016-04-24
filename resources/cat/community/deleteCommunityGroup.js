var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/community/:communityID/group/delete/';

exports.postHandle = function(req, res) {
    var communityID = req.params.communityID;
    deleteCommunityGroup(communityID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function deleteCommunityGroup(communityID, req, res) {
    var data = req.body;
    doPromise(dbConn.deleteCommunityGroup(communityID, data), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}