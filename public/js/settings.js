(function() {
	$(document).ready(function() {
		$('.modal-trigger').leanModal();

		$.ajax({
			type: 'GET',
			url: '/cat/user/community/1/profile',
			success: function(data) {
				for (var i = 0; i < data.fields.length; i++) {
					console.log(data.fields[i]);

					var field = data.fields[i];
					if (field.grouped) {
						for (var j = 0; j < field.values.length; j++) {
							var group = field.values[j];
							for (var k = 0; k < group.values.length; k++) {
								var item = group.values[k];
								element = $('#' + field.className + item.id)[0];
								if (field.displayType == 1) {
									element.checked = true;
								}
							}
						}
					} else {
						for (var j = 0; j < field.values.length; j++) {
							var item = field.values[j],
								element = $('#' + field.className + item.id);
							if (field.displayType == 1) {
								element[0].checked = true;
							} else if (field.displayType == 2) {
								console.log(field.values[j].id);
								element = $('#' + field.className + field.fieldID);
								element.val(field.values[j].id);
								element.material_select();
							}
						}
					}
				}
			}
		});

		$('[data-edit]').hide();
		$('[data-edit-icon]').hide();
		$('[data-survey]').hide();

		var hideEdit = function(selector) {
				var parentEditable = $(selector).closest('[data-editable]');
				parentEditable.find('[data-edit]').hide();
				parentEditable.find('[data-display]').show();
			},
			processWorkAndEducationData = function(selector, postData, isEdu) {
				var positionElement = $(selector).find('[data-position]');
				var companyElement = $(selector).find('[data-company]');
				if (companyElement.val() != "" && positionElement.val() != "") {
					postData.positions.push({
						positionID: positionElement.attr('data-id'),
						company: companyElement.val(),
						title: positionElement.val(),
						isEdu: isEdu
					});
					postData.companies.push({
						companyID: companyElement.attr('data-id'),
						company: companyElement.val()
					});
				}
			},
			makeEditable = function() {
				$('[data-edit-area]').hover(function(e) {
					$(this).css('background-color', '#FAFAFA');
					$(this).find('[data-edit-icon]').show();
					$(this).find('[data-add-icon]').show();
				}, function(e) {
					$(this).find('[data-edit-icon]').hide();
					$(this).find('[data-add-icon]').hide();
					$(this).css('background-color', 'white');
				});

				$('[data-edit-icon]').click(function(e) {
					var parentEditable = $(this).closest('[data-editable]');
					parentEditable.find('[data-edit]').show();
					parentEditable.find('[data-display]').hide();
				});

				$('[data-confirm-icon]').click(function(e) {
					var parentEditable = $(this).closest('[data-editable]');
					var value = parentEditable.find('[data-edit-input]').val();
					parentEditable.find('[data-display-value]').html(value);
					hideEdit(this);
					$('[data-save-prompt]').show();
				});

				$('[data-cancel-icon]').click(function(e) {
					var parentEditable = $(this).closest('[data-editable]');
					var value = parentEditable.find('[data-display-value]').html();
					parentEditable.find('[data-edit-input]').val(value);
					hideEdit(this);
				});
			};

		$('[data-add-icon]').click(function() {
			var target = $(this).attr('data-add-icon');
			var type = $(this).attr('data-type');
			var newEditableTemplate = $('[data-edit-template]').clone();
			newEditableTemplate.attr(type, '');
			newEditableTemplate.removeClass('hide');
			newEditableTemplate.removeAttr('data-edit-template');
			newEditableTemplate.find('[data-edit]').show();
			newEditableTemplate.find('[data-display]').hide();
			$('[' + target + ']').append(newEditableTemplate);
			makeEditable();
		});

		$('[data-save]').click(function(e) {
			var postData = {
				companies: [],
				positions: []
			}
			$('[data-work-experience]').each(function() {
				processWorkAndEducationData(this, postData, 0);
			});
			$('[data-education]').each(function() {
				processWorkAndEducationData(this, postData, 1);
			});
			// console.log(postData);
			$.ajax({
				type: 'POST',
				url: '/settings',
				data: postData,
				success: function(data) {
					window.location.href = "/settings";
				}
			});
		});

		$('[data-more]').click(function(e) {
			$('[data-survey]').toggle();
			if ($('[data-survey]').is(':visible')) {
				$('[data-more]').html('SHOW FEWER SETTINGS');
			} else {
				$('[data-more]').html('SHOW MORE SETTINGS');
			}
		});

		makeEditable();
	});

	var elements = {
		nodes: [{
			data: {
				id: "me",
				'background-image': 'https://farm8.staticflickr.com/7272/7633179468_3e19e45a0c_b.jpg'
			}
		}],
		edges: []
	};

	var url = $('[data-profile-image]').attr('src');
	var stylesheet = cytoscape.stylesheet().selector('node')
		.css({
			'height': 80,
			'width': 80,
			'background-fit': 'cover'
		})
		.selector('edge')
		.css({
			'width': 3,
			'line-color': '#EC6445'
		}).selector('#me')
		.css('background-image', url)
		.css('height', 160).css('width', 160);

	$.ajax({
		type: 'GET',
		url: '/cat/user/community/1/match/history',
		success: function(data) {
			for (var i = 0; i < data.matches.length; i++) {
				console.log(data.matches[i]);
				$.ajax({
					type: 'GET',
					url: '/cat/user/' + data.matches[i].userID,
					success: function(pastMatch) {
						var id = pastMatch.firstName + '-' + pastMatch.lastName;
						elements.nodes.push({
							data: {
								id: id
							}
						});

						elements.edges.push({
							data: {
								source: "me",
								target: id
							}
						});

						stylesheet.selector('#' + id).css('background-image', pastMatch.profilePic);

						var cy = cytoscape({
							container: document.getElementById('cy'),
							boxSelectionEnabled: false,
							autounselectify: true,
							style: stylesheet,
							elements: elements,
							layout: {
								name: 'concentric',
								padding: 10
							}
						});
					}
				});
			}
		}
	});
}());