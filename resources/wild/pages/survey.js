var exports = module.exports = {},
    request = require('request'),
    async = require('async');

exports.path = 'survey';

exports.getHandle = function(req, res) {
    if (req.cookies.userID != undefined && req.cookies.userID != "undefined") {
        async.parallel([
                function(callback) {
                    request({
                        url: process.env.BASE_URL + '/cat/user/' + req.loginUserID + '/profile',
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
                },
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
            ],
            function(err, results) {
                var hasFilledOutSurvery = Object.keys(results[1]).length > 0;
                if (!err) {
                    var hasFilledOutSurvery = Object.keys(results[1]).length > 0;
                    if (hasFilledOutSurvery) {
                        res.redirect('/');
                    }
                    else
                    {
                        res.render('survey', {
                            profile: results[0],
                            survey: results[1]
                        });
                    }
                } else {
                    res.status(500);
                }
            });
    } else {
        res.status(500);
    }
}