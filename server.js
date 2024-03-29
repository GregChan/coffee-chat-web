// require modules
var express = require('express'),
    app = express(),
    config = require('./config'),
    request = require('request'),
    bodyParser = require('body-parser'),
    dbConn = require("./resources/elf/db/dbConn.js"),
    cypher = require('./resources/elf/crypto/aesCipher.js'),
    logger = require("./logger.js").getLogger(),
    port = process.env.PORT || 1337,
    cookieParser = require('cookie-parser'),
    path = require('path'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    basicAuth = require('basic-auth'),

    myLogger = function(req, res, next) {
        logger.debug('myLogger - new request: ' + req.path);
        next();
    },
    authenticator = function(req, res, next) {

        logger.debug('myLogger - user id: ' + req.cookies.userID);
        if (req.path.slice(1, 5) == "team" || req.path.slice(1, 6) == "tools" || req.path.slice(1, 5) == "Kell" || req.path == "/cat/community" || req.path == "/feedback" || req.path == "/signin" || req.path == "/signup" || req.path == "/faq") {
            next();
            return;
        }
        // if(req.path.slice(1,5) != 'wild' && req.path.slice(1,5) != 'cat/')
        // {
        //       next();
        //       return;
        // }
        if (undefined === req.cookies.userID || "undefined" == req.cookies.userID) {
            authenticationFailed(req, res, next);
        } else {
            var encryptedUserID = req.cookies.userID;
            var decryptedStr = cypher.decrypt(encryptedUserID).split('&');
            if (decryptedStr.length < 2 || Date.now() - decryptedStr[1] > 9000000) {
                authenticationFailed(req, res, next);
                return;
            }
            // console.log('server.js: cookie validated for ' + (Date.now() - decryptedStr[1]).toString());
            var decryptedID = decryptedStr[0];
            console.log('server.js: encryptedID ' + decryptedID);
            var p1 = dbConn.getUser(decryptedID);
            return p1.then(
                function(data) {
                    var obj = data;
                    console.log("serverjs: validated user: " + obj.userId +" with communityID "+ obj.communityID);
                    req.loginUserID = obj.userId;
                    req.communityID = obj.communityID;
                    next();
                    return;
                }
            ).catch(
                function(reason) {
                    console.log(reason);
                    authenticationFailed(req, res, next);
                }
            );
        }
    },
    authenticationFailed = function(req, res, next) {
        var path = req.path;
        if (path == "/" || path == "/callback" || path == "/wild/oauth/auth" || path == "/cat/oauth/getUserID" || path == "/enterprise" || path == "/wild/user/login" || path == "/cat/user/auth" || path =="/cat/user/createUser") {
            logger.debug("authenticationFailed : path matched ");
            next();
            return;
        }
        console.log("authenticationFailed -- ");
        if (path.slice(1, 5) == 'wild') {
            logger.debug("authenticationFailed : redirect request to home page ");
            res.redirect('/');
        }

        // TDOO: return something other than 401...
        next(new Error(401));
    },
    exitHandler = function(options, err) {
        if (options.cleanup) {
            dbConn.clearup();
        }
        if (err) console.log(err.stack);
        if (options.exit) process.exit();
    },
    auth = function(req, res, next) {
        function unauthorized(res) {
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            res.sendStatus(401);
            return;
        };

        var user = basicAuth(req);

        if (!user || !user.name || !user.pass) {
            unauthorized(res);
            return;
        };

        var password = process.env.PASSWORD,
            username = process.env.USERNAME;

        if (user.name === username && user.pass === password) {
            next();
            return;
        } else {
            unauthorized(res);
            return;
        };
    },
    errorHandler = function() {
        // 404 not found
        app.use(function(req, res) {
            res.status(404);
            res.render('error/404');
        });

        // 401 unauthorized
        app.use(function(err, req, res, next) {
            logger.error(err.stack);
            if (err.message == 401) {
                res.status(401);
                res.render('error/401');
            } else {
                next(err);
            }
        });

        // 500 internal server error
        app.use(function(err, req, res, next) {
            logger.error(err.stack);
            res.status(500);
            res.render('error/500');
        });
    };

// App settings
app.set('views', './views');
app.set('view engine', 'jade');
app.use('/public', express.static('public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

app.use(myLogger);
app.use(cookieParser());
app.use(authenticator);

var resource = null;
fs.readFile('./resources/resources.txt', function(err, data) {
    if (err) throw err;
    var array = data.toString().split("\n");
    for (i in array) {
        logger.debug(array[i]);
        resource = require(array[i]);

        if (typeof resource.getHandle === 'function') {
            logger.debug(resource.path + " GET");

            if (process.env.ENV == "staging" || resource.path.slice(0, 5) == "tools") {
                app.get('/' + resource.path, auth, resource.getHandle);
            } else {
                app.get('/' + resource.path, resource.getHandle);
            }
        }
        if (typeof resource.postHandle === 'function') {
            logger.debug(resource.path + " POST");
            app.post('/' + resource.path, resource.postHandle);
        }
        if (typeof resource.putHandle === 'function') {
            logger.debug(resource.path + " PUT");
            app.put('/' + resource.path, resource.putHandle);
        }
    }

    errorHandler();
});

app.listen(port, function() {
    logger.debug('Example app listening on port %s!', port);
});

//do something when app is closing
process.on('exit', exitHandler.bind(null, {
    cleanup: true
}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {
    exit: true
}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
    exit: true
}));
