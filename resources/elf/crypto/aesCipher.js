var exports = module.exports = {},
    crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = '7e78367c-NUc0FfeEcHat2o16';


exports.encrypt = function(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
      crypted += cipher.final('hex');
    return crypted;
}

exports.decrypt = function(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
      dec += decipher.final('utf8');
    return dec;
}


