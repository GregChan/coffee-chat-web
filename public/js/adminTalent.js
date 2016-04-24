(function() {
	$(document).ready(function() {
		$('[data-modal-trigger]').leanModal();

		$(".button-collapse").sideNav();
		var groupsTemplate = $('[data-group-template]');
		var modalTemplate = $('[data-modal-template]');
		groupsTemplate.removeAttr('data-group-template');
		modalTemplate.removeAttr('data-modal-template');

		var createGroupListItemFromTemplate = function(groupID, groupName) {
			var newTemplate = groupsTemplate.clone();
			var groupElement = newTemplate.find('[data-group]');
			var hyphenatedName = groupName.split(' ').join('-').toLowerCase();
			groupElement.attr('data-id', groupID);
			groupElement.html(groupName);
			groupElement.attr('href', '#' + groupName.split(' ').join('-').toLowerCase());
			$('[data-groups]').append(newTemplate);
			var settingsElement = newTemplate.find('[data-group-settings]');
			settingsElement.attr('data-target', 'settings-' + hyphenatedName + '-' + groupID);
			settingsElement.attr('href', '#settings-' + hyphenatedName + '-' + groupID);

			return newTemplate;
		};

		var createModalFromTemplate = function(groupID, groupName, listTemplate) {
			var newModalTemplate = modalTemplate.clone();
			var hyphenatedName = groupName.split(' ').join('-').toLowerCase();
			var deleteButton = newModalTemplate.find('[data-delete-group]');
			var addUserButton = newModalTemplate.find('[data-add-group-user]');

			newModalTemplate.attr('id', 'settings-' + hyphenatedName + '-' + groupID);

			addUserButton.attr('data-id', groupID);

			deleteButton.attr('data-id', groupID);
			deleteButton.html('Delete ' + groupName + ' Group');
			deleteButton.attr('href', '#delete-' + hyphenatedName);

			(function(listTemplate, modalTemplate) {
				deleteButton.click(function(e) {
					$.ajax({
						type: 'POST',
						url: '/cat/community/1/group/delete',
						data: {
							id: deleteButton.attr('data-id')
						},
						success: function(data) {
							listTemplate.hide();
							modalTemplate.closeModal();
						}
					});
				});

				addUserButton.click(function(e) {
					console.log("add user");
					$.ajax({
						type: 'POST',
						url: '/cat/community/1/group/' + addUserButton.attr('data-id') + '/insert',
						data: {
							userID: modalTemplate.find('[data-user]').val()
						},
						success: function(data) {
							location.reload();
						}
					});
				});
			})(listTemplate, newModalTemplate);

			$('[data-modals]').append(newModalTemplate);
			return newModalTemplate;
		};

		var groups = {};

		$.ajax({
			type: 'GET',
			url: '/cat/community/1/group',
			success: function(groups) {
				for (var i = 0; i < groups.length; i++) {
					var newListTemplate = createGroupListItemFromTemplate(groups[i].groupID, groups[i].groupName);
					var newModalTemplate = createModalFromTemplate(groups[i].groupID, groups[i].groupName, newListTemplate);

					console.log(newListTemplate);

					(function(newListTemplate) {
						$.ajax({
							type: 'GET',
							url: '/cat/community/1/group/' + groups[i].groupID + '/users',
							success: function(groupUsers) {
								(function(users, newListTemplate) {
									newListTemplate.click(function(e) {
										$('[data-user]').hide();
										if (users) {
											for (var i = 0; i < users.length; i++) {
												$('.' + users[i].id).show();
											}
										}
									});
								})(groupUsers.users, newListTemplate);
							}
						});
					})(newListTemplate);
				}

				$('select').material_select();
				$('[data-modal-trigger]').leanModal();
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