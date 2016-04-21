var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");


exports.path = 'cat/user/:userID/admin';

exports.getHandle = function(req, res) {
    var userID = req.params.userID;
    getCommunityAdmin(userID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function getCommunityAdmin(userID, req, res) {
    doPromise(dbConn.getCommunityAdmin(userID), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}