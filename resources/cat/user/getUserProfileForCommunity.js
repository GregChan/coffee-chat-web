var exports = module.exports = {};
var dbConn = require('../../elf/db/dbConn.js');

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path='cat/user/:userID/community/:commID/profile';

exports.getHandle = function (req,res) {
    var commID = req.params.commID;
    var userID = req.params.userID;
    getUserProfileForCommunity(userID, commID, res, req);
}

function getUserProfileForCommunity(userID, commID,res, req)
{
    console.log('getUserProfileForCommunity ' + userID);
    var p1 = dbConn.getUserProfileForCommunity(userID,commID);
    return p1.then(
        function(data)
        {
           console.log('getUserProfileForCommunity: done');
           res.json(data);
        }
    ).catch(
        function(reason) {
            var obj=reason;
            res.status(obj.error).end();
        }
    );
    return;
}