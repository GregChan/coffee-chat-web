(function() {
	$(document).ready(function() {
		$('.modal-trigger').leanModal();
        for (var i = 0; i < pastMatchData.length; i++) {
            $.ajax({
                type: 'GET',
                url: '/cat/user/' + pastMatchData[i].userID,
                success: function(pastMatch) {
                    $('.past-matches .pastMatch' + pastMatch.userId + ' .match-name').text(pastMatch.firstName + ' ' + pastMatch.lastName);
                    $('.past-matches .pastMatch' + pastMatch.userId + ' .match-title').text(pastMatch.headLine);
                    $('.past-matches .pastMatch' + pastMatch.userId + '.match-link').attr("href",pastMatch.linkedInProfile);
                    $('.past-matches .pastMatch' + pastMatch.userId + ' .match-pic').attr("src",pastMatch.profilePic);
                }
            });
        }
	});
}());