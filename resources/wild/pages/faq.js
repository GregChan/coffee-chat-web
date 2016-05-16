var exports = module.exports = {};

exports.path = 'faq';

exports.getHandle = function(req, res) {
    res.render('faq');
}