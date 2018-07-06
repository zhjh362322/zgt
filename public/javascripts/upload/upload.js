$(function() {
    $('#headpic').change(function(e) {
        var fm = new FormData($('#headpic')[0]);
        var url = '/upload/headpic';
        uploadPic(url, fm);
    })
    $('#swiper').change(function() {
        var fm = new FormData($('#swiper')[0]);
        var url = '/upload/swiper';
        uploadPic(url, fm);
    })

    function uploadPic(url, data) {
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            dataType: 'JSON',
            cache: false,
            processData:false,
            contentType:false,
            success: function(data, status) {
                if(status === 'success' && data.code == 304) {
                    console.log(data)
                } else {
                    window.location.reload();
                }
            },
            error: function(xhr, err) {
                console.log(err)
            }
        })
    }
})