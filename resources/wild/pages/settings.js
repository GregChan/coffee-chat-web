var exports = module.exports = {},
    fs = require('fs');

exports.path = 'settings';

exports.getHandle = function(req, res) {
    var http = require('http');

    var options = {
        host: "localhost",
        port: 1337,
        path: '/cat/community/1/settings',
        method: 'GET',
        headers: {
            'Cookie': 'userID=' + req.cookies.userID
        }
    };

    callback = function(response) {
        var settings = {};

        response.on('data', function(data) {
            settings = JSON.parse(data);
        });

        response.on('end', function() {
            if (req.cookies.userID != undefined && req.cookies.userID != "undefined") {
                res.render('settings', {
                    settings: settings
                });
                res.end();
                return;

            } else {
                res.status(500);
                res.end();
            }
            return;

        });

        req.on('error', function(e) {
            throw err;
        });
    }

    var request = http.request(options, callback);
    request.end();
}