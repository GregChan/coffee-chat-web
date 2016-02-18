$(document).ready(function() {
	$('[data-match]').hide();
	$('[data-feedback]').hide();
	$('select').material_select();
});

$('[data-template-select]').change(function() {
	var value = $('[data-template-select]').val();
	$('[data-match]').hide();
	$('[data-feedback]').hide();
	$('[data-' + value + ']').show();
});

$('[data-match-form]').submit(function() {
	$('[data-kellogg]').val($('#kelloggEmail').val());
	$('[data-prosp]').val($('#prospEmail').val());
	console.log($('[data-prosp]').val());
	console.log($('[data-kellogg]').val());
	$.ajax({
		type: "POST",
		url: "/cat/mail/email",
		data: $(this).serialize(),
		success: function() {
			alert('success');
		}
	});
});

$('[data-feedback-form]').submit(function() {
	$.ajax({
		type: "POST",
		url: "/cat/mail/email",
		data: $(this).serialize(),
		success: function() {
			alert('success');
		}
	});
});