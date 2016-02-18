var exports = module.exports = {},
    fs = require('fs');
    dbConn = require("./../../elf/db/dbConn.js");

exports.path = '';

exports.getHandle = function(req, res) {
    fs.readFile('./public/browse.json', function(err, data) {
        if (err) {
            throw err;
        }
        var people = JSON.parse(data);
        console.log('homepage: '+req.loginUserID);
        if(req.loginUserID != undefined && req.loginUserID != "undefined")
        {
            var p1 = dbConn.getUserName(req.loginUserID); // should call cat resource instead.
            p1.then(
                function(val)
                {
                    var curUser=(JSON.parse(val));

                    res.render('index', {
                        people: people,
                        curUser:curUser,
                        person: {
                            "name": "Lisa Eng1",
                            "image": "https://media.licdn.com/media/AAEAAQAAAAAAAALfAAAAJDU2YWFiZGM0LTgxZmEtNDcyZC05ODI4LTViZGM1YTg5MDkyOQ.jpg",
                            "work": ["Product Manager, Business Intelligence, Aereo", "Special Operations, Warby Parker Marketing, Quirky", "Special Customer Operations, Simon Schuster", "Associate, Triage Consulting Group"],
                            "education": ["MBA from NYU Stern Business School, University of California San Diego"],
                            "tags": ["strategy", "marketing", "tech", "SF", "49ers", "dogs", "consulting", "productmanager"],
                            "job": "Product Manager at Oracle Data Cloud",
                            "quote": "I am a dog-lover, 49ers fan, and tech enthusiast. Previously in New York, I live in San Francisco now with my husband and malti-poo dog, Izzo. Yes named after Coach Izzo!"
                        }
                    });
                    res.end();
                    return;
                }).catch(
                function(reason) {
                    var obj=JSON.parse(reason)
                    res.status(obj.error);
                    return;
          
                }
            );
        }
        else
        {
            res.render('index', {
                people: people,
                person: {
                    "name": "Lisa Eng2",
                    "image": "https://media.licdn.com/media/AAEAAQAAAAAAAALfAAAAJDU2YWFiZGM0LTgxZmEtNDcyZC05ODI4LTViZGM1YTg5MDkyOQ.jpg",
                    "work": ["Product Manager, Business Intelligence, Aereo", "Special Operations, Warby Parker Marketing, Quirky", "Special Customer Operations, Simon Schuster", "Associate, Triage Consulting Group"],
                    "education": ["MBA from NYU Stern Business School, University of California San Diego"],
                    "tags": ["strategy", "marketing", "tech", "SF", "49ers", "dogs", "consulting", "productmanager"],
                    "job": "Product Manager at Oracle Data Cloud",
                    "quote": "I am a dog-lover, 49ers fan, and tech enthusiast. Previously in New York, I live in San Francisco now with my husband and malti-poo dog, Izzo. Yes named after Coach Izzo!"
                }
            });
            res.end();
        }
        return;
    });
}