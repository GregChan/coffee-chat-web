var exports = module.exports = {},
    fs = require('fs'),
    async = require('async'),
    request = require('request');

exports.path = 'settings';

exports.getHandle = function(req, res) {
    async.parallel([
            function(callback) {
                request({
                    url: 'http://localhost:1337/cat/user/' + req.cookies.userID + '/community/1/profile',
                    method: 'GET',
                    headers: {
                        'Cookie': 'userID=' + req.cookies.userID
                    }
                }, function(error, response, body) {
                    callback(error, JSON.parse(body));
                });
            },
            function(callback) {
                request({
                    url: 'http://localhost:1337/cat/user/' + req.cookies.userID,
                    method: 'GET',
                    headers: {
                        'Cookie': 'userID=' + req.cookies.userID
                    }
                }, function(error, response, body) {
                    callback(error, JSON.parse(body));
                });
            }
        ],
        function(err, results) {
            if (!err) {
                var data = {
                    communities: [
                        results[0]
                    ],
                    profile: results[1]
                }

                res.render('settings', data);
            } else {
                res.sendStatus(500);
            }
        });
}