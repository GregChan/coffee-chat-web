var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

exports.path = 'cat/user/createUser';

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
    var obj = req.body;
    if (obj.firstName === undefined || obj.firstName == '' || obj.lastName === undefined || obj.lastName == ''|| obj.email === undefined || obj.email == ''|| obj.password === undefined || obj.password == '') {
       res.sendStatus(400);
       return;
    }
    if(!validateEmail(obj.email))
    {
        res.sendStatus(400);
        return;
    }
    doPromise(dbConn.createUser(obj), function(error, data) {
        if (error) {
            console.log(error);
            res.sendStatus(error.error);
        } else {
            res.json(data);
        }
    }); 
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}