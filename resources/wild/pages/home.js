var exports = module.exports = {},
    request = require('request'),
    fs = require('fs');
dbConn = require("./../../elf/db/dbConn.js");

exports.path = '';

exports.getHandle = function(req, res) {
    if (req.cookies.userID != undefined && req.cookies.userID != "undefined") {
        var p1 = dbConn.getUserName(req.cookies.userID); // should call cat resource instead.

        p1.then(function(val) {
            var curUser = (JSON.parse(val));
            res.render('index', {
                curUser: curUser
            });
            res.end();
        }).catch(function(reason) {
            var obj = JSON.parse(reason)
            res.status(obj.error);
            return;
        });
    } else {
        res.render('index');
        res.end();
    }
    return;
}