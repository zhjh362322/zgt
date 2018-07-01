$(function() {
    $('.sidebar-menu > ul > li').click(function() {
        $(this).toggleClass('active')
    })
    $('.basic').mouseover(function(e) {
        $('.basic .menu-text a').css('color', '#FFF')
        $('.basic icon').css('color', '#FFF')
        $('.basic .menu-block').stop(true, false).animate({width: '46px'});
    })
    $('.basic').mouseout(function(e) {
        $('.basic .menu-text a').css('color', '#337ab7')
        $('.basic icon').css('color', '#8dacc4')
        $('.basic .menu-block').stop(true, false).animate({width: '5px'})
    })
    $('.order').mouseover(function(e) {
        $('.order .menu-text a').css('color', '#FFF')
        $('.order icon').css('color', '#FFF')
        $('.order .menu-block').stop(true, false).animate({width: '46px'});
    })
    $('.order').mouseout(function(e) {
        $('.order .menu-text a').css('color', '#337ab7')
        $('.order icon').css('color', '#8dacc4')
        $('.order .menu-block').stop(true, false).animate({width: '5px'})
    })
    $('.userinfo').click(function() {
        $('.userinfodrop').toggle()
    })
    // $('.header').click(function() {
    //     $('.menu-text').toggle();
    //     var width = $('.sidebar-menu').css('width');
    //     console.log(width)
    //     if(width == '50px') {
    //         $('.sidebar-menu').css('width', '240px');
    //     } else {
    //         $('.sidebar-menu').css('width', '50px');
    //     }
    // })
})