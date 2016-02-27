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
							} else if(field.displayType == 2) {
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
	});
}());