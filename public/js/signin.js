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
				Materialize.toast('Success!', 2000)
				window.location = '/admin/talent';
			}, 
            error: function(data) {
                $('#error').html('Invalid username or password');
            }
		});
		
	});
})();