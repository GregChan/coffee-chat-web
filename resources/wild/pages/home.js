var exports = module.exports = {},
    request = require('request'),
    fs = require('fs');

exports.path = '';

exports.getHandle = function(req, res) {
    if (req.cookies.userID != undefined && req.cookies.userID != "undefined") {
        var options = {
            url: 'http://localhost:1337/cat/user/' + req.cookies.userID + '/getUserName',
            headers: {
                'Cookie': 'userID=' + req.cookies.userID
            }
        };

        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var curUser = (JSON.parse(body));
                res.render('index', {
                    curUser: curUser
                });
                res.end();
            } else {
                res.render('index');
                res.end();
            }
        });
    } else {
        res.render('index');
        res.end();
    }
}