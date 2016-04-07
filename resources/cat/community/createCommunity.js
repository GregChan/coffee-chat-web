var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/community';

exports.putHandle = function(req, res) {
    createCommunity(req, res);
}

function doPromise(p, callback) {
    p.then(function(data) {
        callback(null, data);
    }).catch(function(reason) {
        callback(reason, null);
    });
}

function createCommunity(req, res) {
    var data = req.body;
    doPromise(dbConn.createCommunity(data), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}