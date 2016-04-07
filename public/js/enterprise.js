$(document).ready(function(){
	$('.parallax').parallax();
    $('.modal-trigger').leanModal();

});

$('.submit').on('click', function() {
    $.ajax({
    	url: "/cat/community",
    	method: "PUT",
    	data: {name: $('#name').val()},
    	success: function(data) {
    		console.log(data);
    	}
    });
});