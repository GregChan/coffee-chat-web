$(document).ready(function(){
	$('.parallax').parallax();
    $('.modal-trigger').leanModal();

});

$('.submit').on('click', function() {
    $('#error').empty();
    if(!$('#fName').val() || !$('#lName').val() || !$('#email').val() || !$('#pwd').val() || !$('#comp').val()){
        $('#error').html('Please fill out all fields');
    }
    else{
            $.ajax({
            url: "/cat/user/createUser",
            method: "PUT",
            data: {firstName: $('#fName').val(),
                    lastName: $('#lName').val(),
                    email: $('#email').val(),
                    headline: "Community Administrator",
                    password: $('#pwd').val()},
            });
                
            $.ajax({
            url: "/cat/community",
            method: "PUT",
            data: {name: $('#comp').val(),
                    email: $('#email').val()},
            success: function(data) {
                Materialize.toast('Success!', 2000);
                window.location = '/';
            },
            error: function(data) {
                console.log(data);
                $('#error').html("Error creating community");
            }
            });
    }    
});