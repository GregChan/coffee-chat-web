var exports = module.exports = {},
    fs = require('fs');

exports.path = 'signup';

exports.getHandle = function(req, res) {
    res.redirect('http://goo.gl/forms/vMQ8cFtijS');
}