var exports = module.exports = {},
    request = require('request'),
    fs = require('fs');

exports.path = '';

exports.getHandle = function(req, res) {
    if (req.cookies.userID != undefined && req.cookies.userID != "undefined") {
        var options = {
            url: 'http://localhost:1337/cat/user/' + req.cookies.userID,
            headers: {
                'Cookie': 'userID=' + req.cookies.userID
            }
        };
        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var curUser = (JSON.parse(body));
				getMatchStatus(curUser.userID);
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

function getMatchStatus(uID) {
	var http = require('http');
	
	var options = {
	host: "localhost",
	port: 1337,
	path: '/cat/user/community/1/match/current',
	method: 'GET',
	headers: {
		'Cookie': 'userID=' + uID
	}
	};
	
	callback = function(error, response, body) {
		console.log(response);
		return;
	}
	
	var request = http.request(options, callback);
	request.end();
}


