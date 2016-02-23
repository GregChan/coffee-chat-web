var exports = module.exports = {},
    fs = require('fs');

exports.path = 'wild/pages/survey2';

exports.getHandle = function(req, res) {
    var http = require('http'); 

    var options = {
      host: "localhost",
      port:1337,
      path: '/cat/info/1/getSurvey',
      method: 'GET',
      headers: {'Cookie': 'userID='+req.cookies.userID}
    };

    callback = function(response) {
        var survey = '';
        response.on('data', function(d) {
            survey= JSON.parse(d);
        });
        response.on('end', function() {
            if(req.loginUserID != undefined && req.loginUserID != "undefined")
            {
                res.render('survey2', {
                        survey: survey
                });
                res.end();
                return;

            }
        
            else
            {
                res.status(500);
                res.end();
            }
            return;
            
        });

        req.on('error', function(e) {
            throw err;
        });
      
    }

    var request = http.request(options, callback);
   // request.write(bodyString);
    request.end();
    
    

}