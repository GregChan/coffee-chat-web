var exports = module.exports = {};

exports.path = 'team';

exports.getHandle = function(req, res) {
    res.render('team', {
    	curUser: req.loginUserID
    });
}