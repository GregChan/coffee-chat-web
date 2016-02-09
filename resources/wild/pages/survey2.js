var exports = module.exports = {},
    fs = require('fs');

exports.path = 'survey2';

exports.getHandle = function(req, res) {
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
}