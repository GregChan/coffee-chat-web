var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");
var async = require('async')

exports.path = 'cat/user/:userId/profile';

exports.getHandle = function(req, res) {
    console.log('user/{userID}/profile: userID: request received');
    var userId = req.params.userId;
    console.log('user/{userID}/profile: userID: ' + req.params.userId);
    getUserProfile(userId, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function getUserProfile(userId, res) {
    async.parallel([
        function(callback) {
            var p = dbConn.getUser(userId);
            doPromise(p, callback);
        },
        function(callback) {
            var p = dbConn.getUserPositions(userId);
            doPromise(p, callback);
        }
    ], function(err, results) {
        if (err) {
            console.log(err);
            res.status(err.error);
        } else {
            var data = results[0];
            data['positions'] = results[1];
            res.json(data);
        }
    });
}