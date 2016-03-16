(function() {
	$(document).ready(function() {
		$(".button-collapse").sideNav();

		var template = $('[data-past-match-template]');
		template.removeAttr('data-past-match-template');

		console.log(users.length);

		for (var i = 0; i < users.length; i++) {
			console.log(users[i]);
			$.ajax({
				type: 'GET',
				url: '/cat/user/' + users[i].id + '/community/1/match/history',
				success: function(pastMatches) {
					if (pastMatches.matches != undefined) {
						for (var j = 0; j < Math.min(pastMatches.matches.length, 3); j++) {
							var row = $('.' + pastMatches.matches[j].myID);
							var pastMatchesSection = row.find('[data-past-matches]');
							var pastMatch = pastMatches.matches[j];
							var newTemp = template.clone();
							newTemp.find('[data-past-match-image]').attr('src', pastMatch.profilePic);
							newTemp.find('[data-past-match-link]').attr('href', pastMatch.linkedInProfile);
							newTemp.show();
							pastMatchesSection.append(newTemp);
						}
					}
				}
			});
		}
	});
})();