(function() {
	$(document).ready(function() {
		$('.modal-trigger').leanModal();

		// $.ajax({
		// 	type: 'GET',
		// 	url: '/cat/user/community/1/profile',
		// 	success: function(data) {
		// 		for (var i = 0; i < data.fields.length; i++) {
		// 			console.log(data.fields[i]);

		// 			var field = data.fields[i];
		// 			if (field.grouped) {
		// 				for (var j = 0; j < field.values.length; j++) {
		// 					var group = field.values[j];
		// 					for (var k = 0; k < group.values.length; k++) {
		// 						var item = group.values[k];
		// 						element = $('#' + field.className + item.id)[0];
		// 						if (field.displayType == 1) {
		// 							element.checked = true;
		// 						}
		// 					}
		// 				}
		// 			} else {
		// 				for (var j = 0; j < field.values.length; j++) {
		// 					var item = field.values[j],
		// 						element = $('#' + field.className + item.id);
		// 					if (field.displayType == 1) {
		// 						element[0].checked = true;
		// 					} else if (field.displayType == 2) {
		// 						console.log(field.values[j].id);
		// 						element = $('#' + field.className + field.fieldID);
		// 						element.val(field.values[j].id);
		// 						element.material_select();
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// });
		$('[data-edit]').hide();
		$('[data-edit-icon]').hide();

		var hideEdit = function(selector) {
			var parentEditable = $(selector).closest('[data-editable]');
			parentEditable.find('[data-edit]').hide();
			parentEditable.find('[data-display]').show();
		}

		$('[data-display]').hover(function(e) {
			var parentEditable = $(this).closest('[data-editable]');
			parentEditable.css('background-color', '#FAFAFA');
			parentEditable.find('[data-edit-icon]').show();
		}, function(e) {
			var parentEditable = $(this).closest('[data-editable]');
			parentEditable.find('[data-edit-icon]').hide();
			parentEditable.css('background-color', 'white');
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

		$('[data-save]').click(function(e) {
			$('[data-work-experience]').find('[data-edit-input]').each(function() {
				var parentEditable = $(this).closest('[data-editable]');
				console.log({
					id: parentEditable.find('[data-display-value]').attr('data-display-value'),
					title: $(this).val()
				});
			});
			$('[data-education]').find('[data-edit-input]');
		});
	});
}());