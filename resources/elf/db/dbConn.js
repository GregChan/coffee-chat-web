var mysql = require("mysql");
var Promise = require('promise');
var logger = require("../../../logger.js").getLogger();
var async = require('async');
var md5 = require('MD5');

var exports = module.exports = {};


var pool = mysql.createPool({
    connectionLimit: 1, //maximum connection for Azure student
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_COFFEE_CHAT
});

var getValueFromRating = function(str) {
    var value = 0;
    if (str == 'Very Poor') {
        value = 1;
    } else if (str == 'Poor') {
        value = 2;
    } else if (str == 'OK') {
        value = 3;
    } else if (str == 'Good') {
        value = 4;
    } else if (str == 'Very Poor') {
        value = 5;
    }
    return value;
}

exports.clearup = function() {
    logger.debug('Going to release DB connection pool');
    pool.end(function(err) { //release all connections
        logger.debug('Error in release pool ' + err);
    });
}

exports.logError = function(obj) {
    try{
        if (obj.type === undefined || obj.type == '' || obj.data === undefined ) {
             return;
        }
        var sql = 'insert into log_error (type, errorData) values (?, ?)';
       
        sql = mysql.format(sql, [obj.type,obj.data]);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query to record error '+ obj.type +', '+obj.data);
            } 
        });
    }
    catch(err)
    {
        logger.debug('Error in connection or query to record error '+ err);
    }
}

exports.createUser = function(obj) {
    return new Promise(function(resolve, reject) {
        if (obj.firstName === undefined || obj.firstName == '' || obj.lastName === undefined || obj.lastName == ''|| obj.email === undefined || obj.email == ''|| obj.password === undefined || obj.password == '') {
             reject({
                    error: '400',
                    message: 'Invalid request with missing parameter(s)'
             });
             return;
        }
        var sql = 'insert into user_basic (firstName, lastName, email, headline, profilePicS, profilePicO, password) values (?, ?, ?, ?, ?, ?, ?)';
        var headline="";
        var profilePicS="";
        var profilePicO="";
        if (obj.headline !== undefined ) {
            headline= obj.headline;
        }
        if (obj.profilePicS !== undefined ) {
            headline= obj.profilePicS;
        }
        if (obj.profilePicO !== undefined ) {
            headline= obj.profilePicO;
        }
        sql = mysql.format(sql, [obj.firstName,obj.lastName,obj.email,headline,profilePicS,profilePicO,md5(obj.password)]);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {
                logger.debug('inserted new user ' + obj.email);
                resolve({
                    'userID': rows.insertId
                });
            }
        });
    })
}


exports.validatePassword = function(email, pw)
{
    return new Promise(function(resolve, reject) {
        var sql = 'select id, password from user_basic where email = ?';
        sql = mysql.format(sql, [email]);
        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query, in getMatch function');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {
                if (rows.length > 0) {
                    console.log('pw from db' + rows[0].password);
                    console.log('pw from user ' + md5(pw));
                    if( rows[0].password == md5(pw))
                    {
                        resolve({
                            userID: rows[0].id
                        });
                        return;
                    }
                }        
                reject({
                    error: '401',
                    message: 'not valid user.'
                });
                
            }
        });
    });
}

exports.generateRandMatch = function(userID, communityID) {
    return new Promise(function(resolve, reject) {

        var sql = 'SELECT * FROM user_community where userID =? and communityID = ?';

        sql = mysql.format(sql, [userID, communityID]);

        console.log('generateRandMatch: going to query db with sql: ' + sql);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                console.log(err);
                logger.debug('Error in connection or query');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {

                if (rows.length < 1) {
                    reject({
                        error: '401',
                        message: 'invalid userID'
                    });
                    return;
                }


                sql = 'SELECT * FROM coffeechat.user_match Where communityID = ? and ((userA = ? and userAStatus < 3) or (userB = ? and userBStatus < 3) ) order by create_at';

                sql = mysql.format(sql, [communityID, userID, userID]);

                console.log('generateRandMatch: going to query db with sql: ' + sql);

                pool.query(sql, function(err, rows, fields) {
                    if (err) {
                        console.log(err);
                        logger.debug('Error in connection or query');
                        reject({
                            error: '500',
                            message: 'DB error'
                        });
                    } else {
                        if (rows.length > 0) {
                            reject({
                                error: '401',
                                message: userID + ' has already been matched!'
                            });
                            return;
                        }

                        sql = 'SELECT userID from user_community as c ' + 'where communityID=? ' + 'AND userid!=? ' + 'AND not exists ( ' + 'select * from user_match as m ' + 'where (m.userA = ? and m.userB = c.userID ) ' + 'or (m.userB = ? and m.userA = c.userID) ' + 'or (m.userA = c.userID and m.userAStatus < 3) ' + 'or (m.userB = c.userID and m.userBStatus < 3)) ' + 'order by rand() ' + 'limit 1';

                        sql = mysql.format(sql, [communityID, userID, userID, userID]);

                        console.log('generateRandMatch: going to query db with sql: ' + sql);
                        pool.query(sql, function(err, rows, fields) {
                            if (err) {
                                console.log(err);
                                logger.debug('Error in connection or query');
                                reject({
                                    error: '500',
                                    message: 'DB error'
                                });
                            } else {
                                if (rows.length < 1) {
                                    resolve({
                                        message: 'There is currently no match available for ' + userID + '.'
                                    });
                                    return;
                                }

                                console.log("row length: " + rows.length);
                                var uid = rows[0].userID;

                                sql = "INSERT INTO user_match (userA, userB, communityID) VALUES ( ?, ? ,?) ";

                                values = [userID, uid, communityID];

                                sql = mysql.format(sql, values);
                                console.log('generateRandMatch: going to insert with sql: ' + sql);
                                pool.query(sql, function(err, rows, fields) {
                                    if (err) {
                                        logger.debug('Error in connection or query:');
                                        logger.debug(err);
                                        reject({
                                            'error': 500,
                                            'message': 'DB Error'
                                        });
                                    } else {
                                        if (rows.affectedRows > 0) {
                                            resolve({
                                                'matchID': rows.insertId,
                                                'userID': uid

                                            });
                                        } else {
                                            reject({
                                                'error': 500,
                                                'message': 'unable to create random match for user ' + userID + ' .'
                                            });
                                        }

                                    }
                                });
                            }

                        });
                    }
                });
            }
        });
    });
}

exports.getMatch = function(matchId) {
    return new Promise(function(resolve, reject) {
        var sql = 'select id, userA, userB, communityID, userAStatus, userBStatus, create_at from user_match where id = ?';
        sql = mysql.format(sql, [matchId]);
        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query, in getMatch function');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {
                if (rows.length > 0) {
                    resolve({
                        id: rows[0].id,
                        userA: rows[0].userA,
                        userB: rows[0].userB,
                        communityID: rows[0].communityID,
                        created: rows[0].create_at
                    });
                } else {
                    reject({
                        error: '404',
                        message: 'Record not found'
                    });
                }
            }
        });
    });
}

exports.createCommunity = function(data) {
    return new Promise(function(resolve, reject) {
        var sql = 'insert into community_desc (name, adminUserID, communityCode) values (?, ?, ?)';
        sql = mysql.format(sql, [data.name, 481, data.name]);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {
                logger.debug('inserted new community ' + data.name);
                resolve({
                    'success': '200'
                });
            }
        });
    })
}

exports.insertUserIntoCommunity = function(data) {
    console.log(data);
    return new Promise(function(resolve, reject) {
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

                    var sql = 'select id from community_desc where communityCode = ?';

                    sql = mysql.format(sql, [data.communityCode]);

                    connection.query(sql, function(err, rows, fields) {
                        if (err) {
                            return connection.rollback(function() {
                                logger.debug('Error getting communityCode');
                                reject({
                                    'error': 500,
                                    'message': 'DB Error'
                                });
                            });
                        }

                        if (rows.length > 0) {
                            var communityID = rows[0].id;
                            var sql = 'insert into user_community (userID, communityID) values (?, ?)';
                            sql = mysql.format(sql, [data.userID, communityID]);

                            pool.query(sql, function(err, rows, fields) {
                                if (err) {
                                    logger.debug('Error in connection or query');
                                    reject({
                                        error: '500',
                                        message: 'DB error'
                                    });
                                } else {
                                    logger.debug('inserted new user ' + data.userID + ' into ' + data.communityID);
                                    connection.commit(function(err) {
                                        if (err) {
                                            connection.rollback(function() {
                                                reject({
                                                    'error': 500,
                                                    'message': 'db error.'
                                                });
                                            });
                                        }

                                        resolve({
                                            'success': '200'
                                        });
                                    });
                                }
                            });
                        } else {
                            reject({
                                error: 404,
                                message: 'Community code not found'
                            });
                        }
                    });
                });

                connection.release();
            }
        });
    });
}

exports.insertUserIntoGroup = function(communityID, groupID, data) {
    /* Description:
     * inserts a user into a group
     * 
     * Parameters:
     * groupID : int
     *     id for a group
     * data : object
     *     object containing userID
     */

    // TODO: check if the group is in the community before inserting 
    return new Promise(function(resolve, reject) {
        var sql = 'insert into user_group (groupID, userID) values (?, ?)';
        var p = data.private || 1;
        sql = mysql.format(sql, [groupID, data.userID]);

        console.log(sql);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {
                logger.debug('inserted new group in ' + communityID);
                resolve({
                    'success': '200'
                });
            }
        });
    });
}

exports.deleteCommunityGroup = function(communityID, data) {
    /* Description:
     * deletes a group from a community
     * 
     * Parameters:
     * communityID : int
     *     id for a community
     * data : object
     *     object containing group id
     */

    return new Promise(function(resolve, reject) {
        var sql = 'update community_group set deleted = 1 where communityID = ? and id = ?';
        var p = data.private || 1;
        sql = mysql.format(sql, [communityID, data.id]);

        console.log(sql);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {
                logger.debug('inserted new group in ' + communityID);
                resolve({
                    'success': '200'
                });
            }
        });
    });
}

exports.updateCommunityGroup = function(communityID, data) {
    /* Description:
     * creates a new group
     * 
     * Parameters:
     * communityID : int
     *     id for a community
     * data : object
     *     object containing group name
     */

    return new Promise(function(resolve, reject) {
        var sql = 'insert into community_group (communityID, name, private) values (?, ?, ?)';
        var p = data.private || 1;
        sql = mysql.format(sql, [communityID, data.name, p]);

        console.log(sql);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {
                logger.debug('inserted new group in ' + communityID);
                resolve({
                    'success': '200'
                });
            }
        });
    });
}

exports.getCommunityGroups = function(communityID) {
    /* Description:
     * returns a list of groups for a community 
     *
     * Parameters:
     * communityID : int
     *     id for a community
     */

    return new Promise(function(resolve, reject) {
        var sql = 'select id, communityID, name, created from community_group where communityID = ? and deleted = 0';
        sql = mysql.format(sql, [communityID]);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('DB connection error');
                logger.debug(err);
                reject({
                    'error': '500',
                    'message': 'DB Error'
                });
                return;
            }

            var groups = [];

            for (var i = 0; i < rows.length; i++) {
                groups.push({
                    groupID: rows[i].id,
                    groupName: rows[i].name
                });
            }

            resolve(groups);
        });
    });
}

exports.getCommunityGroupUsers = function(communityID, groupID) {
    /* Description:
     * returns a list of users in a group for a community
     *
     * Parameters:
     * communityID : int
     *     id for a community
     * groupID : int
     *     id for a group
     */

    return new Promise(function(resolve, reject) {
        var sql = 'select ub.id, ub.firstName, ub.lastName, ub.profilePicO, ub.headline, cg.name as groupName, ug.created, ug.groupID from user_basic as ub left join user_group as ug on ub.id = ug.userID left join community_group as cg on cg.id = ug.groupID  where ug.groupID = ? and cg.communityID = ? and cg.deleted = 0';

        sql = mysql.format(sql, [groupID, communityID]);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('DB connection error');
                logger.debug(err);
                reject({
                    'error': '500',
                    'message': 'DB Error'
                });
                return;
            }

            var users = [];

            for (var i = 0; i < rows.length; i++) {
                users.push({
                    id: rows[i].id,
                    firstName: rows[i].firstName,
                    lastName: rows[i].lastName,
                    profilePic: rows[i].profilePicO,
                    headLine: rows[i].headline,
                    dateAdded: rows[i].created
                });
            }

            if (rows.length > 0) {
                resolve({
                    groupName: rows[0].groupName,
                    groupID: rows[0].groupID,
                    users: users
                });
            } else {
                resolve({});
            }
        });
    });
}

exports.getUserAnalytics = function(userID, communityID) {
    /* Description:
     * returns basic analytics for a user with information about matches
     *
     * Parameters:
     * userID : int
     *     id for a user
     */

    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                logger.debug('DB connection error');
                logger.debug(err);
                reject({
                    'error': '500',
                    'message': 'DB Error'
                });
            } else {
                // all users in accepted or feedback state
                var sql = 'select id from user_match where (userA = ? or userB = ?) and ((userAStatus = 2 and userBStatus = 2) or (userAStatus = 4 or userBStatus = 4)) and communityID = ?';
                sql = mysql.format(sql, [userID, userID, communityID]);

                connection.query(sql, function(err, rows, fields) {
                    if (err) {
                        logger.debug('Error in connection database');
                        reject({
                            error: 500,
                            msg: 'Query error'
                        });
                        return;
                    }

                    var totalConnections = rows.length;

                    // get all ratings submitted by users to compute the average this is a hack
                    var sql = 'select name from user_match_feedback as umf left join match_feedback_field_items as mffi on umf.itemID = mffi.id where umf.userID = ? and umf.communityID = ? and umf.fieldID = 1';
                    sql = mysql.format(sql, [userID, communityID]);

                    connection.query(sql, function(err, rows, fields) {
                        if (err) {
                            logger.debug('Error in connection database');
                            reject({
                                error: 500,
                                msg: 'Query error'
                            });
                            return;
                        }

                        var averageRating = 0;

                        console.log(rows.length);

                        if (rows.length > 0) {
                            var ratingSum = 0;

                            for (var i = 0; i < rows.length; i++) {
                                // this is also a hack
                                ratingSum += getValueFromRating(rows[i].name);
                            }

                            averageRating = ratingSum / rows.length;
                        }

                        var sql = 'select name, id from community_group where communityID = ? and private = 0';
                        sql = mysql.format(sql, [communityID]);

                        connection.query(sql, function(err, rows, fields) {
                            if (err) {
                                logger.debug('Error in connection database');
                                reject({
                                    error: 500,
                                    msg: 'Query error'
                                });
                                return;
                            }

                            var calls = [];

                            for (var i = 0; i < rows.length; i++) {
                                calls.push((function(index) {
                                    return function(cb) {
                                        var sql = 'select name from user_match_feedback as umf left join match_feedback_field_items as mffi on umf.itemID = mffi.id left join user_group as ug on ug.userID = umf.userID where umf.communityID = ? and ug.userID = ? and umf.fieldID = 1 and ug.groupID = ?';
                                        sql = mysql.format(sql, [communityID, userID, rows[index].id]);

                                        connection.query(sql, function(err, rs, fields) {
                                            if (err) {
                                                logger.debug('Error in connection database');
                                                reject({
                                                    error: 500,
                                                    msg: 'Query error'
                                                });
                                                cb(err, null);
                                                return;
                                            }

                                            var averageRating = 0;

                                            if (rs.length > 0) {
                                                var ratingSum = 0;

                                                for (var j = 0; j < rs.length; j++) {
                                                    // this is also a hack
                                                    ratingSum += getValueFromRating(rs[j].name);
                                                }

                                                averageRating = ratingSum / rs.length;
                                            }

                                            cb(null, {
                                                type: 0,
                                                groupID: rows[index].id,
                                                groupName: rows[index].name,
                                                value: averageRating
                                            });
                                        });
                                    }
                                })(i));

                                calls.push((function(index) {
                                    return function(cb) {
                                        var sql = 'select distinct id from ((select userA, userB, id from user_match where ((userAStatus = 2 and userBStatus = 2) or (userAStatus = 4 or userBStatus = 4)) and communityID = ?) as um left join (select userID from user_group where groupID = ?) as ug on ug.userID = ? and ug.userID = um.userA or ug.userID = um.userB) where userID is not null';
                                        sql = mysql.format(sql, [communityID, rows[index].id, userID]);

                                        connection.query(sql, function(err, rs, fields) {
                                            if (err) {
                                                logger.debug('Error in connection database');
                                                reject({
                                                    error: 500,
                                                    msg: 'Query error'
                                                });
                                                cb(err, null);
                                                return;
                                            }

                                            cb(null, {
                                                type: 1,
                                                groupID: rows[index].id,
                                                groupName: rows[index].name,
                                                value: rs.length
                                            });
                                        });
                                    }
                                })(i));
                            }

                            async.parallel(calls,
                                function(err, results) {
                                    var groupMap = {};

                                    for (var i = 0; i < results.length; i++) {
                                        if (!(results[i].groupID in groupMap)) {
                                            groupMap[results[i].groupID] = {
                                                groupName: results[i].groupName
                                            };
                                        }

                                        var key = null;
                                        if (results[i].type == 0) {
                                            key = 'avgRating';
                                        } else if (results[i].type == 1) {
                                            key = 'totalConnections';
                                        }

                                        if (key != null) {
                                            groupMap[results[i].groupID][key] = results[i].value;
                                        }
                                    }
                                    var groups = [];
                                    var keys = Object.keys(groupMap);
                                    for (var i = 0; i < keys.length; i++) {
                                        groups.push(groupMap[keys[i]]);
                                    }

                                    resolve({
                                        community: communityID,
                                        user: userID,
                                        totalConnections: totalConnections,
                                        avgRating: averageRating,
                                        groups: groups
                                    });
                                });
                        });
                    });
                });

                connection.release();
            }
        });
    });
}

exports.getCommunityAnalytics = function(communityID) {
    /* Description:
     * returns basic analytics for a community with information about users and groups
     *
     * Parameters:
     * communityID : int
     *     id for a community
     */

    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                logger.debug('DB connection error');
                logger.debug(err);
                reject({
                    'error': '500',
                    'message': 'DB Error'
                });
            } else {
                // all users in accepted or feedback state
                var sql = 'select id from user_match where ((userAStatus = 2 and userBStatus = 2) or (userAStatus = 4 or userBStatus = 4)) and communityID = ?';
                sql = mysql.format(sql, [communityID]);

                connection.query(sql, function(err, rows, fields) {
                    if (err) {
                        logger.debug('Error in connection database');
                        reject({
                            error: 500,
                            msg: 'Query error'
                        });
                        return;
                    }

                    var totalConnections = rows.length;

                    // get all ratings submitted by users to compute the average this is a hack
                    var sql = 'select name from user_match_feedback as umf left join match_feedback_field_items as mffi on umf.itemID = mffi.id where umf.communityID = ? and umf.fieldID = 1';
                    sql = mysql.format(sql, [communityID]);

                    connection.query(sql, function(err, rows, fields) {
                        if (err) {
                            logger.debug('Error in connection database');
                            reject({
                                error: 500,
                                msg: 'Query error'
                            });
                            return;
                        }

                        var averageRating = 0;

                        console.log(rows.length);

                        if (rows.length > 0) {
                            var ratingSum = 0;

                            for (var i = 0; i < rows.length; i++) {
                                // this is also a hack
                                ratingSum += getValueFromRating(rows[i].name);
                            }

                            averageRating = ratingSum / rows.length;
                        }

                        var sql = 'select name, id from community_group where communityID = ?';
                        sql = mysql.format(sql, [communityID]);

                        connection.query(sql, function(err, rows, fields) {
                            if (err) {
                                logger.debug('Error in connection database');
                                reject({
                                    error: 500,
                                    msg: 'Query error'
                                });
                                return;
                            }

                            var calls = [];

                            for (var i = 0; i < rows.length; i++) {
                                calls.push((function(index) {
                                    return function(cb) {
                                        var sql = 'select name from user_match_feedback as umf left join match_feedback_field_items as mffi on umf.itemID = mffi.id left join user_group as ug on  ug.userID = umf.userID  where umf.communityID = ? and umf.fieldID = 1 and ug.groupID = ?';
                                        sql = mysql.format(sql, [communityID, rows[index].id]);

                                        connection.query(sql, function(err, rs, fields) {
                                            if (err) {
                                                logger.debug('Error in connection database');
                                                reject({
                                                    error: 500,
                                                    msg: 'Query error'
                                                });
                                                cb(err, null);
                                                return;
                                            }

                                            var averageRating = 0;

                                            if (rs.length > 0) {
                                                var ratingSum = 0;

                                                for (var j = 0; j < rs.length; j++) {
                                                    // this is also a hack
                                                    ratingSum += getValueFromRating(rs[j].name);
                                                }

                                                averageRating = ratingSum / rs.length;
                                            }

                                            cb(null, {
                                                type: 0,
                                                groupID: rows[index].id,
                                                groupName: rows[index].name,
                                                value: averageRating
                                            });
                                        });
                                    }
                                })(i));

                                calls.push((function(index) {
                                    return function(cb) {
                                        var sql = 'select distinct id from ((select userA, userB, id from user_match where ((userAStatus = 2 and userBStatus = 2) or (userAStatus = 4 or userBStatus = 4)) and communityID = ?) as um left join (select userID from user_group where groupID = ?) as ug on ug.userID = um.userA or ug.userID = um.userB) where userID is not null';
                                        sql = mysql.format(sql, [communityID, rows[index].id]);

                                        connection.query(sql, function(err, rs, fields) {
                                            if (err) {
                                                logger.debug('Error in connection database');
                                                reject({
                                                    error: 500,
                                                    msg: 'Query error'
                                                });
                                                cb(err, null);
                                                return;
                                            }

                                            cb(null, {
                                                type: 1,
                                                groupID: rows[index].id,
                                                groupName: rows[index].name,
                                                value: rs.length
                                            });
                                        });
                                    }
                                })(i));
                            }

                            async.parallel(calls,
                                function(err, results) {
                                    var groupMap = {};

                                    for (var i = 0; i < results.length; i++) {
                                        if (!(results[i].groupID in groupMap)) {
                                            groupMap[results[i].groupID] = {
                                                groupName: results[i].groupName
                                            };
                                        }

                                        var key = null;
                                        if (results[i].type == 0) {
                                            key = 'avgRating';
                                        } else if (results[i].type == 1) {
                                            key = 'totalConnections';
                                        }

                                        if (key != null) {
                                            groupMap[results[i].groupID][key] = results[i].value;
                                        }
                                    }
                                    var groups = [];
                                    var keys = Object.keys(groupMap);
                                    for (var i = 0; i < keys.length; i++) {
                                        groups.push(groupMap[keys[i]]);
                                    }

                                    resolve({
                                        community: communityID,
                                        totalConnections: totalConnections,
                                        avgRating: averageRating,
                                        groups: groups
                                    });
                                });
                        });
                    });
                });

                connection.release();
            }
        });
    });
}

exports.updateGroupUser = function(communityID, groupID, data) {
    /* Description:
     * deletes a user from a group
     *
     * Parameters:
     * communityID : int
     *     id for a community
     * groupID : int
     *     id for a group
     * data : object
     *      object containing the userID
     */

    return new Promise(function(resolve, reject) {
        return new Promise(function(resolve, reject) {
            // insert a user into a group only if that group is in the community
            var sql = 'insert into user_group (userID, groupID) select r.userID, r.id from (select uc.userID, cg.id from (select * from user_community where communityID = ? and userID = ?) as uc left join (select * from community_group where communityID = ? and id = ?) as cg on cg.communityID = uc.communityID where uc.userID is not null and cg.id is not null) as r;';
            sql = mysql.format(sql, [community, data.userID, communityID, groupID]);

            pool.query(sql, function(err, rows, feilds) {
                if (err) {
                    logger.debug('Error in connection or query');
                    reject({
                        error: '500',
                        message: 'DB error'
                    });
                } else {
                    logger.debug('inserted new user in group with id ' + communityID);
                    resolve({
                        'success': '200'
                    });
                }
            });
        });
    });
}


exports.deleteGroupUser = function(communityID, groupID, postData) {
    /* Description:
     * deletes a user from a group
     *
     * Parameters:
     * communityID : int
     *     id for a community
     * groupID : int
     *     id for a group
     * postData : object
     *      object containing the userID
     */

    return new Promise(function(resolve, reject) {
        var sql = '';
    });
}

exports.getUserFeedbackForMatch = function(userID, communityID, matchID) {
    return new Promise(function(resolve, reject) {
        var sql = 'select b.displayPriority, a.fieldID, a.userID, a.itemID, b.fieldName, b.communityID, b.required, b.displayType, c.name,  c.id ' + 'from user_match_feedback as a ' + 'left join match_feedback_field_desc as b on a.fieldID=b.fieldID ' + 'left join match_feedback_field_items as c on a.itemID = c.id ' + 'where userID=? and a.communityID=? and a.matchID=? ' + 'and b.deleted=0  and c.deleted=0 ' + 'order by b.displayPriority, a.fieldID ';

        // var sql = 'select a.fieldID, a.fieldName, a.communityID, a.required, a. displayPriority, a.displayType, a.grouped, b.id, b.group, b.name, c.itemID from survey_field_desc as a inner join survey_field_items as b left join user_survey as c on c.itemID = b.id where c.userID = ? and a.communityID = ? and a.fieldID = b.fieldID ORDER BY a.displayPriority, a.fieldID, b.group, b.name';
        sql = mysql.format(sql, [userID, communityID, matchID]);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {

                if (rows.length > 0) {
                    var result = {};
                    result["community"] = communityID;
                    result["fields"] = [];
                    var fieldID = -1;
                    var field;
                    for (var i = 0; i < rows.length; i++) {
                        if (fieldID != rows[i].fieldID) {
                            if (fieldID != -1) {
                                result["fields"].push(field);
                            }
                            fieldID = rows[i].fieldID;
                            field = {};
                            field["fieldID"] = fieldID;
                            field["name"] = rows[i].fieldName;
                            field["className"] = rows[i].fieldName.split(' ').join('-').toLowerCase();
                            field["required"] = rows[i].required == 0 ? false : true;
                            field["grouped"] = false;
                            field["priority"] = rows[i].displayPriority;
                            field["displayType"] = rows[i].displayType;
                            field["values"] = [];
                        }
                        field["values"].push({
                            id: rows[i].id,
                            name: rows[i].name
                        });
                        if (i == rows.length - 1) {
                            result["fields"].push(field);
                        }
                    }

                    console.log("getCommunityFeedback: result: " + result);
                    resolve(result);
                } else {
                    logger.debug('dbConn: no records found');
                    resolve({});
                }
            }
        });
    });
}

exports.updateUserFeedbackForMatch = function(userID, communityID, matchID, match) {
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

                    var sql = 'delete from user_match_feedback where userID = ? and communityID = ? and matchID = ?'

                    sql = mysql.format(sql, [userID, communityID, matchID]);

                    connection.query(sql, function(err, rows, fields) {
                        if (err) {
                            return connection.rollback(function() {
                                logger.debug('Error deleting old preferences');
                                reject({
                                    'error': 500,
                                    'message': 'DB Error'
                                });
                            });
                        }

                        var sql = "INSERT INTO user_match_feedback (userID, matchID, communityID, fieldID, itemID) VALUES ? ON DUPLICATE KEY UPDATE userID=userID",
                            values = [];
                        for (var i = 0; i < match.length; i++) {
                            var fieldID = match[i].fieldID,
                                choices = match[i].choices;

                            if (fieldID && choices) {
                                for (var j = 0; j < choices.length; j++) {
                                    var value = [userID, matchID, communityID, fieldID, choices[j]];
                                    values.push(value);
                                }
                            }
                        }
                        console.log("updateUserFeedbackForMatch: values: " + values);
                        if (values.length <= 0) {
                            return connection.rollback(function() {
                                logger.debug('No values submitted with form');
                                reject({
                                    'error': 400,
                                    'message': 'No values submitted with the form'
                                });
                            });
                        }

                        sql = mysql.format(sql, [values]);
                        console.log("updateUserFeedbackForMatch: going to insert with sql : " + sql);
                        connection.query(sql, function(err, rows, fields) {
                            if (err) {
                                return connection.rollback(function() {
                                    logger.debug('Error in connection or query:');
                                    logger.debug(err);

                                    reject({
                                        'error': 500,
                                        'message': 'DB Error'
                                    });
                                });
                            } else {
                                if (rows.affectedRows > 0) {
                                    console.log("updateUserFeedbackForMatch: affectedRows > 0 ");
                                    connection.commit(function(err) {
                                        if (err) {
                                            connection.rollback(function() {
                                                reject({
                                                    'error': 500,
                                                    'message': 'db error.'
                                                });
                                            });
                                        }
                                        resolve({
                                            'success': '200'
                                        });
                                    });
                                } else {
                                    connection.rollback(function() {
                                        reject({
                                            'error': 400,
                                            'message': 'Bad request: match does exist.'
                                        });
                                    });
                                }
                            }
                        });
                    });
                });
            }

            connection.release();
        });
    });
}

exports.getCommunityFeedback = function(communityID) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('Error in connection database');
            }
            logger.debug('connected as id ' + connection.threadId);

            var sql = "SELECT  a.fieldID, a.fieldName, a.communityID, a.required, a. displayPriority, a.displayType, b.id,  b.name from match_feedback_field_desc as a inner join match_feedback_field_items as b Where a.communityID = ? and a.fieldID = b.fieldID and a.deleted= 0  and a.deleted=0 ORDER BY a.displayPriority, a.fieldID,  b.name";
            var inserts = [communityID];
            sql = mysql.format(sql, inserts);
            logger.debug("getCommunityFeedback: going to query feedback list: " + sql);
            connection.query(sql, function(err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        var result = {};
                        result["community"] = communityID;
                        result["fields"] = [];
                        var fieldID = -1;
                        var field;
                        for (var i = 0; i < rows.length; i++) {
                            if (fieldID != rows[i].fieldID) {
                                if (fieldID != -1) {
                                    result["fields"].push(field);
                                }
                                fieldID = rows[i].fieldID;
                                field = {};
                                field["fieldID"] = fieldID;
                                field["name"] = rows[i].fieldName;
                                field["className"] = rows[i].fieldName.split(' ').join('-').toLowerCase();
                                field["required"] = rows[i].required == 0 ? false : true;
                                field["grouped"] = false;
                                field["priority"] = rows[i].displayPriority;
                                field["displayType"] = rows[i].displayType;
                                field["values"] = [];
                            }
                            field["values"].push({
                                id: rows[i].id,
                                name: rows[i].name
                            });
                            if (i == rows.length - 1) {
                                result["fields"].push(field);
                            }
                        }

                        console.log("getCommunityFeedback: result: " + result);
                        connection.release();
                        resolve(result);

                    } else {
                        logger.debug("dbConn: unable to find community feedback.");
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

exports.getUserPositions = function(userID) {
    return new Promise(function(resolve, reject) {
        var sql = 'select a.id as positionID, a.companyID as companyID, a.title, a.isEdu, a.startDate, a.endDate, b.name, a.isCurrent from user_position as a left join company_desc as b on a.companyID=b.id where userID = ? and a.deleted = 0';
        var values = [userID];
        sql = mysql.format(sql, values);

        pool.query(sql, function(err, rows, fields) {
            if (!err) {
                logger.debug('Error in connection or query:');
                 var education = [],
                     work = [];
                if (rows.length > 0) {
                   
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        position = {
                            positionID: row.positionID,
                            title: row.title,
                            current: row.isCurrent == 1
                        };

                        if (row.startDate) {
                            position.startDate = row.startDate;
                        }

                        if (row.endDate) {
                            position.endDate = row.endDate;
                        }

                        if (row.isEdu) {
                            position['school'] = row.name;
                            position['schoolID'] = row.companyID,
                                education.push(position);
                        } else {
                            position['company'] = row.name;
                            position['companyID'] = row.companyID,
                                work.push(position);
                        }
                        console.log(position);
                    }
                } 
                resolve({
                    work: work,
                    education: education
                });
            }
            
        });
    });
}

exports.updateUserPositions = function(userID, positions) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                logger.debug('DB connection error');
                logger.debug(err);
                reject({
                    'error': '500',
                    'message': 'DB Error'
                });
                connection.release();
            } else {
                connection.beginTransaction(function(err) {
                    if (err) {
                        logger.debug('DB transaction error');
                        logger.debug(err);
                        connection.release();
                        reject({
                            'error': '500',
                            'message': 'DB Error'
                        });
                    }

                    var sql = 'insert ignore into company_desc (name, industry) values ?';
                    var values = [];

                    for (var i = 0; i < positions.companies.length; i++) {
                        var company = positions.companies[i];
                        values.push([company.company, 0]);
                    }

                    sql = mysql.format(sql, [values]);
                    console.log(sql);

                    connection.query(sql, function(err, rows, fields) {
                        if (err && err.code != 'ER_DUP_ENTRY') {
                            return connection.rollback(function() {
                                logger.debug('Error inserting new companies');
                                reject({
                                    error: 500,
                                    message: 'Error inserting '
                                });
                            });
                        }
                    });

                    values = [];
                    for (var i = 0; i < positions.positions.length; i++) {
                        var position = positions.positions[i];
                        var subQuery = '(?, ?, (select id from company_desc where name = ?), 0, ?, ?, ?)';
                        console.log(position.isEdu);
                        subQuery = mysql.format(subQuery, [position.positionID, userID, position.company, position.title, position.isEdu, position.deleted]);
                        values.push(subQuery);
                    }

                    var sql = 'insert into user_position (id, userID, companyID, isCurrent, title, isEdu, deleted) values ?? on duplicate key update companyID=values(companyID), title=values(title), isEdu=values(isEdu), deleted=values(deleted)';
                    sql = mysql.format(sql, [values]);
                    // this line is hella sketch... don't know how to fix it though
                    sql = sql.replace(/\`/g, '');
                    console.log(sql);

                    connection.query(sql, function(err, rows, fields) {
                        if (err) {
                            console.log(err);
                            return connection.rollback(function() {
                                logger.debug('Error inserting new companies');
                                reject({
                                    error: 500,
                                    message: 'Error inserting '
                                });
                            });
                        }
                    });

                    connection.commit(function(err) {
                        if (err) {
                            connection.rollback(function() {
                                reject({
                                    'error': 500,
                                    'message': 'Error committing changes'
                                });
                            });
                        }
                        resolve({
                            'success': '200'
                        });
                    });

                    connection.release();
                });
            }
        });
    });
}

exports.updateMatchStatus = function(userID, matchID, newStatus) {
    //0:idle, 1: notified, 2: accepted, 3: rejected, 4:feedbacked
    return new Promise(function(resolve, reject) {
        //TODO: status cannot be changed back, add validation before updating!!!
        var sql = "UPDATE user_match SET userAStatus = if(userA = ?, ?, userAStatus), userBStatus = if(userB = ?, ?, userBStatus) WHERE id = ?";
        var values = [userID, newStatus, userID, newStatus, matchID];

        sql = mysql.format(sql, values);
        console.log('updateMatchStatus: going to update db with sql: ' + sql);
        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query:');
                logger.debug(err);
                reject({
                    'error': '500',
                    'message': 'DB Error'
                });
            } else {
                logger.debug('updated MatchStatus for ' + userID + ' for match: ' + matchID);

                sql = "INSERT INTO event_match_status (userID, matchID, newStatus) VALUES (?, ?, ?)";
                values = [userID, matchID, newStatus];
                sql = mysql.format(sql, values);
                console.log('updateMatchStatus: going to log event with sql: ' + sql);
                pool.query(sql, function(err, rows, fields) {
                     if (err) {
                            logger.debug('Error in connection or query:');
                            logger.debug(err);
                        } 
                        resolve({
                                'success': '200'
                        });
                    });
            }
        });
    });
}

exports.getAllMatches = function(communityID) {
    return new Promise(function(resolve, reject) {
        var sql = 'SELECT * FROM coffeechat.user_match Where communityID = ? order by create_at';

        sql = mysql.format(sql, [communityID]);

        console.log('getAllMatches: going to query db with sql: ' + sql);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {
                logger.debug('getAllMatches for community ' + communityID);
                var result = {};
                result["community"] = communityID;
                result["total"] = rows.length;
                if (rows.length > 0) {
                    result["matches"] = [];

                    for (var i = 0; i < rows.length; i++) {
                        match = {};
                        match["id"] = rows[i].id;
                        match["userAID"] = rows[i].userA;
                        match["userAstatus"] = rows[i].userAStatus;
                        match["userBID"] = rows[i].userB;
                        match["userBstatus"] = rows[i].userBStatus;
                        match["matchTime"] = rows[i].create_at;
                        result["matches"].push(match);
                    }

                }
                resolve(result);
            }
        });
    });
}

exports.getCommunityAdmin = function(userID) {
    /* Description:
     * returns the admin for a community
     *
     * Parameters:
     * communityID : int
     *     id for a community
     */

    return new Promise(function(resolve, reject) {
        var sql = 'select id from community_desc where adminUserID = ?';

        sql = mysql.format(sql, [userID]);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('DB connection error');
                logger.debug(err);
                reject({
                    'error': '500',
                    'message': 'DB Error'
                });
                return;
            }

            if (rows.length > 0) {
                logger.debug('getCommunityAdmin for ' + userID + ': ' + rows[0].id);
                resolve(rows);
            } else {
                resolve({});
            }
        });
    });
}

//select a.id, a.userA, a.userB, b.firstName, b.lastName, b.profilePicO, a.userAStatus, a.userBStatus, a.create_at, c.title from user_match as a right join user_basic as b on a.userA = b.id or a.userB = b.id left join user_position as c on b.id = c.userID where isCurrent=1 and communityID = 1 order by create_at;

exports.getCommunityUsers = function(communityID) {
    //select a.id, a.userA, a.userB, b.firstName, b.lastName, b.profilePicO, a.userAStatus, a.userBStatus, a.create_at, c.title from user_match as a right join user_basic as b on a.userA = b.id or a.userB = b.id left join user_position as c on b.id = c.userID where isCurrent=1 and communityID = 1 order by create_at;
    return new Promise(function(resolve, reject) {
        var sql = 'select a.id, a.profilePicO, a.firstName, a.lastName, a.linkedInProfile, b.title, c.name, b.isEdu, b.deleted from user_basic as a left join user_community as d on a.id = d.userID left join user_position as b on a.id = b.userID left join company_desc as c on b.companyID = c.id where d.communityID = ?';

        sql = mysql.format(sql, [communityID])

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {
                var users = [];
                var map = {};
                if (rows.length > 0) {
                    // map reduce users by id
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        if (!map[row.id]) {
                            map[row.id] = {
                                id: row.id,
                                firstName: row.firstName,
                                lastName: row.lastName,
                                linkedInProfile: row.linkedInProfile,
                                // title: row.title,
                                // company: row.name,
                                profilePic: row.profilePicO
                            };
                        }

                        if (row.deleted == 0) {
                            map[row.id].title = row.title;
                            map[row.id].company = row.name;
                        }
                    }

                    var ids = Object.keys(map);
                    for (var i = 0; i < ids.length; i++) {
                        users.push(map[ids[i]]);
                    }

                    resolve(users);
                } else {
                    reject({
                        error: 404,
                        message: 'No users found for this community'
                    })
                }
            }
        });
    });
}


exports.getMatchHistory = function(userID, communityID) {
    return new Promise(function(resolve, reject) {
        // var sql = 'SELECT * FROM coffeechat.user_match Where communityID = ? and ((userA = ? and userAStatus > 2) or (userB = ? and userBStatus > 2) ) order by create_at';
        var sql = 'select a.id, b.id, b.firstName, b.lastName, a.userAStatus, a.userBStatus, a.userA, a.userB, b.profilePicO, b.linkedInProfile, a.create_at FROM user_match as a inner join user_basic as b on (a.userA = b.id or a.userB =b.id) Where communityID = ? and ((userA = ? and userAStatus > 2) or (userB = ? and userBStatus > 2)) and b.id != ? order by a.create_at desc, a.id'

        sql = mysql.format(sql, [communityID, userID, userID, userID]);

        console.log('getCurrentMatches: going to query db with sql: ' + sql);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {
                logger.debug('getCurrentMatches for ' + userID + ' with community ' + communityID);
                var result = {};
                result["community"] = communityID;
                result["total"] = rows.length;
                if (rows.length > 0) {
                    result["matches"] = [];

                    for (var i = 0; i < rows.length; i++) {
                        match = {};
                        match["id"] = rows[i].id;
                        if (rows[i].userA == userID) {
                            match["userID"] = rows[i].userB;
                            match["myID"] = rows[i].userA;
                            match["status"] = rows[i].userBStatus;
                            match["myStatus"] = rows[i].userAStatus;
                        } else {
                            match["userID"] = rows[i].userA
                            match["myID"] = rows[i].userB;
                            match["status"] = rows[i].userAStatus;
                            match["myStatus"] = rows[i].userBStatus;

                        }
                        match['firstName'] = rows[i].firstName;
                        match['lastName'] = rows[i].lastName;
                        match['profilePic'] = rows[i].profilePicO;
                        match['linkedInProfile'] = rows[i].linkedInProfile;
                        match["matchTime"] = rows[i].create_at;
                        result["matches"].push(match);
                    }

                }
                resolve(result);
            }
        });
    });
}

exports.getCurrentMatches = function(userID, communityID) {
    return new Promise(function(resolve, reject) {
        var sql = 'select a.id, b.id as userID, b.firstName, b.email, b.lastName, a.userAStatus, a.userBStatus, a.userA, a.userB, b.profilePicO, b.linkedInProfile, a.create_at from user_match as a inner join user_basic as b on (a.userA = b.id or a.userB = b.id) Where communityID = ? and ((userA = ? and userAStatus < 3) or (userB = ? and userBStatus < 3) ) and b.id != ? order by create_at';

        sql = mysql.format(sql, [communityID, userID, userID, userID]);

        console.log('getCurrentMatches: going to query db with sql: ' + sql);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                console.log(err);
                logger.debug('Error in connection or query');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {
                logger.debug('getCurrentMatches for ' + userID + ' with community ' + communityID);
                var result = {};
                result["community"] = communityID;
                result["total"] = rows.length;
                if (rows.length > 0) {
                    result["matches"] = [];

                    for (var i = 0; i < rows.length; i++) {
                        match = {};
                        match["id"] = rows[i].id;
                        if (rows[i].userA == userID) {
                            match["userID"] = rows[i].userB;
                            match["status"] = rows[i].userBStatus;
                            match["myStatus"] = rows[i].userAStatus;
                        } else {
                            match["userID"] = rows[i].userA;
                            match["status"] = rows[i].userAStatus;
                            match["myStatus"] = rows[i].userBStatus;

                        }
                        match["matchTime"] = rows[i].create_at;
                        match['firstName'] = rows[i].firstName;
                        match['lastName'] = rows[i].lastName;
                        match['profilePic'] = rows[i].profilePicO;
                        match['linkedInProfile'] = rows[i].linkedInProfile;
                        match['email'] = rows[i].email;
                        match["matchTime"] = rows[i].create_at;
                        result["matches"].push(match);
                    }

                }
                resolve(result);
            }
        });
    });
}

exports.insertMatchForCommunity = function(userAID, userBID, communityID) {
    return new Promise(function(resolve, reject) {
        var sql = "INSERT INTO user_match (userA, userB, communityID) " + "Select ?, ?, ? from user_match " + "where not exists " + "(select * from user_match where communityiD=1 and ((userA=? and userB=?) or (userA=? and userB=?))) " + "and exists " + "(select * from user_community where userID=? and communityID=?) " + "and exists " + "(select * from user_community where userID=? and communityID=?) " + "Limit 1";

        values = [userAID, userBID, communityID, userAID, userBID, userBID, userAID, userAID, communityID, userBID, communityID];

        sql = mysql.format(sql, values);
        console.log('insertMatchForCommunity: going to insert with sql: ' + sql);
        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query:');
                logger.debug(err);
                reject({
                    'error': 500,
                    'message': 'DB Error'
                });
            } else {
                logger.debug('insertMatchForCommunity for ' + userAID + ' & ' + userBID);
                if (rows.affectedRows > 0) {
                    resolve({
                        'success': '200'
                    });
                } else {
                    reject({
                        'error': 400,
                        'message': 'Bad request: match already exists, or users do not under given community.'
                    });
                }

            }
        });
    });
}

exports.updateUserProfileForCommunity = function(userID, communityID, surveys) {
    return new Promise(function(resolve, reject) {
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
                                connection.commit(function(err) {
                                    if (err) {
                                        connection.rollback(function() {
                                            reject({
                                                'error': 500,
                                                'message': 'db error.'
                                            });
                                        });
                                    }
                                    resolve({
                                        'success': '200'
                                    });
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
        var sql = 'select b.displayPriority, a.fieldID, a.userID, a.itemID, b.fieldName, b.communityID, b.required, b.displayType, b.macthPriority, c.name, b.grouped, c.group, c.id from user_survey as a left join survey_field_desc as b on a.fieldID=b.fieldID left join survey_field_items as c on a.itemID = c.id where userID=? and a.communityID=? and b.deleted=0  and c.deleted=0 order by b.displayPriority, a.fieldID, c.group';

        // var sql = 'select a.fieldID, a.fieldName, a.communityID, a.required, a. displayPriority, a.displayType, a.grouped, b.id, b.group, b.name, c.itemID from survey_field_desc as a inner join survey_field_items as b left join user_survey as c on c.itemID = b.id where c.userID = ? and a.communityID = ? and a.fieldID = b.fieldID ORDER BY a.displayPriority, a.fieldID, b.group, b.name';
        sql = mysql.format(sql, [userID, communityID]);

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                console.log(err);
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

            var sql = "SELECT  a.fieldID, a.fieldName, a.communityID, a.required, a. displayPriority, a.displayType, a.grouped, b.id, b.group, b.name, b.data, b.deleted from survey_field_desc as a inner join survey_field_items as b Where a.communityID = ? and a.fieldID = b.fieldID and b.deleted= 0  and a.deleted=0 ORDER BY a.displayPriority, a.fieldID, b.group, b.name";
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
                                var val = {};
                                val["id"] = rows[i].id;
                                val["name"] = rows[i].name;
                                var d = rows[i].data;
                                if (d != null && d != "null") {
                                    d = JSON.parse(d);
                                    val["data"] = d;
                                }
                                field["values"].push(
                                    val
                                );

                                // JSON.parse('{"id":' + rows[i].id + ', "name":"' + rows[i].name + '", "data":' + rows[i].data + '}'); 
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

                                var val = {};
                                val["id"] = rows[i].id;
                                val["name"] = rows[i].name;
                                var d = rows[i].data;
                                if (d != null && d != "null") {
                                    d = JSON.parse(d);
                                    val["data"] = d;
                                }
                                group["values"].push(
                                    val
                                );
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

exports.getUserCommunities = function(userID) {
    return new Promise(function(resolve, reject) {
        var sql = 'select communityID from user_community where userID = ?';
        sql = mysql.format(sql, [userID]);
        pool.query(sql, function(err, rows, fields) {
            if (err) {
                logger.debug('Error in connection or query, in getUserCommunities function');
                reject({
                    error: '500',
                    message: 'DB error'
                });
            } else {
                if (rows.length > 0) {
                    resolve(rows);
                } else {
                    reject({
                        error: '404',
                        message: 'Record not found'
                    });
                }
            }
        });
    });
}

exports.getUser = function(userId) {
    return new Promise(function(resolve, reject) {
        var sql = "SELECT u.id, u.firstName, u.lastName, u.email, u.headline, u.profilePicO, u.linkedInProfile, i.`name` as industry, c.communityID From user_basic as u LEFT JOIN industry_desc as i on u.industry = i.id  LEFT JOIN  user_community as c on u.id = c.userID WHERE u.id =? limit 1";
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
                        profilePic: rows[0].profilePicO,
                        communityID: rows[0].communityID
                    };
                    resolve(result);
                } else {
                    logger.debug("dbConn: didnt find user: " + userId);
                    console.log(userId);
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

                        var insertSQL = 'insert into user_basic (firstName, lastName, email, headline, profilePicS, profilePicO, industry, linkedInProfile, linkedinID, LinkedInToken) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

                        inertSQL = mysql.format(insertSQL, [firstName, lastName, email, headline, profilePicS, profilePicO, industryId, linkedInProfile, linkedinID, accessToken]);

                        connection.query(inertSQL, function(err, result) {
                            logger.debug("createUserIfNotExist: inside the  insert callback: " + err + " ... " + result);

                            if (!err) {
                                userId = result.insertId;
                                logger.debug("createUserIfNotExist: created user: " + userId);
                                addPositions(userId, obj.positions, connection);
                                resolve(userId);
                            } else {
                                logger.debug('Error in connection database');
                                connection.release();
                                reject({error: 500, message: err});
                            }
                        });

                    } else {
                        logger.debug('Error in connection database');
                        connection.release();
                        reject({error: 500, message: err})
                    }

                });

            });
        });

    });

}

function addPositions(userId, positions, connection) {
    if (positions === undefined || positions == "undefined" || positions._total == 0) {
        connection.release();
        return;
    }
    try{
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
                if (err){
                    logger.debug("addPositions: err in adding position: " + err + " ... ");
                }
            });

        });
    }
    catch(err)
    {   
        logger.debug("addPositions: err in adding position: " + err );
    }

}