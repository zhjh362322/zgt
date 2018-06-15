$(document).ready(function() {
    $('.level select').change(function(e) {
        var opt = $(this).children('option:selected').val();
        if(opt > 0) {
            $.get('/basicdata/users?level=' + opt, function(result) {
                var option = '';
                for(var i = 0; i <= result.length - 1; i++) {
                    option += "<option value=\"" + result[i]._id + "\">" + result[i].name + "</option>";
                }
                $('.owner select').html(option);
                $('.owner').addClass('active');
            });
        } else {
            $('.owner select').html('');
            $('.owner').removeClass('active');
        }
    })
});