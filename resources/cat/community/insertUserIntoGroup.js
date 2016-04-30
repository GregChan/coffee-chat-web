var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/community/:communityID/group/:groupID/insert';

exports.postHandle = function(req, res) {
    var communityID = req.communityID;
    var groupID = req.params.groupID;
    insertUserIntoGroup(communityID, groupID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function insertUserIntoGroup(communityID, groupID, req, res) {
    var data = req.body;
    doPromise(dbConn.insertUserIntoGroup(communityID, groupID, data), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}