var exports = module.exports = {},
    request = require('request');
    async = require('async'),

exports.path = 'survey';

exports.getHandle = function(req, res) {
    if (req.cookies.userID != undefined && req.cookies.userID != "undefined") {
        async.parallel([
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
                    url: process.env.BASE_URL + '/cat/user/' + req.cookies.userID,
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
                console.log(results[1]);
                if (!err){
                    res.render('survey', {
                    survey: results[0],
                    curUser: results[1]
                    });
                } else {
                    res.status(500);
                }
                res.end();
            });
        } else {
            res.status(500);
            res.end();
        }    
}