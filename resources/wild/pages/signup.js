var exports = module.exports = {};

exports.path = 'signup';

exports.getHandle = function(req, res) {
    res.render('signup');
}