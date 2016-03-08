(function() {
	$(document).ready(function() {
		$('.modal-trigger').leanModal();
		var fname;
		$.ajax({
			type: 'GET',
			url: '/cat/user/' + matchId,
			success: function(match) {
			   console.log(match);
			   $(".current-matches .match" + matchId + " #match-name").text(match.firstName + ' ' + match.lastName);
			   $(".current-matches .match" + matchId + " #match-title").text(match.headLine);
			   $(".current-matches .match" + matchId + " #match-link").attr("href",match.linkedInProfile);
			   $(".current-matches .match" + matchId + " #match-pic").attr("src",match.profilePic);
			   fname = match.firstName;
			}
		});
		$.ajax({
			type: 'GET',
			url: '/cat/user/community/1/' + matchId + '/profile',
			success: function(profile) {
                console.log(profile);
			}
		});
	});
}());