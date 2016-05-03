$(document).on('scroll', function (e) {
    $('.sticky-nav').css('background-color', 'rgba(255,255,255,'+($(document).scrollTop() / 100)+')');
    $('.sticky-nav').css('border-bottom-color', 'rgba(170,165,165,'+($(document).scrollTop() / 100)+')');
});