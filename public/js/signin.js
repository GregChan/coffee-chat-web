(function() {
	$('.modal-trigger').leanModal();
	$('[data-submit]').click(function(e) {
		$.ajax({
			url: "/wild/user/login",
			method: "POST",
			data: {
				email: $('#email').val(),
				pw: $('#password').val()
			},
			success: function(data) {
				window.location = '/admin/talent';
			}
		});
		$('#code').html('Please enter a valid company code');
	});
})();