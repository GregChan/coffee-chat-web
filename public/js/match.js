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
                // $(".current-matches .match" + matchId + " #match-link").attr("data-id",match.userID);
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
        $('#match-accept').hide();
        $('#match-wait').hide();
        $('#match-rate1').hide();
        $('#match-rate2').hide();
        if (matchStatus < 2) {
            $('#match-accept').show();
        } else if (matchStatus == 2) {
            if(matchStatusB < 2)
            {
                 $('#match-wait').show();
            }
            else
            {
                 $('#match-rate1').show();
                 $('#match-rate2').show();
            }
        }

        $('#submit-rating').click(function(event){
            $.ajax({
                type: 'POST',
                url: '/cat/user/community/feedback/1/' + matchNumber + '/update',
                success: function(data) {    
                    $.ajax({
                        type: 'POST',
                        url: '/cat/user/community/1/match/feedback',
                        success: function(data) {
                            mixpanel.track('feedback-rating ' + $('#feedback_rating').val());
                            window.location.reload();
                        },
                        data: {
                            "matchID":matchNumber
                        }
                    });
                },
                data: {
                    data: [{     
                    fieldID: 1,
                    choices: [$('#feedback_rating').val()]
                    }]
                }
            });
        });
        $('#accept-match').click(function(event){
            $.ajax({
                type: 'POST',
                url: '/cat/user/community/1/match/accept',
                success: function(data) {
                    mixpanel.track('accept-match');
                    window.location.reload();
                },
                data: {
                    "matchID":matchNumber
                }
            });
        });
        $('#decline-match').click(function(event){
            $.ajax({
                type: 'POST',
                url: '/cat/user/community/1/match/reject',
                success: function(data) {
                    mixpanel.track('reject-match');
                    window.location.reload();
                },
                data: {
                    "matchID":matchNumber
                }
            });
        });
        $('.rating a').click(function(event){
            $(this).siblings('a').removeClass('active');
            $(this).addClass('active');
            $('#submit-rating').show();
            switch($(this).attr("id")){
                case "one":
                    $('#feedback_rating').val('1');
                    break;
                case "two":
                    $('#feedback_rating').val('11');
                    break;
                case "three":
                    $('#feedback_rating').val('21');
                    break;
                case "four":
                    $('#feedback_rating').val('31');
                    break;
                case "five":
                    $('#feedback_rating').val('41');
                    break;
            }
        });
	});
}());