var mysql = require("mysql");
var Promise = require('promise');
var logger = require("../../../logger.js").getLogger();

var exports = module.exports = {};


var pool = mysql.createPool({
    connectionLimit: 4, //maximum connection for Azure student
    host: "us-cdbr-azure-central-a.cloudapp.net",
    user: "b443fc80dd2566",
    password: "4d39195d",
    database: "coffeechat"
});

exports.clearup = function() {
    logger.debug('Going to release DB connection pool');
    pool.end(function(err) { //release all connections
        logger.debug('Error in release pool ' + err);
    });
}
// SELECT  a.fieldID, a. fieldName, a.communityID, a.required, a. displayPriority,a.grouped, b.group, b.name
// from survey_field_desc as a 
// inner join survey_field_items as b
// Where a.communityID = 1
// and a.fieldID = b.fieldID


exports.addSurveyData = function(userID, communityID, surveys)
{
    return new Promise(function(resolve, reject) {
           pool.getConnection(function(err, connection) {
                if (err) {
                    connection.release();
                    logger.debug('Error in connection database');

                    reject('{"error":"500","errorMsg": "Error in connection database"}');
                }
                logger.debug('connected as id ' + connection.threadId);

                var sql = "INSERT INTO user_survey (userID, communityID, fieldID, itemID) VALUES ? ON DUPLICATE KEY UPDATE userID=userID";
                var values = [];
                for(index = 0; index < surveys.length; index++) {
                    var fieldID = surveys[index].fieldID;
                    var choices = surveys[index].chocies;
                    for(i = 0; i < choices.length; i++) {
                        var v = [userID, communityID, fieldID, choices[i]];
                        values.push(v);
                    }  
                }
                connection.query(sql, [values], function(err) {
                    if (err)
                    {
                         logger.debug('Error in connection database');
                         connection.release();
                         reject('{"error":"500","errorMsg": '+err+'}');
                    }
                    connection.release();
                    resolve(200);
                });
                connection.on('error',function(err) {
                    logger.debug('Error in connection database');
                    connection.release();
                    reject('{"error":"500","errorMsg": "Error in connection database"}');

                });
             });
       });
}

exports.getSurvey = function(communityID)
{
    return new Promise(function(resolve, reject) {
           pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('Error in connection database');
            }
            logger.debug('connected as id ' + connection.threadId);

            var sql = "SELECT  a.fieldID, a. fieldName, a.communityID, a.required, a. displayPriority,a.grouped, b.id, b.group, b.name from survey_field_desc as a inner join survey_field_items as b Where a.communityID = ? and a.fieldID = b.fieldID ORDER BY a.fieldID, b.group, b.name";
            var inserts = [communityID];
            sql = mysql.format(sql, inserts);
            logger.debug("getIndustryList: going to query survey list: "+ sql);
            connection.query(sql,function(err, rows) {
                if(!err)
                {
                    if(rows.length > 0 ) {                   
                         var result = JSON.parse("{}");
                         result["community"]=communityID;
                         result["fields"] =JSON.parse("[]");
                         var fieldID = -1;
                         var field ;
                         var groupName;
                         var hasGroup = false;
                         var group;
                         for(i=0; i<rows.length;i++)
                         {
                            if(fieldID != rows[i].fieldID )
                            {
                                if(fieldID != -1)
                                {
                                    if(hasGroup)
                                    {
                                        field["values"].push(group); 
                                        hasGroup = false;
                                    }
                                    result["fields"].push(field);  
                                }
                                fieldID = rows[i].fieldID ;
                                field = JSON.parse("{}");
                                field["fieldID"] = fieldID;
                                field["name"] = rows[i].fieldName;
                                field["required"] = rows[i].required == 0? false:true;
                                field["grouped"] = rows[i].grouped == 0? false:true;
                                field["priority"] = rows[i].displayPriority;
                                field["values"] =JSON.parse("[]");
                            }
                            if(rows[i].grouped == 0)
                            {
                                if(hasGroup)
                                {
                                    field["values"].push(group); 
                                    hasGroup = false;
                                }
                                field["values"].push(JSON.parse('{"id":'+rows[i].id+', "name":"'+rows[i].name+'"}'));
                            }
                            else
                            {
                                if(hasGroup)
                                {
                                    if(groupName != rows[i].group )
                                    {
                                        field["values"].push(group);  
                                        groupName = rows[i].group;
                                        group = JSON.parse("{}");
                                        group["name"] = groupName;
                                        group["values"] =JSON.parse("[]");
                                    }
                                }
                                else
                                {
                                    groupName = rows[i].group;
                                    group = JSON.parse("{}");
                                    group["name"] = groupName;
                                    group["values"] =JSON.parse("[]");
                                    hasGroup=true;
                                }
                                group["values"].push(JSON.parse('{"id":'+rows[i].id+', "name":"'+rows[i].name+'"}'));

                            }

                            if(i==rows.length-1)
                            {
                                if(hasGroup)
                                {
                                    field["values"].push(group);  
                                }
                                result["fields"].push(field); 
                            }
                        }
                    
                    console.log("getSurvey: result: "+ result);
                    connection.release();
                    resolve(result);
                
                    }
                    else
                    {
                        logger.debug("dbConn: unable to find hobby list.");
                        connection.release();
                        reject('{"error":"500", "errorMsg":"DB Error"}');
                                    
                    }
                }
                else
                {
                     logger.debug('Error in connection database');
                     connection.release();
                     reject('{"error":"500","errorMsg": '+err+'}');
                }
               
            });
            connection.on('error',function(err) {
                logger.debug('Error in connection database');
                connection.release();
                reject('{"error":"500","errorMsg": "Error in connection database"}');

            });
        });
       });
}


exports.addSchool = function(userID, schoolName, gradYear) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('{"error":"500","errorMsg": "Error in connection database"}');
            }
            logger.debug('connected as id ' + connection.threadId);


            var curYear = new Date().getFullYear();
            logger.debug('addSchool.curYear' + curYear);
            var startYear = gradYear - 100;
            var isCur = false;
            if (curYear < gradYear)
                isCur = true;
            var positions = '{"values":[{"endDate":{"year":' + gradYear + ',"month":1},"startDate":{"year":' + startYear + ',"month":1},"isCurrent":' + isCur + ',"title":"student","company":{"industry":"Higher Education","name":"' + schoolName + '","size":"5001-10,000 employees", "type":"Education Insitution"}}]}';
            console.log('user/addSchool: positions: ' + positions);
            positions = JSON.parse(positions);

            addPositions(userID, positions, connection, resolve, reject);
            //resolve(200);
        });
    });
}

exports.addInterestJobfeature = function(userID, jobFeatures) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('{"error":"500","errorMsg": "Error in connection database"}');
            }
            logger.debug('connected as id ' + connection.threadId);

            var sql = "INSERT INTO user_interests_jobfeature (userID,jobfeatureID) VALUES ? ON DUPLICATE KEY UPDATE userID=userID";
            var values = [];
            for (index = 0; index < jobFeatures.length; index++) {
                var v = [userID, jobFeatures[index]];
                values.push(v);
            }
            connection.query(sql, [values], function(err) {
                if (err) {
                    logger.debug('Error in connection database');
                    connection.release();
                    reject('{"error":"500","errorMsg": ' + err + '}');
                }
                connection.release();
                resolve(200);
            });
            connection.on('error', function(err) {
                logger.debug('Error in connection database');
                connection.release();
                reject('{"error":"500","errorMsg": "Error in connection database"}');

            });
        });
    });
}

exports.addInterestHobby = function(userID, hobbies) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('{"error":"500","errorMsg": "Error in connection database"}');
            }
            logger.debug('connected as id ' + connection.threadId);

            var sql = "INSERT INTO user_interests_hobby (userID,hobbyID) VALUES ? ON DUPLICATE KEY UPDATE userID=userID";
            var values = [];
            for (index = 0; index < hobbies.length; index++) {
                var v = [userID, hobbies[index]];
                values.push(v);
            }
            connection.query(sql, [values], function(err) {
                if (err) {
                    logger.debug('Error in connection database');
                    connection.release();
                    reject('{"error":"500","errorMsg": ' + err + '}');
                }
                connection.release();
                resolve(200);
            });
            connection.on('error', function(err) {
                logger.debug('Error in connection database');
                connection.release();
                reject('{"error":"500","errorMsg": "Error in connection database"}');

            });
        });
    });
}


exports.addInterestIndustry = function(userID, industries) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('{"error":"500","errorMsg": "Error in connection database"}');
            }
            logger.debug('connected as id ' + connection.threadId);

            var sql = "INSERT INTO user_interests_industry (userID,indusrtyID) VALUES ? ON DUPLICATE KEY UPDATE userID=userID";
            var values = [];
            for (index = 0; index < industries.length; index++) {
                var v = [userID, industries[index]];
                values.push(v);
            }
            connection.query(sql, [values], function(err) {
                if (err) {
                    logger.debug('Error in connection database');
                    connection.release();
                    reject('{"error":"500","errorMsg": ' + err + '}');
                }
                connection.release();
                resolve(200);
            });
            connection.on('error', function(err) {
                logger.debug('Error in connection database');
                connection.release();
                reject('{"error":"500","errorMsg": "Error in connection database"}');

            });
        });
    });
}

exports.getJobFeatureList = function() {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('Error in connection database');
            }
            logger.debug('connected as id ' + connection.threadId);

            var sql = "SELECT id, name From jobfeature_desc ORDER BY name";

            logger.debug("getJobFeatureList: going to query jobfeature list: " + sql);
            connection.query(sql, function(err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        var result = '{"total":"' + rows.length + '","values":[';
                        var first = true;
                        for (i = 0; i < rows.length; i++) {
                            if (!first) {
                                result += ",";
                            }
                            first = false;
                            result += '{"id":"' + rows[i].id + '","name":"' + rows[i].name + '"}';
                        }
                        result += "]}"
                        connection.release();
                        resolve(result);

                    } else {
                        logger.debug("dbConn: unable to find jobfeature list.");
                        connection.release();
                        reject('{"error":"500", "errorMsg":"DB Error"}');

                    }
                } else {
                    logger.debug('Error in connection database');
                    connection.release();
                    reject('{"error":"500","errorMsg": ' + err + '}');
                }

            });
            connection.on('error', function(err) {
                logger.debug('Error in connection database');
                connection.release();
                reject('{"error":"500","errorMsg": "Error in connection database"}');

            });
        });
    });
}

exports.getHobbyList = function() {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('Error in connection database');
            }
            logger.debug('connected as id ' + connection.threadId);

            var sql = "SELECT * From hobby_desc ORDER BY name";

            logger.debug("getIndustryList: going to query hobby list: " + sql);
            connection.query(sql, function(err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        var dict = {};
                        for (i = 0; i < rows.length; i++) {
                            var hobby = '';
                            if (rows[i].group in dict) {
                                hobby = dict[rows[i].group] + ',';
                            }

                            dict[rows[i].group] = hobby + '{"id":"' + rows[i].id + '","name":"' + rows[i].name + '"}';
                        }
                        var result = '{"total":"' + rows.length + '","values":[';
                        var first = true;
                        for (var group in dict) {
                            if (!first) {
                                result += ",";
                            }
                            first = false;
                            result += '{"group":"' + group + '","values":[' + dict[group] + ']}';
                        }
                        result += "]}"
                        connection.release();
                        resolve(result);

                    } else {
                        logger.debug("dbConn: unable to find hobby list.");
                        connection.release();
                        reject('{"error":"500", "errorMsg":"DB Error"}');

                    }
                } else {
                    logger.debug('Error in connection database');
                    connection.release();
                    reject('{"error":"500","errorMsg": ' + err + '}');
                }

            });
            connection.on('error', function(err) {
                logger.debug('Error in connection database');
                connection.release();
                reject('{"error":"500","errorMsg": "Error in connection database"}');

            });
        });
    });
}


exports.getIndustryList = function() {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('Error in connection database');
            }
            logger.debug('connected as id ' + connection.threadId);

            var sql = "SELECT id, name From industry_desc ORDER BY name";

            logger.debug("getIndustryList: going to query industry list: " + sql);
            connection.query(sql, function(err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        var result = '{"total":"' + rows.length + '","values":[';
                        var first = true;
                        for (i = 0; i < rows.length; i++) {
                            if (!first) {
                                result += ",";
                            }
                            first = false;
                            result += '{"id":"' + rows[i].id + '","name":"' + rows[i].name + '"}';
                        }
                        result += "]}"
                        connection.release();
                        resolve(result);

                    } else {
                        logger.debug("dbConn: unable to find industry list.");
                        connection.release();
                        reject('{"error":"500", "errorMsg":"DB Error"}');

                    }
                } else {
                    logger.debug('Error in connection database');
                    connection.release();
                    reject('{"error":"500","errorMsg": ' + err + '}');
                }

            });
            connection.on('error', function(err) {
                logger.debug('Error in connection database');
                connection.release();
                reject('{"error":"500","errorMsg": "Error in connection database"}');

            });
        });
    });
}

exports.getUserInfo = function(userId) {

    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('Error in connection database');
            }
            logger.debug('connected as id ' + connection.threadId);

            var sql = "SELECT u.id, u.firstName, u.lastName, u.email, u.headline, u.profilePicO, u.linkedInProfile, i.`name` as industry From user_basic as u LEFT JOIN industry_desc as i on u.industry = i.id WHERE u.id =?";
            var inserts = [userId];
            sql = mysql.format(sql, inserts);

            logger.debug("getUserInfo: going to query user info: " + sql);
            connection.query(sql, function(err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        logger.debug("dbConn: found user: " + userId);
                        var result = '{"userId":"' + userId + '","firstName":"' + rows[0].firstName + '","lastName":"' + rows[0].lastName + '","headLine":"' + rows[0].headline + '","industry":"' + rows[0].industry + '","profilePic":"' + rows[0].profilePicO + '","linkedInProfile":"' + rows[0].linkedInProfile + '"}';
                        connection.release();
                        resolve(result);

                    } else {
                        logger.debug("dbConn: didnt find user: " + userId);
                        connection.release();
                        reject('{"error":"400", "errorMsg":"Invalid UserID"}');

                    }
                } else {
                    logger.debug('Error in connection database');
                    connection.release();
                    reject('{"error":"500","errorMsg": ' + err + '}');
                }

            });


            connection.on('error', function(err) {
                logger.debug('Error in connection database');
                connection.release();
                reject('{"error":"500","errorMsg": "Error in connection database"}');

            });
        });
    });

}


exports.getUserName = function(userId) {
    return new Promise(function(resolve, reject) {
        var sql = "SELECT * FROM ?? WHERE ?? = ?";
        var inserts = ['user_basic', 'id', userId];
        sql = mysql.format(sql, inserts);

        pool.query(sql, function(err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    logger.debug("dbConn: found user: " + userId);
                    // this needs to be changed later when we reformat the api of dbConn.js
                    var result = '{"id":"' + userId + '","firstName":"' + rows[0].firstName + '","lastName":"' + rows[0].lastName + '","profilePicSmall":"' + rows[0].profilePicS + '"}';
                    resolve(result);
                } else {
                    logger.debug("dbConn: didnt find user: " + userId);
                    reject('{"error":"400", "errorMsg":"Invalid UserID"}');
                }
            } else {
                logger.debug('Error in connection database');
                reject('{"error":"500","errorMsg": ' + err + '}');
            }
        });
    });
}



exports.createUserIfNotExist = function(obj, accessToken) {
    console.log('dbConn.createUserIfNotExist called ');
    return new Promise(function(resolve, reject) {

        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');
                reject('{"error":"500","errorMsg": "Error in connection database"}');
            }
            logger.debug('connected as id ' + connection.threadId);
            var sql = "SELECT * FROM ?? WHERE ?? = ?";
            var inserts = ['user_basic', 'linkedInID', obj.id];
            var query = mysql.format(sql, inserts);

            connection.query(query, function(err, rows) {
                var userId = '';
                if (rows.length > 0) {
                    userId += rows[0].id;
                    logger.debug("createUserIfNotExist: found user: " + userId);
                    resolve(userId);
                    return;
                }

                var industry = obj.industry;
                sql = "SELECT * FROM ?? WHERE ?? = ?";
                inserts = ['industry_desc', 'name', industry];
                query = mysql.format(sql, inserts);
                logger.debug("createUserIfNotExist: going to query industry: " + query);

                connection.query(query, function(err, rows2) {
                    logger.debug("createUserIfNotExist: inside the callback: " + err + " ... " + rows2);
                    if (!err) {
                        var industryId = 0; // hardcoded to not finding the industry. need to change later
                        if (rows2.length > 0) {
                            industryId += rows2[0].id;
                            logger.debug("createUserIfNotExist: found industryId: " + industryId);
                        }
                        logger.debug("createUserIfNotExist: going to create user ");
                        var firstName = obj.firstName;
                        if (firstName === undefined || firstName == 'undefined') {
                            firstName = '';
                        }
                        var lastName = obj.lastName;
                        if (lastName === undefined || lastName == 'undefined') {
                            lastName = '';
                        }
                        var email = obj.emailAddress;
                        var headline = obj.headline;
                        if (headline === undefined || headline == 'undefined') {
                            headline = '';
                        }
                        var profilePicS = obj.pictureUrl;
                        if (profilePicS === undefined || profilePicS == 'undefined') {
                            profilePicS = '';
                        }
                        var profilePicO = obj.pictureUrls;
                        if (profilePicO === undefined || profilePicO == 'undefined' || profilePicO._total == 0) {
                            profilePicO = '';
                        } else {
                            profilePicO = profilePicO.values[0];
                        }
                        var linkedInProfile = obj.publicProfileUrl;
                        if (linkedInProfile === undefined || linkedInProfile == 'undefined') {
                            linkedInProfile = '';
                        }
                        var linkedinID = obj.id;

                        var post = {
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            headline: headline,
                            profilePicS: profilePicS,
                            profilePicO: profilePicO,
                            industry: industryId,
                            linkedInProfile: linkedInProfile,
                            linkedinID: linkedinID,
                            LinkedInToken: accessToken
                        };

                        connection.query("INSERT INTO user_basic SET ?", post, function(err, result) {
                            logger.debug("createUserIfNotExist: inside the  insert callback: " + err + " ... " + result);

                            if (!err) {
                                userId = result.insertId;
                                logger.debug("createUserIfNotExist: created user: " + userId);
                                addPositions(userId, obj.positions, connection, resolve, reject);
                                // resolve(userId);
                                // return;
                            } else {
                                connection.release();
                                logger.debug('Error in connection database');
                                reject('{"error":"500","errorMsg": ' + err + '}');
                            }
                        });

                    } else {
                        connection.release();
                        logger.debug('Error in connection database');
                        reject('{"error":"500","errorMsg": ' + err + '}');
                    }

                });

            });

        });

    });

}

function addPositions(userId, positions, connection, resolve, reject) {
    if (positions === undefined || positions == "undefined" || positions._total == 0) {
        connection.release();
        return;
    }
    positions.values.forEach(function(obj) {
        logger.debug("going to add position " + obj.title);

        var endDateYear;
        var endDateMonth;
        if (obj.endDate === undefined || obj.endDate == 'undefined') {
            endDateYear = 0;
            endDateMonth = 0;
        } else {
            endDateYear = obj.endDate.year;
            endDateMonth = obj.endDate.month;
        }
        var sql = "CALL sp_add_position(?,?,?,?,?,?,?,?,?,?,?)";
        var inserts = [userId, obj.company.industry, obj.company.name, obj.company.size, obj.company.type, obj.isCurrent, obj.startDate.year, obj.startDate.month, endDateYear, endDateMonth, obj.title];
        var query = mysql.format(sql, inserts);

        logger.debug("addPositions: going to add position with query: " + query);

        connection.query(query, function(err, rows) {
            connection.release();
            logger.debug("addPositions: inside the callback: " + err + " ... " + rows);
            if (!err) {
                resolve(userId);
                return;
            } else {
                logger.debug("addPositions: err in adding position: " + err + " ... ");
                reject('{"error":"500","errorMsg": ' + err + '}');
                return;
            }
        });

    });

}