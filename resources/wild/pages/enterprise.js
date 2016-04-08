var exports = module.exports = {};

exports.path = 'enterprise';

exports.getHandle = function(req, res) {
    res.render('enterprise', {
    	curUser: req.loginUserID
    });
}