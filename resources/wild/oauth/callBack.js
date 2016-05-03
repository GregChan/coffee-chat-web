var exports = module.exports = {},
    oauth2 = require('simple-oauth2'),
    path = require('path'),
    request = require('request'),
    auth = require('./auth.js'),
    cypher = require('../../elf/crypto/aesCipher.js');

exports.path = 'callback';


exports.getHandle = function(req, res) {
    var code = req.query.code,
        state = req.query.state;
    console.log('/wild/oauth/callback');
    console.log(code);
    console.log(state);

    auth.linkedInOauth2.authCode.getToken({
            code: code,
            state: state,
            redirect_uri: process.env.BASE_URL + '/callback'
        },
        saveToken);

    function saveToken(error, result) {
        if (error) {
            console.log('Access Token Error', error.message);
        }

        token = auth.linkedInOauth2.accessToken.create(result);

        // this is where we need to do something with their token...
        console.log(token);
        createOAuthUser(token.token.access_token, res)


    }
}

function createOAuthUser(token, res) {
    console.log('createOAuthUser token', token);

    request({
        url: process.env.BASE_URL + '/cat/oauth/getUserID',
        method: 'POST',
        json: true,
        body: {
            accessToken: token
        }
    }, function(error, response, body) {
        if (error || body.user=== undefined) {
            console.log('server.js: createOAuthUser met error ' + e);
            res.redirect('/');
            res.end();
        } else {
            var userID = body.user;
            console.log('server.js: got userID ' + userID);
            var encryptedID = cypher.encrypt(userID.toString() + '&' + Date.now().toString());
            console.log('server.js: encryptedID ' + encryptedID);
            res.cookie('userID', encryptedID, {
                maxAge: 9000000,
                httpOnly: false
            });

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