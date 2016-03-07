var exports = module.exports = {},
    fs = require('fs'),
    async = require('async'),
    request = require('request');

exports.path = 'settings';

exports.getHandle = function(req, res) {
    async.parallel([
            function(callback) {
                request({
                    url: process.env.BASE_URL + '/cat/user/' + req.cookies.userID + '/profile',
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
                    url: process.env.BASE_URL + '/cat/user/community/1/profile',
                    method: 'GET',
                    headers: {
                        'Cookie': 'userID=' + req.cookies.userID
                    }
                }, function(error, response, body) {
                    console.log(body);
                    callback(error, JSON.parse(body));
                });
            }
        ],
        function(err, results) {
            if (!err) {
                console.log(results[1]);
                var data = {
                    profile: results[0],
                    interests: results[1]
                }

                res.render('settings', data);
            } else {
                res.sendStatus(500);
            }
        });
}

exports.postHandle = function(req, res) {
    console.log(req.cookies.userID);
    request({
        url: process.env.BASE_URL + '/cat/user/' + req.cookies.userID + '/profile',
        method: 'POST',
        headers: {
            'Cookie': 'userID=' + req.cookies.userID
        },
        json: true,
        body: req.body
    }, function(error, response, body) {
        console.log(body);
        res.json({});
    });
}