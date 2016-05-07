$(document).ready(function(){
	$('.parallax').parallax();
    $('.modal-trigger').leanModal();

});

$('.submit').on('click', function() {
    var addedAdmin = false;
    $.ajax({
        url: "/cat/user/createUser",
        method: "PUT",
        data: {firstName: $('#fName').val(),
                lastName: $('#lName').val(),
                email: $('#email').val(),
                headline: "Community Administrator",
                password: $('#pwd').val()},
        success: function(data) {
            addedAdmin = true;
            console.log(data);
        }
    });
    if(addedAdmin){
        $.ajax({
        url: "/cat/community",
        method: "PUT",
        data: {name: $('#comp').val(),
                email: $('#email').val()},
        success: function(data) {
            console.log(data);
        }
        });
    }
    
});