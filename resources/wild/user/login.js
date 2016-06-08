var exports = module.exports = {},
    path = require('path'),
    request = require('request'),
    cypher = require('../../elf/crypto/aesCipher.js');
var logger=require("../../../logger.js").getLogger();
exports.path = 'wild/user/login';


exports.postHandle = function(req, res) {
    logger.debug('user/login: userID: request received');
    console.log('user/login: body: '+ req.body.email + ' ,'+req.body.pw);
    req.accepts('application/json');
    loginUser(req.body.email, req.body.pw, res);
}

function loginUser(email,pw, res) {
    console.log('loginUser '+email);

    request({
        url: process.env.BASE_URL + '/cat/user/auth',
        method: 'POST',
        json: true,
        body: {
            email: email,
            pw:pw
        }
    }, function(error, response, body) {
        if (error) {
            console.log('server.js: createOAuthUser met error ' + error);
            res.redirect('/');
            res.end();
        } else {
            var userID = body.userID;
            console.log('server.js: got userID ' + userID);
            if(userID != undefined){
                var encryptedID = cypher.encrypt(userID.toString() + '&' + Date.now().toString());
                console.log('server.js: encryptedID ' + encryptedID);
                res.cookie('userID', encryptedID, {
                    maxAge: 9000000,
                    httpOnly: false
                });
            }
           

            request({
                method: 'GET',
                json: true,
                url: process.env.BASE_URL + '/cat/user/' + userID + '/admin',
                headers: {
                    'Cookie': 'userID=' + encryptedID
                }
            }, function(err, response, body) {
                if (body.length > 0) {
                    res.redirect('/admin/talent');
                } else {
                    res.redirect('/');
                }
            });
        }
    });
}