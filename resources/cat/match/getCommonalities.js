var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/user/community/:commID/match/:matchUID/commonalities';

exports.getHandle = function(req, res) {
    var userID = req.loginUserID;
    var matchUserID = req.params.matchUID;
    console.log(userID, matchUserID);
    getCommonalities(userID, matchUserID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function getCommonalities(userID, matchUID, req, res) {
    doPromise(dbConn.getCommonalities(userID, matchUID), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}