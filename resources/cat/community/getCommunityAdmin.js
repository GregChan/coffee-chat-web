var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/community/:communityID/admin';

exports.getHandle = function(req, res) {
    var communityID = req.params.communityID;
    getCommunityAdmin(communityID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function getCommunityAdmin(communityID, req, res) {
    doPromise(dbConn.getCommunityAdmin(communityID), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}