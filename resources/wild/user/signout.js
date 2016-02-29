var exports = module.exports = {},
    path = require('path');

exports.path = 'wild/user/signout';


exports.getHandle = function(req, res) {
   res.clearCookie('userID');
   res.redirect('/');   
}
