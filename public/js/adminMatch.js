(function() {
    $(document).ready(function() {

        $('select').material_select();

        $('#submit').click(function(e) {
            var postData = {
                "userA": $("#user1").val(),
                "userB": $("#user2").val()
            }
            console.log(postData);
            $.ajax({
                type: 'POST',
                url: '/cat/user/community/1/match/insert',
                data: postData,
                success: function(data) {
                    Materialize.toast('Success!', 2000);
                    $('#user1').val('');
                    $('#user2').val('');
                },
                error: function(textStatus, errorThrown) {
                    Materialize.toast('These users have already been matched!', 3000);
                }
            });
        });
        $('#automatch').click(function(e) {
            $.ajax({
                type: 'POST',
                url: '/cat/user/community/1/match/automatch',
                success: function(data) {
                    console.log(data);
                    Materialize.toast('Success!', 2000);
                },
                error: function(textStatus, errorThrown) {
                    console.log(errorThrown);
                    Materialize.toast('Automatching error!', 3000);
                }
            });
        });
    });
})();