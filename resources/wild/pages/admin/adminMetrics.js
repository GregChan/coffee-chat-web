var exports = module.exports = {},
	request = require('request'),
	async = require('async'),
	MixpanelExport = require('mixpanel-data-export');

panel = new MixpanelExport({
  api_key: "7e6b48a33a7e531684aebc32711da3e2",
  api_secret: "58626d12dc5dafe2c38bc7d3a2b9343d"
});

exports.path = 'admin/metrics';


exports.getHandle = function(req, res) {
	var action, joinsDay, joinsMonth, acceptDay, 
	acceptMonth, rejectDay, rejectMonth, feedDay, 
	feedMonth, savepDay, savepMonth, savesDay, savesMonth;
	if(req.communityID == '41'){
		action = "join-community Deloitte";
	}
	else if(req.communityID == '31'){
		action = "join-community FemaleFounders";
	}
	else{
		action = "join-community MEM";
	}
	panel.segmentation({
		event: action,
		from_date: "2016-05-01",
		to_date: "2016-06-01",
		unit: "day"
	}).then(function(data) {
		joinsDay = data["data"].values[action];
	});
	panel.segmentation({
		event: action,
		from_date: "2016-05-01",
		to_date: "2016-06-01",
		unit: "month"
	}).then(function(data) {
		joinsMonth = data["data"].values[action];
	});
	panel.segmentation({
		event: "accept-match",
		from_date: "2016-05-01",
		to_date: "2016-06-01",
		unit: "month"
	}).then(function(data) {
		acceptMonth = data["data"].values["accept-match"];
	});
	panel.segmentation({
		event: "accept-match",
		from_date: "2016-05-01",
		to_date: "2016-06-01",
		unit: "day"
	}).then(function(data) {
		acceptDay = data["data"].values["accept-match"];
	});
	panel.segmentation({
		event: "reject-match",
		from_date: "2016-05-01",
		to_date: "2016-06-01",
		unit: "month"
	}).then(function(data) {
		rejectMonth = data["data"].values["reject-match"];
	});
	panel.segmentation({
		event: "reject-match",
		from_date: "2016-05-01",
		to_date: "2016-06-01",
		unit: "day"
	}).then(function(data) {
		rejectDay = data["data"].values["reject-match"];
	});
	panel.segmentation({
		event: "feedback-rating 1",
		from_date: "2016-05-01",
		to_date: "2016-06-01",
		unit: "month"
	}).then(function(data) {
		feedMonth = data["data"].values["feedback-rating 1"];
	});
	panel.segmentation({
		event: "feedback-rating 1",
		from_date: "2016-05-01",
		to_date: "2016-06-01",
		unit: "day"
	}).then(function(data) {
		feedDay = data["data"].values["feedback-rating 1"];
	});
	panel.segmentation({
		event: "save-profile",
		from_date: "2016-05-01",
		to_date: "2016-06-01",
		unit: "day"
	}).then(function(data) {
		savepDay = data["data"].values["save-profile"];
	});
	panel.segmentation({
		event: "save-profile",
		from_date: "2016-05-01",
		to_date: "2016-06-01",
		unit: "month"
	}).then(function(data) {
		savepMonth = data["data"].values["save-profile"];
	});
	panel.segmentation({
		event: "save-survey",
		from_date: "2016-05-01",
		to_date: "2016-06-01",
		unit: "day"
	}).then(function(data) {
		savesDay = data["data"].values["save-survey"];
	});
	panel.segmentation({
		event: "save-survey",
		from_date: "2016-05-01",
		to_date: "2016-06-01",
		unit: "month"
	}).then(function(data) {
		savesMonth = data["data"].values["save-survey"];
	});
	async.parallel([
			function(callback) {
				request({
					url: process.env.BASE_URL + '/cat/community/1/users',
					method: 'GET',
					headers: {
						'Cookie': 'userID=' + req.cookies.userID
					}
				}, function(error, response, body) {
					if (response.statusCode == 200) {
						callback(error, JSON.parse(body));
					} else {
						callback(new Error("Error"), null);
					}
				});
			},
			function(callback) {
				request({
					url: process.env.BASE_URL + '/cat/community/1/commanalytics',
					method: 'GET',
					headers: {
						'Cookie': 'userID=' + req.cookies.userID
					}
				}, function(error, response, body) {
					callback(error, JSON.parse(body));
				});
			},

			function(callback) {
				request({
					url: process.env.BASE_URL + '/cat/user/community/1/match/all',
					method: 'GET',
					headers: {
						'Cookie': 'userID=' + req.cookies.userID
					}
				}, function(error, response, body) {
					callback(error, JSON.parse(body));
				});
			}
		],
		function(err, results) {
			if (!err) {
				console.log(results[0]);
				// if(joinsDay joinsMonth)
				var data = {
					users: results[0],
					metrics: results[1],
					matches: results[2],
					joinsDay: joinsDay,
					joinsMonth: joinsMonth,
					acceptDay: acceptDay,
					acceptMonth: acceptMonth,
					rejectDay: rejectDay,
					rejectMonth: rejectMonth,
					feedDay: feedDay,
					feedMonth: feedMonth,
					savepDay: savepDay,
					savepMonth: savepMonth,
					savesDay: savesDay,
					savesMonth: savesMonth
				}

				res.render('admin-metrics', data);
			} else {
				res.sendStatus(500);
			}
		});
}