var exports = module.exports = {};
var cypher = require('../../elf/crypto/aesCipher.js');

exports.path = 'cat/dev/:userId/impersonation';

exports.getHandle = function(req, res) {
  
    var userId = req.loginUserID;
    if(userId != 91 && userId != 131 && userId != 151 && userId != 481 && userId != 491 && userId != 541 && userId != 551 && userId != 561)
    {   
        // TODO: a more appropriate access control
        res.status(401).end();
    }
    var impersonizedUserId = req.params.userId;
    var encryptedID = cypher.encrypt(impersonizedUserId.toString()+'&'+Date.now().toString());
    res.json({
        cookieStr: encryptedID
    });
}

