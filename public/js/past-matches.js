(function() {
    $(document).ready(function() {
        $('.modal-trigger').leanModal();
        for (var i = 0; i < pastMatchData.length; i++) {
            $.ajax({
                type: 'GET',
                url: '/cat/user/' + pastMatchData[i].userID,
                success: function(pastMatch) {
                    $('.past-matches .pastMatch' + pastMatch.userId + ' .match-name').text(pastMatch.firstName + ' ' + pastMatch.lastName);
                    $('.past-matches .pastMatch' + pastMatch.userId + ' .match-title').text(pastMatch.headLine);
                    $('.past-matches .pastMatch' + pastMatch.userId + '.match-link').attr("data-id", pastMatch.userID);
                    $('.past-matches .pastMatch' + pastMatch.userId + ' .match-pic').attr("src", pastMatch.profilePic);
                }
            });
        }

        $('[data-past-match]').click(function(event) {
            $.ajax({
                type: 'GET',
                url: '/cat/user/' + $(this).attr('data-id') + '/profile',
                success: function(userData) {
                    $('#profile').openModal();
                    $('#profile [data-name]').text(userData.firstName + ' ' + userData.lastName);
                    $('#profile [data-title]').text(userData.headLine);
                    $('#profile [data-profile-pic]').attr("src", userData.profilePic);
                    // $(".current-matches .match" + matchId + " #match-link").attr("data-id",userData.userID);
                    if (userData.positions.work) {
                        $('#profile [data-work-container]').empty();
                        for (var i = 0; i < userData.positions.work.length; i++) {
                            $('#profile [data-work-container]').append("<div class='title'>" + userData.positions.work[i].title + "</div><div class='subtitle'>" + userData.positions.work[i].company + "</div>");
                        }
                    }
                    if (userData.positions.education) {
                        $('#profile [data-education-container]').empty();
                        for (var i = 0; i < userData.positions.education.length; i++) {
                            $('#profile [data-education-container]').append("<div class='title'>" + userData.positions.education[i].title + "</div><div class='subtitle'>" + userData.positions.education[i].school + "</div>");
                        }
                    }
                }
            })
        });
    });
}());