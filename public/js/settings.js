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
						var values = [];
						for (var j = 0; j < field.values.length; j++) {
							var item = field.values[j],
								element = $('#' + field.className + item.id);
							if (field.displayType == 1) {
								element[0].checked = true;
							} else if (field.displayType == 2) {
								element = $('#' + field.className + field.fieldID);
								values.push(field.values[j].id);
							}
						}
						
						if (field.displayType == 2) {
							element.val(values);
							element.material_select();
						}
					}
				}
			}
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


		console.log(pastMatches);

		for (var i = 0; i < pastMatches.matches.length; i++) {
			console.log(pastMatches.matches[i]);
			$.ajax({
				type: 'GET',
				url: '/cat/user/' + pastMatches.matches[i].userID,
				success: function(pastMatch) {
					var id = pastMatch.firstName.split(' ').join('-') + '-' + pastMatch.lastName.split(' ').join('-');
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
	});
}());