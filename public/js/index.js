(function() {
	$('[data-submit]').click(function(e) {
		console.log("GO");
		$.ajax({
			url: "/wild/user/login",
			method: "POST",
			data: {
				email: $('#email').val(),
				pw: $('#password').val()
			},
			success: function(data) {
				console.log(data);
			}
		});
		$('#code').html('Please enter a valid company code');
	});
})();