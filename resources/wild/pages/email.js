var exports = module.exports = {};

exports.path = 'tools/email';

exports.getHandle = function(req, res) {
	res.render('email');
}