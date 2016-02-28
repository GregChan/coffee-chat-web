var mysql = require("mysql");
var Promise = require('promise');
var logger = require("../../../logger.js").getLogger();

var exports = module.exports = {};


var pool = mysql.createPool({
    connectionLimit: 1, //maximum connection for Azure student
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

exports.updateUserProfileForCommunity = function(userID, communityID, surveys) {
    return new Promise(function(resolve, reject) {
        // TODO: this query still allows for duplicate fields for dropdowns e.g. i can have two graduation years
        pool.getConnection(function(err, connection) {
            if (err) {
                logger.debug('DB connection error');
                logger.debug(err);
                reject({
                    'error': '500',
                    'message': 'DB Error'
                });
            } else {
                connection.beginTransaction(function(err) {

                    var sql = 'delete from user_survey where userID = ? and communityID = ?'

                    sql = mysql.format(sql, [userID, communityID]);

                    connection.query(sql, function(err, rows, fields) {
                        if (err) {
                            return connection.rollback(function() {
                                logger.debug('Error deleting old preferences');
                                reject({
                                    'error': '500',
                                    'message': 'DB Error'
                                });
                            });
                        }

                        var sql = "INSERT INTO user_survey (userID, communityID, fieldID, itemID) VALUES ? ON DUPLICATE KEY UPDATE userID=userID",
                            values = [];
                        for (var i = 0; i < surveys.length; i++) {
                            var fieldID = surveys[i].fieldID,
                                choices = surveys[i].choices;
                            if (fieldID && choices) {
                                for (var j = 0; j < choices.length; j++) {
                                    var value = [userID, communityID, fieldID, choices[j]];
                                    values.push(value);
                                }
                            }
                        }

                        if (values.length <= 0) {
                            return connection.rollback(function() {
                                logger.debug('No values submitted with form');
                                reject({
                                    'error': '500',
                                    'message': 'No values submitted with the form'
                                });
                            });
                        }

                        sql = mysql.format(sql, [values]);
                        connection.query(sql, function(err, rows, fields) {
                            if (err) {
                                return connection.rollback(function() {
                                    logger.debug('Error in connection or query:');
                                    logger.debug(err);

                                    reject({
                                        'error': '500',
                                        'message': 'DB Error'
                                    });
                                });
                            } else {
                                logger.debug('updateUserProfileForCommunity for ' + userID);
                                resolve({
                                    'success': '200'
                                });
                            }
                        });
                    });
                });
            }

            connection.release();
        });
    });
}

exports.getUserProfileForCommunity = function(userID, communityID) {
    return new Promise(function(resolve, reject) {
        var sql = 'select b.displayPriority, a.fieldID, a.userID, a.itemID, b.fieldName, b.communityID, b.required, b.displayType, b.macthPriority, c.name, b.grouped, c.group, c.id from user_survey as a left join survey_field_desc as b on a.fieldID=b.fieldID left join survey_field_items as c on a.itemID = c.id where userID=? and a.communityID=? order by b.displayPriority, a.fieldID, c.group';

        // var sql = 'select a.fieldID, a.fieldName, a.communityID, a.required, a. displayPriority, a.displayType, a.grouped, b.id, b.group, b.name, c.itemID from survey_field_desc as a inner join survey_field_items as b left join user_survey as c on c.itemID = b.id where c.userID = ? and a.communityID = ? and a.fieldID = b.fieldID ORDER BY a.displayPriority, a.fieldID, b.group, b.name';
        sql = mysql.format(sql, [userID, communityID]);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {
                logger.debug('getSurveyData for ' + userID + ' with community ' + communityID);

                if (rows.length > 0) {
                    var result = {};
                    result["community"] = communityID;
                    result["fields"] = [];

                    var fieldID = -1;
                    var field;
                    var groupName;
                    var hasGroup = false;
                    var group;

                    for (var i = 0; i < rows.length; i++) {
                        if (fieldID != rows[i].fieldID) {
                            if (fieldID != -1) {
                                if (hasGroup) {
                                    field["values"].push(group);
                                    hasGroup = false;
                                }
                                result["fields"].push(field);
                            }
                            fieldID = rows[i].fieldID;
                            field = {};
                            field["fieldID"] = fieldID;
                            field["name"] = rows[i].fieldName;
                            field["className"] = rows[i].fieldName.split(' ').join('-').toLowerCase();
                            field["required"] = rows[i].required == 0 ? false : true;
                            field["grouped"] = rows[i].grouped == 0 ? false : true;
                            field["priority"] = rows[i].displayPriority;
                            field["displayType"] = rows[i].displayType;
                            field["values"] = [];
                        }

                        if (rows[i].grouped == 0) {
                            if (hasGroup) {
                                field["values"].push(group);
                                hasGroup = false;
                            }

                            field["values"].push({
                                id: rows[i].id,
                                name: rows[i].name
                            });
                        } else {
                            if (hasGroup) {
                                if (groupName != rows[i].group) {
                                    field["values"].push(group);
                                    groupName = rows[i].group;
                                    group = {}
                                    group["name"] = groupName;
                                    group["values"] = [];
                                }
                            } else {
                                groupName = rows[i].group;
                                group = {}
                                group["name"] = groupName;
                                group["values"] = [];
                                hasGroup = true;
                            }

                            group["values"].push({
                                id: rows[i].id,
                                name: rows[i].name
                            });
                        }

                        if (i == rows.length - 1) {
                            if (hasGroup) {
                                field["values"].push(group);
                            }
                            result["fields"].push(field);
                        }
                    }

                    resolve(result);
                } else {
                    logger.debug('dbConn: no records found');
                    resolve({});
                }
            }
        });
    });
}

exports.getCommunityProfileSurvey = function(communityID) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('Error in connection database');
            }
            logger.debug('connected as id ' + connection.threadId);

            var sql = "SELECT  a.fieldID, a.fieldName, a.communityID, a.required, a. displayPriority, a.displayType, a.grouped, b.id, b.group, b.name from survey_field_desc as a inner join survey_field_items as b Where a.communityID = ? and a.fieldID = b.fieldID ORDER BY a.displayPriority, a.fieldID, b.group, b.name";
            var inserts = [communityID];
            sql = mysql.format(sql, inserts);
            logger.debug("getIndustryList: going to query survey list: " + sql);
            connection.query(sql, function(err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        var result = {};
                        result["community"] = communityID;
                        result["fields"] = [];
                        var fieldID = -1;
                        var field;
                        var groupName;
                        var hasGroup = false;
                        var group;
                        for (var i = 0; i < rows.length; i++) {
                            if (fieldID != rows[i].fieldID) {
                                if (fieldID != -1) {
                                    if (hasGroup) {
                                        field["values"].push(group);
                                        hasGroup = false;
                                    }
                                    result["fields"].push(field);
                                }
                                fieldID = rows[i].fieldID;
                                field = {};
                                field["fieldID"] = fieldID;
                                field["name"] = rows[i].fieldName;
                                field["className"] = rows[i].fieldName.split(' ').join('-').toLowerCase();
                                field["required"] = rows[i].required == 0 ? false : true;
                                field["grouped"] = rows[i].grouped == 0 ? false : true;
                                field["priority"] = rows[i].displayPriority;
                                field["displayType"] = rows[i].displayType;
                                field["values"] = [];
                            }
                            if (rows[i].grouped == 0) {
                                if (hasGroup) {
                                    field["values"].push(group);
                                    hasGroup = false;
                                }
                                field["values"].push(JSON.parse('{"id":' + rows[i].id + ', "name":"' + rows[i].name + '"}'));
                            } else {
                                if (hasGroup) {
                                    if (groupName != rows[i].group) {
                                        field["values"].push(group);
                                        groupName = rows[i].group;
                                        group = {};
                                        group["name"] = groupName;
                                        group["values"] = [];
                                    }
                                } else {
                                    groupName = rows[i].group;
                                    group = {};
                                    group["name"] = groupName;
                                    group["values"] = [];
                                    hasGroup = true;
                                }
                                group["values"].push(JSON.parse('{"id":' + rows[i].id + ', "name":"' + rows[i].name + '"}'));

                            }

                            if (i == rows.length - 1) {
                                if (hasGroup) {
                                    field["values"].push(group);
                                }
                                result["fields"].push(field);
                            }
                        }

                        console.log("getCommunityProfileSurvey: result: " + result);
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

exports.getUser = function(userId) {
    return new Promise(function(resolve, reject) {
        var sql = "SELECT u.id, u.firstName, u.lastName, u.email, u.headline, u.profilePicO, u.linkedInProfile, i.`name` as industry From user_basic as u LEFT JOIN industry_desc as i on u.industry = i.id WHERE u.id =?";
        sql = mysql.format(sql, [userId]);
        pool.query(sql, function(err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    logger.debug("dbConn: found user: " + userId);
                    var result = {
                        userId: userId,
                        firstName: rows[0].firstName,
                        lastName: rows[0].lastName,
                        email: rows[0].email,
                        headLine: rows[0].headline,
                        linkedInProfile: rows[0].linkedInProfile,
                        profilePic: rows[0].profilePicO
                    };
                    resolve(result);
                } else {
                    logger.debug("dbConn: didnt find user: " + userId);
                    reject('{"error":"400", "errorMsg":"Invalid UserID"}');
                }
            } else {
                logger.debug('Error in connection database');
                logger.debug(err);
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
                    connection.release();
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