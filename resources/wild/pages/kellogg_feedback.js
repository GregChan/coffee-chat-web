var exports = module.exports = {},
    fs = require('fs');

exports.path = 'wild/pages/kellogg_feedback';

exports.getHandle = function(req, res) {
    fs.readFile('./public/browse.json', function(err, data) {
        if (err) {
            throw err;
        }

        var people = JSON.parse(data);
        res.render('kellogg_feedback', {
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
}