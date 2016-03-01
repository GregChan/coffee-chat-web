var exports = module.exports = {},
    fs = require('fs'),
    async = require('async'),
    request = require('request');

exports.path = 'settings';

exports.getHandle = function(req, res) {
    async.parallel([
            function(callback) {
                request({
                    url: process.env.BASE_URL + '/cat/user/community/1/profile',
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
                    url: process.env.BASE_URL + '/cat/user/' + req.cookies.userID,
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
                    url: process.env.BASE_URL + '/cat/community/1/profile-survey',
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
                    profile: results[1],
                    curUser: req.cookies.userID,
                    survey: results[2]
                }

                res.render('settings', data);
            } else {
                res.sendStatus(500);
            }
        });
}