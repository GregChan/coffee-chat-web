(function() {
	$(document).ready(function() {
		$('.modal-trigger').leanModal();
		var fname;
		$.ajax({
			type: 'GET',
			url: '/cat/user/' + matchData.userID,
			success: function(match) {
			   console.log(match);
			   $(".current-matches #match-name,#match-name2").text(match.firstName + ' ' + match.lastName);
			   $(".current-matches #match-title,#match-title2").text(match.headLine);
			   $(".current-matches #about-match").text('About ' + match.firstName);
			   $(".current-matches #match-link").attr("href",match.linkedInProfile);
			   $(".current-matches #match-pic,#match-pic2").attr("src",match.profilePic);
			   fname = match.firstName;
			}
		});
		$.ajax({
			type: 'GET',
			url: '/cat/user/community/1/' + matchData.userID + '/profile',
			success: function(profile) {
				if ($.isEmptyObject(profile)) {
					$(".current-matches #match-data").append("<div>"+fname+" has not filled out his or her profile yet!</div>");
				} else {
					var fields = profile.fields;
					for (var i = 0; i < fields.length; i++) {
						var field = profile.fields[i];
						$(".current-matches #match-data").append("<div class='col-block' id='col-block"+i+"'><h5 class='text-orange'>"+profile.fields[i].name+"</h5></div>");
						if (field.grouped) {
							for (var j = 0; j < field.values.length; j++) {
								var group = field.values[j];
								for (var k = 0; k < group.values.length; k++) {
									var item = group.values[k];
										$(".current-matches #col-block"+i).append("<div>"+item.name+"</div>");
								}
							}
						} else {
							var group = field.values;
							for (var j = 0; j < group.length; j++) {
								var item = field.values[j],
									element = $('#' + field.className + item.id);
								$(".current-matches #col-block"+i).append("<div>"+item.name+"</div>");
							}
						}
					}
			   }
			}
		});
	});
}());