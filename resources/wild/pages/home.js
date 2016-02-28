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

//function getMatchStatus() {
//	var http = require('http');
//	
//	var options = {
//	host: "localhost",
//	port: 1337,
//	path: '/cat/user/community/1/match/current',
//	method: 'GET',
//	headers: {
//		'Cookie': 'userID=' + curUser.uID
//	}
//	};
//	
//	callback = function(response) {
//		var matches = '';
//		response.on('data', function(d) {
//					matches = JSON.parse(d);
//					});
//		response.on('end', function() {
//					if (req.cookies.userID != undefined && req.cookies.userID != "undefined") {
//					res.end();
//					return;
//					
//					} else {
//					res.status(500);
//					res.end();
//					}
//					return;
//					
//					});
//		
//		req.on('error', function(e) {
//			   throw err;
//						});
//		
//	}
//	
//	
//	var request = http.request(options, callback);
//	request.end();
//}
//
//getMatchStatus();
