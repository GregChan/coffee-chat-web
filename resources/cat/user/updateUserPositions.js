var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");
var async = require('async')

exports.path = 'cat/user/:userID/profile';

exports.postHandle = function(req, res) {
    console.log('user/{userID}/profile: userID: request received');
    var userID = req.params.userID;
    console.log('user/{userID}/profile: userID: ' + req.params.userID);
    updateUserPositions(userID, req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function updateUserPositions(userID, req, res) {
    var positions = req.body;
    doPromise(dbConn.updateUserPositions(userID, positions), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(200);
        } else {
            console.log(data);
            res.sendStatus(200);
        }
    }); 
}