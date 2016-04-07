var exports = module.exports = {},
    fs = require('fs'),
    async = require('async'),
    request = require('request');

exports.path = 'analytics';

exports.getHandle = function(req, res) {
    async.parallel([
            function(callback) {
                request({
                    url: process.env.BASE_URL + '/cat/user/community/1/match/all',
                    method: 'GET',
                    headers: {
                        'Cookie': 'userID=' + req.cookies.userID
                    }
                }, function(error, response, body) {
                    callback(error, JSON.parse(body));
                });
            },
        ],
        function(err, results) {
            if (!err) {
                var data = {
                    communities: [
                        results[0]
                    ],
                    curUser: req.cookies.userID,
                }
                console.log(results[0]);
                res.render('analytics', data);
            } else {
                res.sendStatus(500);
            }
        });
}