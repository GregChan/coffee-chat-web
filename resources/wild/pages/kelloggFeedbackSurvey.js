var exports = module.exports = {},
    fs = require('fs');

exports.path = 'KelloggAdmissions/feedback';

exports.getHandle = function(req, res) {
    res.redirect('http://goo.gl/forms/Q9jQoJqu0g');
}