$(function() {
    $('.sidebar-menu > ul > li').mouseover(function() {
        $(this).addClass('active')
    })
    $('.sidebar-menu > ul > li').mouseout(function() {
        $(this).removeClass('active')
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
    $('.header').click(function() {
        $('.sidebar-menu').toggleClass('collapseMenu');
        $('.main-container').toggleClass('collapseMenu');
    })


    $('.sidebar-menu ul ul li').click(function(e) {
        var menuid = e.currentTarget.dataset.menu;
        if(menuid == 11)
            window.location.href = '/basic/user'
        else if(menuid == 12)
            window.location.href = '/basic/company'
        else if(menuid == 13)
            window.location.href = '/basic/plant'
        else if(menuid == 14)
            window.location.href = '/basic/shipper'
        else if(menuid == 15)
            window.location.href = '/basic/quotation'
        else if(menuid == 16)
            window.location.href = '/basic/car'
        else if(menuid == 21)
            window.location.href = '/consignment'
        else if(menuid == 31)
            window.location.href = '/upload/headpic'
        else if(menuid == 32)
            window.location.href = '/upload/swiper'
    })
})