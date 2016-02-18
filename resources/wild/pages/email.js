var exports = module.exports = {};

exports.path = 'email';

exports.getHandle = function(req, res) {
	res.render('email');
}