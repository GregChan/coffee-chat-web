var exports = module.exports = {};

exports.path = 'signin';

exports.getHandle = function(req, res) {
    res.render('signin');
}