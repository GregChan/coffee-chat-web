// require modules
var express = require('express'),
    app = express(),
    request = require('request'),
    bodyParser = require('body-parser'),
    dbConn = require("./resources/elf/db/dbConn.js"),
    logger = require("./logger.js").getLogger(),
    port = process.env.PORT || 1337,
    cookieParser = require('cookie-parser'),
    path = require('path'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    myLogger = function(req, res, next) {
        logger.debug('myLogger - new request: ' + req.path);
        next();
    },
//     myAutheticator = function(req, res, next) {
//         logger.debug('myLogger - new request: ' + req.cookies.userID);
//         if (undefined === req.cookies.userID || "undefined" == req.cookies.userID) {
//             authenticationFailed(req, res, next);
//         } else {
//             var userID = req.cookies.userID;
//             var p1 = dbConn.getUserName(userID);
//             return p1.then(
//                 function(val) {
//                     var obj = JSON.parse(val);
//                     console.log("serverjs: validated user: " + obj.id);
//                     req.loginUserID = obj.id;
//                     next();
//                     return;
//                 }
//             ).catch(
//                 function(reason) {
//                     authenticationFailed(req, res, next);
//                 }
//             );
//         }
// 
//     },
    authenticationFailed = function(req, res, next) {
        var path = req.path;
        if (path == "/" || path == "/callback" || path == "/wild/oauth/auth" || path == "/cat/oauth/getUserID") {
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
        res.status(401);
        res.end();
    },
    interalServerError = function(err, req, res, next) {
        logger.error(err.stack);
        res.status(500).send('Something broke!');
    },
    exitHandler = function(options, err) {
        if (options.cleanup) {
            dbConn.clearup();
        }
        if (err) console.log(err.stack);
        if (options.exit) process.exit();
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
//app.use(myAutheticator);
app.use(interalServerError);

// Homepage
app.get('/', function(req, res) {
    fs.readFile('./public/browse.json', function(err, data) {
        if (err) {
            throw err;
        }

        var people = JSON.parse(data);

        res.render('index', {
            people: people,
            person: {
                "name": "Lisa Eng",
                "image": "https://media.licdn.com/media/AAEAAQAAAAAAAALfAAAAJDU2YWFiZGM0LTgxZmEtNDcyZC05ODI4LTViZGM1YTg5MDkyOQ.jpg",
                "work": ["Product Manager, Business Intelligence, Aereo", "Special Operations, Warby Parker Marketing, Quirky", "Special Customer Operations, Simon Schuster", "Associate, Triage Consulting Group"],
                "education": ["MBA from NYU Stern Business School, University of California San Diego"],
                "tags": ["strategy", "marketing", "tech", "SF", "49ers", "dogs", "consulting", "productmanager"],
                "job": "Product Manager at Oracle Data Cloud",
                "quote": "I am a dog-lover, 49ers fan, and tech enthusiast. Previously in New York, I live in San Francisco now with my husband and malti-poo dog, Izzo. Yes named after Coach Izzo!"
            }
        });
    });
});

app.get('/schedule', function(req, res) {
    fs.readFile('./public/browse.json', function(err, data) {
        if (err) {
            throw err;
        }

        var people = JSON.parse(data);

        res.render('schedule', {
            people: people,
            user: {
                "name": "Stacey",
                "image": "http://d9hhrg4mnvzow.cloudfront.net/womensilab.com/coffeechat2/bb0185b8-sussana-shuman_07107207106x000002.jpg",
                "bio": "",
                "tags": ["tech", "sf", "49ers"],
                "job": "Northwestern University"
            }
        });
    });
});

app.get('/survey1', function(req, res) {
    fs.readFile('./public/browse.json', function(err, data) {
        if (err) {
            throw err;
        }

        var people = JSON.parse(data);
        var industries = ["Manufacturing", "Technology", "Transportation", "Legal", "Human Resources", "Health", "Arts", "Media", "Retail", "Urban Planning", "Government", "Finance", "Corporate Goods", "Education", "Service Goods", "Agriculture/Environment"];
        var hobbies = ["Basketball", "Rugby", "Soccer", "Football", "Baseball", "Horseback riding", "Hunting/Shooting", "Water sports", "Motor sports", "Rck climbing", "Skiing/Snowboarding", "Cycling", "Camping", "Fishing", "Running", "Swimming", "Bodybuilding", "Martial arts", "Skating", "Dance", "Backpacking", "Yoga", "Vegan", "Cooking", "Computer programming", "Online gaming", "Video games", "Pottery", "Acting", "Creative writing", "Music", "Arts/Crafts/DIY", "Reading", "Movies", "Photography", "Knitting", "Design", "Blogging", "Retail", "Interior design", "Coffee", "Board games", "Collecting specialty items", "Puzzles/games"];
        var jobFeatures = ["Stability", "Proximity to home", "Interesting/Challenging work", "Adequate benefits/salary", "Education/training benefits", "Ability to grow", "Relationships with peers", "Control over hours", "Company beliefs", "Company success", "Company culture", "Industry/Field/Title"];

        res.render('survey1', {
            people: people,
            industries: industries,
            hobbies: hobbies,
            jobFeatures: jobFeatures,
            user: {
                "name": "Stacey",
                "image": "http://d9hhrg4mnvzow.cloudfront.net/womensilab.com/coffeechat2/bb0185b8-sussana-shuman_07107207106x000002.jpg",
                "bio": "",
                "tags": ["tech", "sf", "49ers"],
                "job": "Northwestern University"
            }
        });
    });
});

app.get('/survey2', function(req, res) {
    fs.readFile('./public/browse.json', function(err, data) {
        if (err) {
            throw err;
        }

        var people = JSON.parse(data);
         var industries = ["Manufacturing", "Technology", "Transportation", "Legal", "Human Resources", "Health", "Arts", "Media", "Retail", "Urban Planning", "Government", "Finance", "Corporate Goods", "Education", "Service Goods", "Agriculture/Environment"];
        var hobbies = {
            "Team Sports": ["Basketball", "Rugby", "Soccer", "Football", "Baseball"],
            "Outdoor Sports": ["Horseback riding", "Hunting/Shooting", "Water sports", "Motor sports", "Rock climbing", "Skiing/Snowboarding", "Cycling", "Camping", "Fishing", "Running"],
            "Indoor Sports" : ["Swimming", "Bodybuilding", "Martial arts", "Skating", "Dance"],
            "Healthy Living" : ["Backpacking", "Yoga", "Vegan", "Cooking"],
            "Technology" : ["Computer programming", "Online gaming", "Video games"],
            "The Arts" : ["Pottery", "Acting", "Creative writing", "Music", "Arts/Crafts/DIY", "Reading", "Movies", "Photography"],
            "Fashion" : ["Knitting", "Design", "Blogging", "Retail", "Interior design"],
            "Other" : ["Coffee", "Board games", "Collecting specialty items", "Puzzles/games"]
            
        };
        var jobFeatures = ["Stability", "Proximity to home", "Interesting/Challenging work", "Adequate benefits/salary", "Education/training benefits", "Ability to grow", "Relationships with peers", "Control over hours", "Company beliefs", "Company success", "Company culture", "Industry/Field/Title"];
        res.render('survey2', {
            people: people,
            industries: industries,
            hobbies: hobbies,
            jobFeatures: jobFeatures,
            user: {
                "name": "Stacey",
                "image": "http://d9hhrg4mnvzow.cloudfront.net/womensilab.com/coffeechat2/bb0185b8-sussana-shuman_07107207106x000002.jpg",
                "bio": "",
                "tags": ["tech", "sf", "49ers"],
                "job": "Northwestern University"
            }
        });
    });
});


app.get('/match', function(req, res) {
    res.render('match', {
        user: {
            "name": "Stacey",
            "image": "http://d9hhrg4mnvzow.cloudfront.net/womensilab.com/coffeechat2/bb0185b8-sussana-shuman_07107207106x000002.jpg",
            "bio": "",
            "tags": ["tech", "sf", "49ers"],
            "job": "Northwestern University"
        },
        match: {
            "name": "Lisa Eng",
            "image": "https://media.licdn.com/media/AAEAAQAAAAAAAALfAAAAJDU2YWFiZGM0LTgxZmEtNDcyZC05ODI4LTViZGM1YTg5MDkyOQ.jpg",
            "work": ["Product Manager, Business Intelligence, Aereo", "Special Operations, Warby Parker Marketing, Quirky", "Special Customer Operations, Simon Schuster", "Associate, Triage Consulting Group"],
            "education": ["MBA from NYU Stern Business School", "University of California San Diego"],
            "tags": ["strategy", "marketing", "tech", "SF", "49ers", "dogs", "consulting", "productmanager"],
            "job": "Product Manager at Oracle Data Cloud",
            "quote": "I am a dog-lover, 49ers fan, and tech enthusiast. Previously in New York, I live in San Francisco now with my husband and malti-poo dog, Izzo. Yes named after Coach Izzo!"
        }
    });
});

var resource = null;
fs.readFile('./resources/resources.txt', function(err, data) {
    if (err) throw err;
    var array = data.toString().split("\n");
    for (i in array) {
        logger.debug(array[i]);
        resource = require(array[i]);

        if (typeof resource.getHandle === 'function') {
            logger.debug(resource.path + " GET");
            app.get('/' + resource.path, resource.getHandle);
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
