(function() {
	$(document).ready(function() {
		$('select').material_select();
		$('[data-modal-trigger]').leanModal();

		$(".button-collapse").sideNav();
		var groupsTemplate = $('[data-group-template]');
		groupsTemplate.removeAttr('data-group-template');

		var createGroupListItemFromTemplate = function(groupID, groupName) {
			var newTemplate = groupsTemplate.clone();
			var groupElement = newTemplate.find('[data-group]');
			groupElement.attr('data-id', groupID);
			groupElement.html(groupName);
			groupElement.attr('href', '#' + groupName.split(' ').join('-').toLowerCase());
			$('[data-groups]').append(newTemplate);

			return newTemplate;
		}

		var groups = {};

		$.ajax({
			type: 'GET',
			url: '/cat/community/1/group',
			success: function(groups) {
				for (var i = 0; i < groups.length; i++) {
					var newTemplate = createGroupListItemFromTemplate(groups[i].groupID, groups[i].groupName);

					(function(newTemplate) {
						$.ajax({
							type: 'GET',
							url: '/cat/community/1/group/' + groups[i].groupID + '/users',
							success: function(groupUsers) {
								(function(users, newTemplate) {
									newTemplate.click(function(e) {
										$('[data-user]').hide();
										if (users) {
											for (var i = 0; i < users.length; i++) {
												$('.' + users[i].id).show();
											}
										}
									});
								})(groupUsers.users, newTemplate);
							}
						});
					})(newTemplate);
				}
			}
		});

		$('[data-all]').click(function(e) {
			$('[data-user]').show();
		});

		$('[data-delete-group]').click(function(e) {
			$('[data-group]')
		});

		$('[data-create-group]').click(function(e) {
			var data = {
				name: $('[data-group-name]').val()
			};
			$.ajax({
				type: 'POST',
				url: '/cat/community/1/group/update',
				data: data,
				success: function(data) {
					var newTemplate = createGroupListItemFromTemplate(0, $('[data-group-name]').val());
				}
			});
		});

		var pastMatchTemplate = $('[data-past-match-template]');
		pastMatchTemplate.removeAttr('data-past-match-template');

		for (var i = 0; i < users.length; i++) {
			$.ajax({
				type: 'GET',
				url: '/cat/user/' + users[i].id + '/community/1/match/history',
				success: function(pastMatches) {
					if (pastMatches.matches != undefined) {
						for (var j = 0; j < Math.min(pastMatches.matches.length, 3); j++) {
							var row = $('.' + pastMatches.matches[j].myID);
							var pastMatchesSection = row.find('[data-past-matches]');
							var pastMatch = pastMatches.matches[j];
							var newTemp = pastMatchTemplate.clone();
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