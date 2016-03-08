(function() {
	$(document).ready(function() {
		$('.modal-trigger').leanModal();
		var fname;
		$.ajax({
			type: 'GET',
			url: '/cat/user/' + matchId + '/profile',
			success: function(match) {
                $(".current-matches .match" + matchId + " #match-name").text(match.firstName + ' ' + match.lastName);
                $(".current-matches .match" + matchId + " #match-title").text(match.headLine);
                $(".current-matches .match" + matchId + " #match-link").attr("href",match.linkedInProfile);
                $(".current-matches .match" + matchId + " #match-pic").attr("src",match.profilePic);
                if (match.positions.work) {
                    for (var i = 0; i < match.positions.work.length; i++) {
                        $(".current-matches .match" + matchId + " #work-container").append("<div class='title'>"+match.positions.work[i].title+"</div><div class='subtitle'>"+match.positions.work[i].company+"</div>");
                    }
                }
                if (match.positions.education) {
                    for (var i = 0; i < match.positions.education.length; i++) {
                        $(".current-matches .match" + matchId + " #education-container").append("<div class='title'>"+match.positions.education[i].title+"</div><div class='subtitle'>"+match.positions.education[i].school+"</div>");
                    }
                }
			}
		});
		$.ajax({
			type: 'GET',
			url: '/cat/user/community/1/' + matchId + '/profile',
			success: function(profile) {
                if (profile && profile.fields) {
                    for (var i = 0; i < profile.fields.length; i++) {
                        for (var j = 0; j < profile.fields[i].values.length; j++) {
                            $(".current-matches .match" + matchId + " #interests-container").append("<div>#"+profile.fields[i].values[j].name+"</div>");
                        }
                    }
                }
			}
		});
        $('#submit-rating').hide();
        $('#submit-rating').click(function(event){
            $('#submit-rating').hide();
        });
        $('#accept-match').click(function(event){
            $('#match-accept').hide();
            $('#match-rate').show();
        });
        $('.rating a').click(function(event){
            $(this).siblings('a').removeClass('active');
            $(this).addClass('active');
            $('#submit-rating').show();
        });
	});
}());