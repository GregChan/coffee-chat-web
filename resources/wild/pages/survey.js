var exports = module.exports = {},
    request = require('request');

exports.path = 'survey';

exports.getHandle = function(req, res) {
    request({
        url: process.env.BASE_URL + '/cat/community/1/profile-survey',
        method: 'GET',
        headers: {
            'Cookie': 'userID=' + req.cookies.userID
        }
    }, function(error, response, body) {
        var survey = JSON.parse(body);

        if (req.cookies.userID != undefined && req.cookies.userID != "undefined") {
            res.render('survey', {
                survey: survey,
                curUser: req.cookies.userID
            });
            res.end();
            return;

        } else {
            res.status(500);
            res.end();
        }
    });
}