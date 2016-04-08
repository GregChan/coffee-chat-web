var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/community/join';

exports.putHandle = function(req, res) {
    insertUserIntoCommunity(req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function insertUserIntoCommunity(req, res) {
    var data = {
        userID: req.loginUserID, 
        communityID: req.body.companyCode
    };
    doPromise(dbConn.insertUserIntoCommunity(data), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}