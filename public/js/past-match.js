(function() {
	$(document).ready(function() {
		$('.modal-trigger').leanModal();
		$.ajax({
			type: 'GET',
			url: '/cat/user/' + pastMatchData.userID,
			success: function(pastMatch) {
				$('.past-matches #match-name').text(pastMatch.firstName + ' ' + pastMatch.lastName);
				$('.past-matches #match-title').text(pastMatch.headLine);
				$('.past-matches #match-link').attr("href",pastMatch.linkedInProfile);
				$('.past-matches #match-pic').attr("src",pastMatch.profilePic);
			}
		});
	});
}());